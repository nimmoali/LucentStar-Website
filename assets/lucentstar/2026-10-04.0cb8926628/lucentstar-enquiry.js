/* LucentStar enquiry forms and Contact us panel, version 2026-10-04.0cb8926628. Load after lucentstar-shell.js. */
window.LS_TEXT={"errors": {"name": "Enter your name", "email_missing": "Enter your email address", "email_format": "Enter an email address in the correct format, like name@example.com", "message": "Tell us a little about what you’d like help with"}, "summary_one": "Please check 1 answer", "summary_many": "Please check {n} answers", "done_title": "Thank you, {name}. Your message was accepted for email delivery.", "done_text": "We’ll reply by email to {email}.", "send": "Send message", "sending": "Sending…", "sending_status": "Sending your message", "retry": "Try again", "error_preview": "Preview the error state", "error_preview_on": "Error preview on", "close": "Close", "delivery": {"to": "hello@lucentstar.ai", "endpoint": "https://signalapp.lucentstar.ai/api/enquiries", "enabled": true, "simulated": false}};
/* Both enquiry forms share validation and the real transactional endpoint.
   Delivery remains disabled until operational facts and inbox tests pass. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$,$$=LS.$$,html=document.documentElement;
  var T=window.LS_TEXT||{};
  var E=LS.enquiry={simulateFailure:false,forms:{}};

  /* The recipient is fixed server-side. A provider receipt means accepted
     for delivery, not confirmed inbox arrival. Failure preserves the input
     and retries the same payload with the same idempotency key. */
  var D=T.delivery||{}, challenge=null, challengeAt=0;
  async function status(){
    var ctl=new AbortController(), timer=setTimeout(function(){ctl.abort()},10000);
    try {
      var r=await fetch(D.endpoint+'/status',{headers:{Accept:'application/json'},signal:ctl.signal});
      if(!r.ok)throw new Error('Unavailable');
      var result=await r.json();
      if(result.ready!==true||typeof result.token!=='string'||!result.token)throw new Error('Unavailable');
      challenge=result.token;challengeAt=Date.now();return result;
    } finally {clearTimeout(timer)}
  }
  E.send=async function(data){
    if(D.enabled!==true)throw new Error('Enquiry delivery is unavailable');
    if(!challenge||Date.now()-challengeAt>25*60*1000)await status();
    var wait=1600-(Date.now()-challengeAt);
    if(wait>0)await new Promise(function(resolve){setTimeout(resolve,wait)});
    var body=Object.assign({},data,{token:challenge});
    var ctl=new AbortController(), timer=setTimeout(function(){ctl.abort()},15000);
    try {
      var r=await fetch(D.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','Idempotency-Key':data.requestId},body:JSON.stringify(body),signal:ctl.signal});
      var result=await r.json();
      if(!r.ok||result.accepted!==true||typeof result.deliveryId!=='string'||!result.deliveryId)throw new Error('Delivery not confirmed');
    } finally {clearTimeout(timer)}
  };
  if(D.enabled===true)status().then(function(){
    $$('form[data-enquiry]').forEach(function(f){var px=f.getAttribute('data-enquiry');document.getElementById(px+'-send').disabled=false;document.getElementById(px+'-send-label').textContent=T.send;document.getElementById(px+'-availability').hidden=true});
  },function(){
    $$('form[data-enquiry]').forEach(function(f){var px=f.getAttribute('data-enquiry');document.getElementById(px+'-send-label').textContent='Sending unavailable';document.getElementById(px+'-availability').hidden=false});
  });

  function fill(t,vals){return String(t).replace(/\{(\w+)\}/g,function(_,k){return vals[k]!=null?vals[k]:''})}

  function Form(form){
    var px=form.getAttribute('data-enquiry');
    function q(s){return document.getElementById(px+'-'+s)}
    var done=q('done'),send=q('send'),label=q('send-label'),fail=q('fail'),sum=q('summary'),sumList=q('summary-list'),sumH=q('summary-h'),live=q('live'),again=q('again');
    var fields={name:q('name'),email:q('email'),message:q('message')};
    var sending=false, requestId=null, previousPayload=null;
    function validate(){
      var e={};
      if(!fields.name.value.trim())e.name=T.errors.name;
      var em=fields.email.value.trim();
      if(!em)e.email=T.errors.email_missing;
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))e.email=T.errors.email_format;
      if(!fields.message.value.trim())e.message=T.errors.message;
      return e;
    }
    function showErr(k,msg){
      var p=q(k+'-err'),inp=fields[k],hint=k==='message'?' '+px+'-message-hint':'';
      if(msg){$('span',p).textContent=msg;p.hidden=false;inp.setAttribute('aria-invalid','true');inp.setAttribute('aria-describedby',px+'-'+k+'-err'+hint)}
      else{p.hidden=true;inp.removeAttribute('aria-invalid');if(k==='message')inp.setAttribute('aria-describedby',px+'-message-hint');else inp.removeAttribute('aria-describedby')}
    }
    Object.keys(fields).forEach(function(k){
      fields[k].addEventListener('input',function(){
        if(fields[k].getAttribute('aria-invalid')==='true'){var e=validate();showErr(k,e[k]||'')}
      });
    });
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(D.enabled!==true)return;
      if(sending)return;
      fail.hidden=true;
      var e=validate(),keys=Object.keys(e);
      ['name','email','message'].forEach(function(k){showErr(k,e[k]||'')});
      if(keys.length){
        sumList.innerHTML='';
        keys.forEach(function(k){
          var li=document.createElement('li'),a=document.createElement('a');
          a.href='#'+px+'-'+k;a.textContent=e[k];
          a.addEventListener('click',function(x){x.preventDefault();x.stopPropagation();fields[k].focus()});
          li.appendChild(a);sumList.appendChild(li);
        });
        sumH.textContent=keys.length===1?T.summary_one:fill(T.summary_many,{n:keys.length});
        sum.hidden=false;sum.focus();
        return;
      }
      sum.hidden=true;sending=true;
      send.setAttribute('aria-disabled','true');send.classList.add('is-sending');label.textContent=T.sending;live.textContent=T.sending_status;
      var data={name:fields.name.value.trim(),email:fields.email.value.trim(),company:(q('company')||{}).value||'',message:fields.message.value.trim(),topic:(form.querySelector('input[name="topic"]:checked')||{}).value||'',source:px,website:(q('website')||{}).value||''};
      var payload=JSON.stringify(data);if(payload!==previousPayload){requestId=crypto.randomUUID();previousPayload=payload}data.requestId=requestId;
      E.send(data).then(function(){
        sending=false;send.removeAttribute('aria-disabled');send.classList.remove('is-sending');
        var first=data.name.split(/\s+/)[0];
        q('done-h').textContent=fill(T.done_title,{name:first});
        q('done-p').textContent=fill(T.done_text,{email:data.email});
        form.hidden=true;done.hidden=false;q('done-h').focus();live.textContent='';
        label.textContent=T.send;
      },function(){
        sending=false;send.removeAttribute('aria-disabled');send.classList.remove('is-sending');
        label.textContent=T.retry;fail.hidden=false;live.textContent='';fail.setAttribute('tabindex','-1');fail.focus();
      });
    });
    function reset(){
      form.reset();['name','email','message'].forEach(function(k){showErr(k,'')});
      requestId=null;previousPayload=null;
      done.hidden=true;form.hidden=false;fail.hidden=true;sum.hidden=true;label.textContent=T.send;
    }
    if(again)again.addEventListener('click',function(){reset();fields.name.focus()});
    this.setTopic=function(t){var r=q('t-'+t);if(r)r.checked=true};
    this.reset=reset;
    this.isDone=function(){return !done.hidden};
  }
  $$('form[data-enquiry]').forEach(function(f){E.forms[f.getAttribute('data-enquiry')]=new Form(f)});

  /* Error preview (prototype only) */
  var sims=$$('[data-errsim]');
  sims.forEach(function(b){
    b.addEventListener('click',function(){
      E.simulateFailure=!E.simulateFailure;
      sims.forEach(function(x){x.setAttribute('aria-pressed',E.simulateFailure?'true':'false');x.textContent=E.simulateFailure?T.error_preview_on:T.error_preview});
    });
  });

  /* Floating launcher and panel.
     Movement uses the Web Animations API so the panel and its backdrop share
     one timing, and the dialog closes only after the exit has finished.
     Opening or closing part-way through reverses the movement from where it
     is. With reduced motion, or without the API, it opens and closes at once. */
  var fab=$('#fab'),dlg=$('#enquiry');
  if(!fab||!dlg)return;
  if(typeof dlg.showModal!=='function'){
    /* Very old browsers: the launcher goes to the contact section instead */
    fab.addEventListener('click',function(){var c=$('#contact');if(c&&LS.goTo)LS.goTo(c,true);else location.href='index.html#contact'});
    return;
  }
  var panel=$('.enq-panel',dlg),scrim=$('.enq-scrim',dlg),heading=$('#enq-h');
  var small=window.matchMedia('(max-width: 599px)');
  var MOVE={
    open:{ms:220,msSmall:250,easing:'cubic-bezier(.22,1,.36,1)'},
    close:{ms:180,msSmall:200,easing:'cubic-bezier(.33,1,.68,1)'}
  };
  E.timing=MOVE;
  var state='closed',anims=[],gen=0,opener=null,restore=true;

  var heroEnd=0,zones=[];
  LS.on('measure',function(){
    var hero=$('.hero')||$('.page-hero');
    heroEnd=hero?LS.pageTop(hero)+hero.offsetHeight:LS.vh;
    zones=$$('#contact, footer').map(function(z){var t=LS.pageTop(z);return [t,t+z.offsetHeight]});
  });
  function wanted(y){
    if(state!=='closed'||(LS.menuOpen&&LS.menuOpen()))return false;
    if(heroEnd-y>LS.vh*0.55)return false;
    for(var i=0;i<zones.length;i++){if(zones[i][0]<y+LS.vh-40&&zones[i][1]>y+LS.hdr)return false}
    return true;
  }
  var shown=false;
  function update(y){var w=wanted(y==null?window.scrollY:y);if(w!==shown){shown=w;fab.classList.toggle('is-shown',w)}}
  LS.on('frame',update);

  function stop(){anims.forEach(function(a){try{a.cancel()}catch(e){}});anims=[]}
  function after(done){
    var my=++gen;
    Promise.all(anims.map(function(a){return a.finished})).then(function(){if(my===gen)done()},function(){});
  }
  function play(dir,done){
    stop();
    if(!LS.motion||typeof panel.animate!=='function'){gen++;done();return}
    var m=small.matches,t=MOVE[dir==='in'?'open':'close'];
    var shut=m?{transform:'translateY(100%)'}:{opacity:0,transform:'translateY(24px) scale(.96)'};
    var open=m?{transform:'translateY(0)'}:{opacity:1,transform:'translateY(0) scale(1)'};
    var o={duration:m?t.msSmall:t.ms,easing:t.easing,fill:'both'};
    anims=[
      panel.animate(dir==='in'?[shut,open]:[open,shut],o),
      scrim.animate(dir==='in'?[{opacity:0},{opacity:1}]:[{opacity:1},{opacity:0}],o)
    ];
    after(done);
  }
  function turnBack(done){anims.forEach(function(a){a.reverse()});after(done)}

  function opened(){state='open';stop()}
  function closed(){
    state='closed';
    dlg.close();stop();
    html.classList.remove('enq-lock');
    update();
    if(restore){
      var t=(opener&&opener!==document.body&&document.contains(opener))?opener:fab;
      if(t===fab&&!shown)t=$('#main');
      try{t.focus({preventScroll:true})}catch(e){t.focus()}
    }
    /* A finished message leaves the panel ready for a new one */
    if(E.forms.p&&E.forms.p.isDone())E.forms.p.reset();
  }
  function open(){
    if(state==='open'||state==='opening')return;
    if(state==='closing'&&anims.length){state='opening';turnBack(opened);return}
    restore=true;
    opener=document.activeElement;
    dlg.showModal();
    if(small.matches)html.classList.add('enq-lock');
    state='opening';
    update();
    try{heading.focus({preventScroll:true})}catch(e){heading.focus()}
    play('in',opened);
  }
  function close(focusBack){
    if(state==='closed'||state==='closing')return;
    restore=focusBack!==false;
    if(state==='opening'&&anims.length){state='closing';turnBack(closed);return}
    state='closing';
    play('out',closed);
  }
  E.open=open;E.close=close;E.isOpen=function(){return state==='open'||state==='opening'};E.state=function(){return state};
  fab.addEventListener('click',open);
  dlg.addEventListener('cancel',function(e){e.preventDefault();close()});
  /* If the browser closes the dialog itself (a second Escape, say), tidy up */
  dlg.addEventListener('close',function(){if(!dlg.open&&state!=='closed'){gen++;stop();state='closing';closed()}});
  $$('[data-enquiry-close]',dlg).forEach(function(b){b.addEventListener('click',function(){close()})});
})();
(function(){window.LS.remeasure()})();
