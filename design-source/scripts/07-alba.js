/* LucentAlba page: the launch countdown, the joined counter and the
   waitlist mode of the shared Contact us panel. Runs only on a page with a
   waitlist panel ([data-waitlist], templates/sections/statement.html).
   The joined figure is simulated from the page file (base, base_date and a
   different daily amount between daily_min and daily_max); it does not read
   the sign-up database. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$,$$=LS.$$;
  var box=$('[data-waitlist]');
  if(!box)return;
  var P={};try{P=JSON.parse(box.getAttribute('data-waitlist'))||{}}catch(e){}
  function pad(n){return (n<10?'0':'')+n}

  /* Countdown: days, hours, minutes and seconds to launch_at. Changed
     digits slide up into place (not with reduced motion). At zero the
     countdown is hidden. */
  var cd=$('[data-countdown]',box);
  if(cd){
    var end=Date.parse(cd.getAttribute('data-countdown')),cells=$$('[data-u]',cd),first=true;
    (function tick(){
      var s=Math.max(0,Math.floor((end-Date.now())/1000));
      var v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
      cells.forEach(function(c){
        var t=pad(v[c.getAttribute('data-u')]);
        if(c.textContent===t)return;
        c.textContent=t;
        if(!first&&LS.motion&&c.animate)c.animate([{transform:'translateY(45%)',opacity:0},{transform:'none',opacity:1}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
      });
      first=false;
      if(s===0){box.classList.add('is-launched');return}
      setTimeout(tick,1000-Date.now()%1000+10);
    })();
  }

  /* Replay: on this page the journey, example and process animations play
     again each time they come back into view. Once a block has left the
     screen completely it is reset, so the reset is never seen. With reduced
     motion nothing is reset and everything stays complete. */
  var replay=$$('.jr-st,.exf-flow,.ffx-st');
  if(replay.length&&'IntersectionObserver' in window){
    var inIo=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting)en.target.classList.add('is-in')})},{rootMargin:'0px 0px -10% 0px',threshold:0.12});
    var outIo=new IntersectionObserver(function(ents){ents.forEach(function(en){if(!en.isIntersecting&&LS.motion)en.target.classList.remove('is-in')})},{threshold:0});
    replay.forEach(function(el){inIo.observe(el);outIo.observe(el)});
    LS.on('mode',function(on){if(!on)replay.forEach(function(el){el.classList.add('is-in')})});
  }

  /* Joined counter: simulated daily growth by unequal amounts. Counts up
     once when it comes into view (not with reduced motion). */
  var num=$('[data-joined]',box);
  if(num){
    var J={};try{J=JSON.parse(num.getAttribute('data-joined'))||{}}catch(e){}
    var b=String(J.base_date||'').split('-'),start=Date.UTC(+b[0],+b[1]-1,+b[2]);
    var days=Math.max(0,Math.floor((Date.now()-start)/86400000)),lo=J.daily_min|0,hi=Math.max(lo,J.daily_max|0);
    var n=J.base|0;
    for(var d=1;d<=days;d++)n+=lo+((Math.imul(d+7,2654435761)>>>0)>>>8)%(hi-lo+1);
    var fmt=function(x){return x.toLocaleString('en-GB')};
    num.textContent=fmt(n);
    if(LS.motion&&'IntersectionObserver' in window){
      var from=Math.max(0,n-60);num.textContent=fmt(from);
      var io=new IntersectionObserver(function(ents){
        if(!ents[0].isIntersecting){if(LS.motion)num.textContent=fmt(from);return}
        var t0=performance.now(),dur=1400;
        (function step(now){
          var p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);
          num.textContent=fmt(Math.round(from+(n-from)*e));
          if(p<1&&LS.motion)requestAnimationFrame(step);else num.textContent=fmt(n);
        })(t0);
      },{threshold:0.6});
      io.observe(num);
      LS.on('mode',function(on){if(!on){io.disconnect();num.textContent=fmt(n)}});
    }
  }

  /* Waitlist mode: the button opens the shared Contact us panel with a
     waitlist heading and lead, without the message box and topics. The
     message is filled in for the visitor and the topic is AI visibility.
     Any other way of opening the panel, or closing it, restores it. */
  var E=LS.enquiry,dlg=$('#enquiry'),T=window.LS_TEXT||{};
  if(!E||!dlg)return;
  var h=$('#enq-h'),lead=$('#enq-lead'),form=$('form[data-enquiry="p"]'),msg=$('#p-message'),label=$('#p-send-label');
  if(!h||!form||!msg)return;
  var also=box.getAttribute('data-waitlist-also')||'';
  var msgWrap=msg.closest('div'),topics=$('.f-topics',form),saved=null;
  function enter(){
    if(saved)return;
    saved={h:h.textContent,lead:lead?lead.textContent:'',msg:msg.value,send:T.send,dt:T.done_title,dd:T.done_text};
    h.textContent=P.heading;if(lead)lead.textContent=P.lead;
    msg.value=P.message;msgWrap.hidden=true;if(topics)topics.hidden=true;
    T.send=P.send;T.done_title=P.done_title;T.done_text=P.done_text;
    if(label&&label.textContent===saved.send)label.textContent=P.send;
    dlg.classList.add('is-waitlist');
  }
  function leave(){
    if(!saved)return;
    h.textContent=saved.h;if(lead)lead.textContent=saved.lead;
    msg.value=msg.value===P.message?saved.msg:msg.value;msgWrap.hidden=false;if(topics)topics.hidden=false;
    if(label&&label.textContent===P.send)label.textContent=saved.send;
    T.send=saved.send;T.done_title=saved.dt;T.done_text=saved.dd;
    dlg.classList.remove('is-waitlist');saved=null;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest?e.target.closest('a,button'):null;
    if(!a)return;
    if(a.closest('[data-waitlist-open]')||(also&&a.matches(also)))enter();
    else if(a.id==='fab'||/#contact$/.test(a.getAttribute('href')||''))leave();
  },true);
  dlg.addEventListener('close',function(){if(!dlg.open)leave()});
  /* "Send another" clears the form: keep the waitlist message in place */
  var again=$('#p-again');
  if(again)again.addEventListener('click',function(){if(saved)msg.value=P.message});
})();
