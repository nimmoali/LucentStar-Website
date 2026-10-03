/* Section behaviours. Each one starts only if its section is on the page,
   and uses the motion library rather than its own scroll handling. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$,$$=LS.$$,clamp=LS.clamp,M=LS.motionLib;

  /* Opening: devices rise in on load, then push in gently on scroll */
  var heroStage=$('#hero-stage');
  if(heroStage){
    if(LS.motion){requestAnimationFrame(function(){requestAnimationFrame(function(){heroStage.classList.add('is-in')})})}
    else heroStage.classList.add('is-in');
    LS.on('mode',function(on){if(!on)heroStage.classList.add('is-in')});
    var push=$('[data-push]',heroStage);
    if(push)M.push(push,0.9);
  }

  /* How we can help: the panel follows the service being read, and each
     illustration builds in three beats as the visitor reads on */
  $$('[data-seq="services"]').forEach(function(root){
    var panels=$$('[data-panel]',root),segs=$$('[data-rail]',root),chaps=$$('[data-step]',root);
    var shownA=-1,shownB=-1;
    function beatsOf(i){return panels[i]?$('.v',panels[i]):null}
    M.seq(root,{
      span:0.72,
      render:function(s){
        var a=Math.max(0,s.a),q=s.q;
        if(s.a<=0&&s.first>s.mid)q=clamp((LS.vh-s.first)/(LS.vh-s.mid),0,1)*0.2;
        var b=q<0.12?1:(q<0.4?2:3);
        if(a!==shownA){
          panels.forEach(function(v,i){
            v.classList.toggle('is-active',i===a);v.classList.toggle('is-past',i<a);
            if(i>a)M.setBeats(beatsOf(i),0);if(i<a)M.setBeats(beatsOf(i),3);
          });
          chaps.forEach(function(c,i){c.classList.toggle('is-active',i===a)});
          segs.forEach(function(g,i){g.classList.toggle('is-active',i===a)});
          shownA=a;shownB=-1;
        }
        if(b!==shownB){M.setBeats(beatsOf(a),b);shownB=b}
        segs.forEach(function(g,i){g.style.setProperty('--f',i<a?1:(i===a?Math.max(0.08,q).toFixed(3):0))});
      },
      still:function(){
        panels.forEach(function(v,i){v.classList.toggle('is-active',i===0);v.classList.remove('is-past');M.setBeats(beatsOf(i),3)});
        $$('.chap-vis .v',root).forEach(function(v){M.setBeats(v,3)});
      },
      reset:function(){shownA=-1;shownB=-1}
    });
    LS.on('measure',function(){shownA=-1});
  });

  /* How we work together: the line draws as the visitor reads, and the
     current step is highlighted with an example underneath */
  $$('[data-seq="workflow"]').forEach(function(root){
    var nodes=$$('[data-node]',root),cards=$$('[data-card]',root),fill=$('[data-fill]',root);
    M.seq(root,{
      activation:function(h){return Math.min(h*0.35,160)},
      lead:120,
      render:function(s){
        if(fill)fill.style.setProperty('--wf',s.p.toFixed(3));
        nodes.forEach(function(n,i){n.classList.toggle('is-reached',i<=s.a);n.classList.toggle('is-active',i===s.a)});
        cards.forEach(function(c,i){c.classList.toggle('is-on',i===Math.max(0,s.a))});
      },
      still:function(){nodes.forEach(function(n){n.classList.add('is-reached')})}
    });
  });

  /* Product page stories: the sticky picture takes the state of the step
     being read (s1, s2 ... are cumulative), and the rail fills as the
     visitor reads on. The steps' text is never touched. */
  $$('[data-seq="story"]').forEach(function(root){
    var live=$('.story-live [data-sv]',root),segs=$$('[data-rail]',root),steps=$$('[data-step]',root),n=steps.length,shown=-1;
    if(!live||!n)return;
    function state(k){for(var i=1;i<=n;i++)live.classList.toggle('s'+i,i<=k)}
    M.seq(root,{
      span:0.8,
      render:function(s){
        var a=Math.max(0,s.a);
        if(a!==shown){
          state(a+1);
          steps.forEach(function(x,i){x.classList.toggle('is-active',i===a)});
          segs.forEach(function(g,i){g.classList.toggle('is-active',i===a)});
          shown=a;
        }
        segs.forEach(function(g,i){g.style.setProperty('--f',i<a?1:(i===a?Math.max(0.06,s.q).toFixed(3):0))});
      },
      still:function(){state(n);shown=-1},
      reset:function(){shown=-1}
    });
    LS.on('measure',function(){shown=-1});
  });

  /* LucentSignal: four stages; the screen zooms in on the opening line while
     the suggestion is shown, following the scroll position */
  $$('[data-stage="signal"]').forEach(function(track){
    var canvas=$('[data-zoom]',track);
    M.stage(track,{
      enterAt:0,
      onProgress:function(s){
        if(!canvas)return;
        var z=1;
        if(s.stage===3)z=1+0.13*LS.ease(clamp(s.sp/0.35,0,1));
        else if(s.stage===4)z=1+0.13*(1-LS.ease(clamp(s.sp/0.3,0,1)));
        canvas.style.setProperty('--zoom',z.toFixed(4));
      },
      onStill:function(){if(canvas)canvas.style.removeProperty('--zoom')}
    });
  });

  /* LucentAlbedo: each layer of the report arrives in turn, and the report
     scrolls inside the phone to keep the newest layer in view */
  $$('[data-stage="albedo"]').forEach(function(track){
    var view=$('[data-view]',track),stack=$('[data-shift]',track),layers=stack?$$('.al-layer',stack):[];
    var shifts=[0,0,0,0,0];
    LS.on('measure',function(){
      if(!view||!view.clientHeight)return;
      var vh=view.clientHeight;
      layers.forEach(function(l,i){shifts[i+1]=Math.max(0,l.offsetTop+l.offsetHeight-vh+14)});
    });
    M.stage(track,{
      enterAt:0.55,
      onProgress:function(s){
        if(!stack)return;
        var st=s.stage,v=0;
        if(st>=1){
          var from=shifts[Math.max(1,st-1)],to=shifts[st];
          v=st===1?to:LS.lerp(from,to,LS.ease(clamp(s.sp/0.4,0,1)));
        }
        stack.style.setProperty('--shift',v.toFixed(1)+'px');
      },
      onStill:function(){if(stack)stack.style.setProperty('--shift',shifts[4]+'px')}
    });
  });
})();
