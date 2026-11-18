// Pure delivery/analytics tests. No browser sessions or external requests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {webcrypto,createHash} = require('node:crypto');
const path = require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/guides/guide-download.js'),'utf8');
const pdf=Buffer.from('%PDF-1.7\ncomplete test PDF\n%%EOF');
const sha=createHash('sha256').update(pdf).digest('hex');
class Element {
 constructor(attrs={}){this.attrs=attrs;this.listeners={};this.children=[];this.textContent='Download the guide';this.href=attrs.href;}
 getAttribute(k){return this.attrs[k]??null;}
 setAttribute(k,v){this.attrs[k]=v;}
 hasAttribute(k){return k in this.attrs;}
 addEventListener(k,fn){this.listeners[k]=fn;}
 appendChild(e){this.children.push(e);return e;}
 querySelector(){return this.children.find(e=>e.attrs&&'data-guide-status'in e.attrs)||null;}
 remove(){}
 click(){if(this.onClick)this.onClick();}
}
function setup(options={}){
 let consent=options.consent!==false,downloads=0;
 const events=[],timers=[],panel=new Element();
 const anchors=['Opening section','Closing section'].map(location=>{
  const a=new Element({href:'https://lucentstar.ai/assets/guides/chatgpt-business-hub-guide.pdf',download:'guide.pdf','data-guide-download':'chatgpt-business-hub','data-guide-location':location,'data-guide-bytes':String(pdf.length),'data-guide-sha256':sha});
  a.parentNode={parentNode:panel};return a;
 });
 const cta=new Element({'data-guide-open':'chatgpt-business-hub','data-guide-location':'Homepage guide band'});
 const doc={querySelectorAll:s=>s==='[data-guide-download]'?anchors:[cta],createTextNode:s=>({textContent:s}),body:new Element(),createElement:()=>{let e=new Element();e.onClick=()=>downloads++;return e;}};
 const context={document:doc,location:{pathname:'/chatgpt-business-guide/'},Uint8Array,Blob,AbortController,console};
 const w={fetch:options.fetch||(async()=>({ok:true,arrayBuffer:async()=>pdf.buffer.slice(pdf.byteOffset,pdf.byteOffset+pdf.byteLength)})),crypto:webcrypto,AbortController,lucentstarConsent:{accepted:()=>consent},gtag:(...args)=>events.push(args),URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}},setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length;},clearTimeout:()=>{}};
 context.window=w;vm.runInNewContext(source,context);
 function click(i=0){let event={button:0,preventDefault(){this.defaultPrevented=true;}};let promise=anchors[i].listeners.click(event);return {event,promise};}
 return {anchors,events,panel,timers,cta,click,context,setConsent:v=>consent=v,downloads:()=>downloads};
}
function names(t){return t.events.map(e=>e[1]);}
(async()=>{
 let t=setup();await t.click().promise;
 assert.deepEqual(names(t),['guide_download_click','guide_download_complete']);
 assert.equal(t.events[1][2].bytes_received,pdf.length);assert.equal(t.downloads(),1);
 assert.equal(t.anchors[0].getAttribute('aria-busy'),'false');
 assert.equal(t.events[1][2].cta_location,'Opening section');
 console.log('PASS: completion only after full file size and SHA-256 match');
 t=setup({consent:false});await t.click(1).promise;
 assert.equal(t.downloads(),1);assert.equal(t.events.length,0);
 console.log('PASS: rejected analytics still permits downloading without events');
 t=setup({fetch:async()=>{throw Error('network')}});await t.click().promise;
 assert.deepEqual(names(t),['guide_download_click','guide_download_error']);assert.equal(t.downloads(),0);
 assert.equal(t.anchors[0].getAttribute('aria-disabled'),'false');
 assert.ok(t.panel.children[0].children.some(x=>x.textContent==='Open the PDF directly'));
 console.log('PASS: network failure offers retry/direct link and never records completion');
 for(const body of [pdf.subarray(0,5),Buffer.alloc(pdf.length)]){
  t=setup({fetch:async()=>({ok:true,arrayBuffer:async()=>body.buffer.slice(body.byteOffset,body.byteOffset+body.byteLength)})});await t.click().promise;
  assert.equal(t.downloads(),0);assert.equal(t.events.at(-1)[2].error_type,'integrity');assert.ok(!names(t).includes('guide_download_complete'));
 }
 console.log('PASS: both truncated and same-size corrupt files are rejected');
 t=setup({fetch:async()=>({ok:false})});await t.click().promise;assert.equal(t.downloads(),0);assert.ok(!names(t).includes('guide_download_complete'));
 console.log('PASS: HTTP errors never count as downloads');
 let finish;const pending=new Promise(resolve=>finish=resolve);
 t=setup({fetch:()=>pending});let first=t.click();let second=t.click(1);assert.ok(second.event.defaultPrevented);assert.equal(t.events.length,1);
 finish({ok:true,arrayBuffer:async()=>pdf.buffer.slice(pdf.byteOffset,pdf.byteOffset+pdf.byteLength)});await first.promise;assert.equal(t.downloads(),1);
 console.log('PASS: concurrent top/bottom clicks deliver and count once');
 t=setup();let original=t.context.window.fetch;t.context.window.fetch=async(...a)=>{t.setConsent(false);return original(...a)};await t.click().promise;
 assert.deepEqual(names(t),['guide_download_click']);assert.equal(t.downloads(),1);
 console.log('PASS: consent withdrawal suppresses completion event');
 t=setup();t.context.window.fetch=null;let native=t.click();await native.promise;assert.ok(!native.event.defaultPrevented);assert.deepEqual(names(t),['guide_download_click']);
 console.log('PASS: unsupported browser retains native link without a false completion');
 t=setup();t.context.window.gtag=()=>{throw Error('blocked')};await t.click().promise;assert.equal(t.downloads(),1);
 console.log('PASS: blocked analytics cannot stop guide delivery');
 t=setup();t.cta.listeners.click();assert.deepEqual(names(t),['guide_cta_click']);
 console.log('PASS: homepage CTA is separate from actual download events');
})().catch(e=>{console.error(e);process.exitCode=1});
