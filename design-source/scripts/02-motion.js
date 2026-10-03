/* Motion library. Six patterns, each switched on by a data attribute in the
   templates, so any page can use them without new code:

   data-reveal        fade and rise once when a block comes into view
   data-beats         a small illustration that builds in three beats when revealed
   data-reveal-step   a step marker that lights up as it reaches the middle of the screen
   data-push          scroll-linked push-in (the opening devices)
   data-seq="name"    sticky aside: text steps ([data-step]) scroll normally while one
                      visual stays in view and follows the step being read
   data-stage="name"  short pinned sequence: stages change at data-cuts, captions
                      ([data-stage-cap]) fill continuously, the device pushes in on entry

   Timing tokens live in styles/01-tokens.css (--t-fast, --t-med, --t-slow, --ease).
   With reduced motion every pattern shows its finished, still state. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$,$$=LS.$$,clamp=LS.clamp;
  var M=LS.motionLib={};

  /* Beats: .b1, .b2 and .b3 parts of an illustration appear in order */
  function setBeats(v,b){if(!v)return;v.classList.toggle('is-b1',b>=1);v.classList.toggle('is-b2',b>=2);v.classList.toggle('is-b3',b>=3)}
  M.setBeats=setBeats;

  /* Reveal */
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(ents){
    ents.forEach(function(en){if(en.isIntersecting){reveal(en.target);io.unobserve(en.target)}});
  },{rootMargin:'0px 0px -10% 0px',threshold:0.12}):null;
  var stepIo=('IntersectionObserver' in window)?new IntersectionObserver(function(ents){
    ents.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-in');stepIo.unobserve(en.target)}});
  },{rootMargin:'0px 0px -35% 0px',threshold:0}):null;
  function reveal(el){
    el.classList.add('is-in');
    if(el.hasAttribute('data-beats')){
      var v=$('.v',el);
      if(!LS.motion){setBeats(v,3);return}
      setBeats(v,1);setTimeout(function(){setBeats(v,2)},380);setTimeout(function(){setBeats(v,3)},760);
    }
  }
  M.reveal=reveal;
  M.initReveals=function(root){
    $$('[data-reveal]',root).forEach(function(el){if(LS.motion&&io)io.observe(el);else reveal(el)});
    $$('[data-reveal-step]',root).forEach(function(el){if(LS.motion&&stepIo)stepIo.observe(el);else el.classList.add('is-in')});
  };
  LS.on('mode',function(on){
    if(on)return;
    $$('[data-reveal]').forEach(reveal);
    $$('[data-reveal-step]').forEach(function(el){el.classList.add('is-in')});
  });

  /* Push-in: --hp goes from 0 to 1 over the first part of the page */
  M.push=function(el,distance){
    distance=distance||0.9;
    LS.on('frame',function(y){if(LS.motion)el.style.setProperty('--hp',clamp(y/(LS.vh*distance),0,1).toFixed(3))});
    LS.on('mode',function(on){if(!on)el.style.removeProperty('--hp')});
  };

  /* Sticky aside. render(state) gets:
     a     index of the step being read (-1 before the first)
     q     progress through that step, 0 to 1
     p     progress through all steps, 0 to 1
     first distance from the first step's top to the middle of the screen */
  M.seq=function(root,opts){
    var steps=$$('[data-step]',root),tops=[],hs=[];
    var act=opts.activation||function(){return 0};
    var span=opts.span||0.72;
    LS.on('measure',function(){tops=steps.map(LS.pageTop);hs=steps.map(function(s){return s.offsetHeight})});
    LS.on('frame',function(y){
      if(!LS.motion||!LS.desk.matches||!tops.length)return;
      var mid=LS.vh*0.5,a=-1;
      for(var i=0;i<steps.length;i++){if(tops[i]-y+act(hs[i])<=mid)a=i}
      var i0=Math.max(0,a);
      var q=clamp((mid-(tops[i0]-y))/Math.max(1,hs[i0]*span),0,1);
      var f=tops[0]-y,l=tops[steps.length-1]-y;
      var p=clamp((mid-f-(opts.lead||0))/Math.max(1,l-f),0,1);
      opts.render({a:a,q:q,p:p,first:f,mid:mid});
    });
    LS.on('mode',function(on){if(!on&&opts.still)opts.still();else if(on&&opts.reset)opts.reset()});
    if(!LS.motion&&opts.still)opts.still();
  };

  /* Pinned stage sequence.
     data-stages  number of stages
     data-cuts    where each next stage starts, as fractions of the pinned distance
     The pinned distance is set in CSS with --pin (in screen heights). */
  M.stage=function(track,opts){
    opts=opts||{};
    var n=+track.getAttribute('data-stages')||4;
    var cuts=(track.getAttribute('data-cuts')||'').split(',').map(Number).filter(function(x){return !isNaN(x)});
    var push=$('[data-stage-push]',track);
    var caps=$$('[data-stage-cap]',track);
    var top=0,h=0,cur=-1,enterAt=opts.enterAt||0;
    LS.on('measure',function(){top=LS.pageTop(track);h=track.offsetHeight});
    function bounds(i){return [i<=1?0:cuts[i-2],i>=n?1:cuts[i-1]]}
    function setStage(st){
      cur=st;
      for(var k=1;k<=n;k++)track.classList.toggle('s'+k,k<=st);
      caps.forEach(function(c){
        var on=+c.getAttribute('data-stage-cap')===st;
        c.classList.toggle('is-active',on);
        if(c.tagName==='BUTTON'){if(on)c.setAttribute('aria-current','step');else c.removeAttribute('aria-current')}
      });
      if(opts.onStage)opts.onStage(st);
    }
    LS.on('frame',function(y){
      if(!LS.motion||!LS.desk.matches||!h)return;
      var vh=LS.vh,pin=LS.hdr,r=top-y;
      var e=clamp((vh-r)/Math.max(1,vh-pin),0,1);
      if(push)push.style.setProperty('--e',e.toFixed(3));
      var total=h-(vh-pin),p=clamp((pin-r)/Math.max(1,total),0,1);
      var before=r>pin+1,st,sp;
      if(before){st=e>enterAt?1:0;sp=st?e*0.5:0}
      else{
        st=1;for(var i=0;i<cuts.length;i++){if(p>=cuts[i])st=i+2}
        var b=bounds(st);sp=clamp((p-b[0])/Math.max(1e-4,b[1]-b[0]),0,1);
        if(st===1)sp=0.5+sp*0.5;
      }
      if(st!==cur)setStage(st);
      caps.forEach(function(c){var i=+c.getAttribute('data-stage-cap');c.style.setProperty('--sp',i<st?1:(i===st?sp.toFixed(3):0))});
      if(opts.onProgress)opts.onProgress({p:p,stage:st,sp:before?0:sp,e:e,before:before});
    });
    /* A caption button takes the visitor to that stage */
    caps.forEach(function(c){
      if(c.tagName!=='BUTTON')return;
      c.addEventListener('click',function(){
        if(!(LS.motion&&LS.desk.matches))return;
        var i=+c.getAttribute('data-stage-cap'),b=bounds(i),total=h-(LS.vh-LS.hdr);
        window.scrollTo({top:top-LS.hdr+total*(b[0]+(b[1]-b[0])*0.35),behavior:'smooth'});
      });
    });
    function still(){
      for(var k=1;k<=n;k++)track.classList.add('s'+k);
      caps.forEach(function(c){c.classList.remove('is-active');c.removeAttribute('aria-current');c.style.removeProperty('--sp')});
      if(push)push.style.removeProperty('--e');
      if(opts.onStill)opts.onStill();
    }
    LS.on('mode',function(on){if(!on)still();else cur=-1});
    if(!LS.motion)still();
    return {bounds:bounds};
  };
})();
