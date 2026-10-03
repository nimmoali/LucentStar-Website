/* Opening examples. The page starts on its chosen example. Visitors can
   switch with the buttons under the devices, and a link ending in
   #for-<id> (or ?for=<id> on a normal website) opens a specific example,
   so audience landing pages and campaigns can point at the right one.

   Photos and slow connections. The chosen example's photo loads with the
   page; the others load once the page has loaded, or as soon as their
   button is pointed at or focused. When a visitor switches, the button shows
   the choice at once, but the screens and the caption keep the current
   example until the next example's photos are loaded and decoded, then the
   two crossfade. A slow switch gets a quiet cue after CUE ms. If a photo
   fails, the switch goes ahead and that photo's tinted panel stays in its
   place. If the photos take longer than WAIT ms, the switch goes ahead too,
   and each late photo fades in when it arrives. The newest choice always
   wins. This only waits on events and promises, so scrolling and the rest of
   the page are never held up. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$,$$=LS.$$;
  var root=$('[data-examples]');
  if(!root)return;
  var WAIT=6000,CUE=250;
  var btns=$$('[data-example-btn]',root),layers=$$('.hx',root),caps=$$('[data-example-cap]',root);
  var ticket=0,cueTimer=0;
  if(!root.getAttribute('data-current'))root.setAttribute('data-current',root.getAttribute('data-default')||'');
  function has(id){return layers.some(function(l){return l.getAttribute('data-example')===id})}
  function pics(id){return $$('.hx[data-example="'+id+'"] img[data-example-img]',root)}
  function loaded(i){return !i.hasAttribute('data-src')&&i.complete&&i.naturalWidth>1}
  function warm(id){
    pics(id).forEach(function(i){
      if(!i.hasAttribute('data-src'))return;
      i.srcset=i.getAttribute('data-srcset');i.src=i.getAttribute('data-src');
      i.removeAttribute('data-srcset');i.removeAttribute('data-src');
    });
  }
  /* A photo that fails leaves its tinted panel, never a broken image */
  function fail(i){var p=i.closest('.en-pic');if(p)p.classList.add('is-failed');i.classList.remove('is-waiting')}
  $$('img[data-example-img]',root).forEach(function(i){
    i.addEventListener('error',function(){fail(i)});
    i.addEventListener('load',function(){if(i.naturalWidth>1)i.classList.remove('is-waiting')});
    if(i.complete&&!i.naturalWidth&&i.getAttribute('src'))fail(i);
  });
  /* Only photos that will be seen are waited for: where a device is hidden
     (the laptop at phone widths) its photo is an empty image */
  function seen(i){return i.offsetParent!==null}
  /* Resolves once the photo is loaded and decoded (true) or has failed (false) */
  function ready(i){
    return new Promise(function(done){
      if(i.closest('.en-pic.is-failed')){done(false);return}
      function go(){(i.decode?i.decode():Promise.resolve()).then(function(){done(true)},function(){done(i.naturalWidth>1)})}
      if(loaded(i)){go();return}
      function on(){if(i.naturalWidth>1){i.removeEventListener('load',on);go()}}
      i.addEventListener('load',on);
      i.addEventListener('error',function(){i.removeEventListener('load',on);done(false)},{once:true});
    });
  }
  function press(id){btns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-example-btn')===id?'true':'false')})}
  function settle(){clearTimeout(cueTimer);root.classList.remove('is-pending');root.removeAttribute('aria-busy')}
  function apply(id,byVisitor,list){
    settle();
    list.forEach(function(i){if(!loaded(i)&&!i.closest('.en-pic.is-failed'))i.classList.add('is-waiting')});
    if(byVisitor)root.classList.add('is-switched');
    layers.forEach(function(l){l.classList.toggle('is-on',l.getAttribute('data-example')===id)});
    caps.forEach(function(c){c.hidden=c.getAttribute('data-example-cap')!==id});
    root.setAttribute('data-current',id);
  }
  /* now: switch at once (a link that opens an example when the page loads) */
  function show(id,byVisitor,now){
    if(!has(id))return false;
    var t=++ticket;
    press(id);
    warm(id);
    if(root.getAttribute('data-current')===id){settle();return true}
    var list=pics(id).filter(seen);
    if(now||!list.length){apply(id,byVisitor,list);return true}
    clearTimeout(cueTimer);
    cueTimer=setTimeout(function(){if(t===ticket){root.classList.add('is-pending');root.setAttribute('aria-busy','true')}},CUE);
    var timer=0;
    Promise.race([
      Promise.all(list.map(ready)),
      new Promise(function(r){timer=setTimeout(r,WAIT)})
    ]).then(function(){
      clearTimeout(timer);
      if(t===ticket)apply(id,byVisitor,list);
    });
    return true;
  }
  LS.showExample=show;
  btns.forEach(function(b){
    b.addEventListener('click',function(){show(b.getAttribute('data-example-btn'),true)});
    b.addEventListener('pointerenter',function(){warm(b.getAttribute('data-example-btn'))});
    b.addEventListener('focus',function(){warm(b.getAttribute('data-example-btn'))});
  });
  window.addEventListener('load',function(){
    function all(){btns.forEach(function(b){warm(b.getAttribute('data-example-btn'))})}
    if('requestIdleCallback' in window)requestIdleCallback(all,{timeout:2500});else setTimeout(all,1500);
  });
  /* Arrow keys move along the switcher */
  btns.forEach(function(b,i){
    b.addEventListener('keydown',function(e){
      var d=e.key==='ArrowRight'?1:(e.key==='ArrowLeft'?-1:0);
      if(!d)return;
      e.preventDefault();
      var nb=btns[(i+d+btns.length)%btns.length];nb.focus();nb.click();
    });
  });
  var want=null,m=location.hash.match(/^#for-([a-z0-9-]+)$/);
  if(m)want=m[1];
  try{var q=new URLSearchParams(location.search).get('for');if(q)want=q}catch(e){}
  if(want)show(want,false,true);
  /* A link to #for-<id> on the same page switches the example too */
  window.addEventListener('hashchange',function(){
    var h=location.hash.match(/^#for-([a-z0-9-]+)$/);
    if(h)show(h[1],true);
  });
})();
