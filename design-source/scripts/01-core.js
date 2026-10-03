/* Core: small helpers, cached page geometry and a single scroll loop.
   Components register:
     LS.on('measure', fn)  read sizes and positions (after load, resize, font or content changes)
     LS.on('frame', fn)    update on scroll, using only scroll position and cached numbers
     LS.on('mode', fn)     react when the device's reduced-motion setting changes
   Nothing in a frame callback reads layout, so scrolling stays smooth. */
(function(){
  'use strict';
  var html=document.documentElement;
  var LS=window.LS={};
  LS.$=function(s,r){return (r||document).querySelector(s)};
  LS.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  LS.clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
  LS.lerp=function(a,b,t){return a+(b-a)*t};
  LS.ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  LS.pageTop=function(el){return el.getBoundingClientRect().top+window.scrollY};

  var rmq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  LS.motion=html.classList.contains('motion');
  LS.desk=window.matchMedia?window.matchMedia('(min-width: 1000px)'):{matches:true};
  LS.vh=window.innerHeight;LS.hdr=0;

  var hooks={measure:[],frame:[],mode:[]};
  LS.on=function(type,fn){hooks[type].push(fn);return fn};

  var hdrEl=document.getElementById('hdr');
  function measure(){
    LS.vh=window.innerHeight;
    /* The header's height is fixed in CSS (--hdr). It is read here for
       calculations only; writing it back would make the header grow. */
    LS.hdr=hdrEl?Math.round(hdrEl.getBoundingClientRect().height):0;
    for(var i=0;i<hooks.measure.length;i++)hooks.measure[i]();
    req();
  }
  var mRaf=0;
  LS.remeasure=function(){if(!mRaf)mRaf=requestAnimationFrame(function(){mRaf=0;measure()})};

  var raf=0;
  function frame(){raf=0;var y=window.scrollY;for(var i=0;i<hooks.frame.length;i++)hooks.frame[i](y)}
  function req(){if(!raf)raf=requestAnimationFrame(frame)}
  LS.req=req;

  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',LS.remeasure);
  window.addEventListener('load',LS.remeasure);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(LS.remeasure);
  if('ResizeObserver' in window){new ResizeObserver(LS.remeasure).observe(document.body)}
  if(LS.desk.addEventListener)LS.desk.addEventListener('change',LS.remeasure);

  /* Motion follows the device setting in both directions. There is no site switch. */
  function setMode(on){
    if(on===LS.motion)return;
    LS.motion=on;
    html.classList.toggle('motion',on);html.classList.toggle('still',!on);
    for(var i=0;i<hooks.mode.length;i++)hooks.mode[i](on);
    LS.remeasure();
  }
  LS.setMode=setMode;
  if(rmq){
    var onRm=function(e){setMode(!e.matches)};
    if(rmq.addEventListener)rmq.addEventListener('change',onRm);else if(rmq.addListener)rmq.addListener(onRm);
  }

  LS.start=function(){measure();frame()};
})();
