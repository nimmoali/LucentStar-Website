/* LucentStar shared behaviour, version 2026-11-04.72db8d2f1a: header, menus, questions, tabs. */
/* Core: small helpers, cached page geometry and a single scroll loop.
   Components register:
     LS.on('measure', fn)  read sizes and positions (after load, resize, font or content changes)
     LS.on('frame', fn)    update on scroll, using only scroll position and cached numbers
     LS.on('mode', fn)     react when the device's reduced-motion setting changes
   Nothing in a frame callback reads layout, so scrolling stays smooth. */
(function(){
  'use strict';
  var html=document.documentElement;
  // Existing homepage bookmarks lead to the full pages after the section move.
  if(location.pathname==='/' || /\/index\.html$/.test(location.pathname)){
    var moved={'#about':'/about','#signal':'/lucentsignal','#albedo':'/lucentalba'};
    if(moved[location.hash]){location.replace(moved[location.hash]);return;}
  }
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
/* Site shell: header, menus, section highlighting, in-page links,
   expandable questions and the copy-email button. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$,$$=LS.$$;
  var hdr=$('#hdr');

  /* In-page links: allow for the sticky header, move focus to the target,
     and preselect the contact topic when a link carries one */
  function goTo(el,smooth){
    var y=el.getBoundingClientRect().top+window.scrollY-LS.hdr-8;
    if(el.id==='top'||el.tagName==='H1')y=0;
    window.scrollTo({top:Math.max(0,y),behavior:(smooth&&LS.motion)?'smooth':'auto'});
    var f=el.id==='top'?($('h1',el)||el):el;
    if(f&&f.focus){try{f.focus({preventScroll:true})}catch(e){f.focus()}}
  }
  LS.goTo=goTo;
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
    var url=new URL(a.href,location.href);
    var contact=url.hash==='#contact'&&(url.origin===location.origin||url.origin==='https://lucentstar.ai')&&
      (url.pathname===location.pathname||/^\/(?:index(?:\.html)?)?$/.test(url.pathname));
    if(contact&&LS.enquiry&&LS.enquiry.open){
      e.preventDefault();
      if(LS.enquiry.forms.p){LS.enquiry.forms.p.setTrigger(a.textContent,a.dataset.topic,a);if(a.dataset.topic)LS.enquiry.forms.p.setTopic(a.dataset.topic)}
      closeProd(!!(pMenu&&pMenu.contains(a)));closeMenu(!!(mMenu&&mMenu.contains(a)));
      LS.enquiry.open();
      return;
    }
    if(a.getAttribute('href').charAt(0)!=='#')return;
    var id=a.getAttribute('href').slice(1);
    var t=id?document.getElementById(id):null;
    if(!t)return;
    e.preventDefault();
    if(a.dataset.topic&&LS.enquiry&&LS.enquiry.forms.f)LS.enquiry.forms.f.setTopic(a.dataset.topic);
    closeProd(false);closeMenu(false);
    if(LS.enquiry&&LS.enquiry.isOpen&&LS.enquiry.isOpen())LS.enquiry.close(false);
    goTo(t,true);
  });

  /* Header shadow once the page has scrolled */
  if(hdr)LS.on('frame',function(y){hdr.classList.toggle('is-scrolled',y>4)});

  /* Products menu */
  var pBtn=$('#prod-btn'),pMenu=$('#prod-menu'),pWrap=$('.nav-prod');
  function openProd(){pMenu.hidden=false;requestAnimationFrame(function(){requestAnimationFrame(function(){pMenu.classList.add('is-open')})});pBtn.setAttribute('aria-expanded','true')}
  function closeProd(focus){
    if(!pMenu||pMenu.hidden)return;
    pMenu.classList.remove('is-open');pBtn.setAttribute('aria-expanded','false');
    setTimeout(function(){if(!pMenu.classList.contains('is-open'))pMenu.hidden=true},LS.motion?240:0);
    if(focus)pBtn.focus();
  }
  if(pBtn&&pMenu){
    pBtn.addEventListener('click',function(){pMenu.hidden?openProd():closeProd(false)});
    pWrap.addEventListener('focusout',function(e){if(!pWrap.contains(e.relatedTarget))closeProd(false)});
    document.addEventListener('click',function(e){if(!pMenu.hidden&&!e.target.closest('.nav-prod'))closeProd(false)});
  }

  /* Mobile menu */
  var mBtn=$('#menu-btn'),mMenu=$('#m-menu'),mLabel=$('.mb-label');
  var labels={menu:mLabel?mLabel.textContent:'Menu',close:(window.LS_TEXT&&window.LS_TEXT.close)||'Close'};
  function openMenu(){mMenu.hidden=false;requestAnimationFrame(function(){requestAnimationFrame(function(){mMenu.classList.add('is-open')})});mBtn.setAttribute('aria-expanded','true');mLabel.textContent=labels.close;LS.req()}
  function closeMenu(focus){
    if(!mMenu||mMenu.hidden)return;
    mMenu.classList.remove('is-open');mBtn.setAttribute('aria-expanded','false');mLabel.textContent=labels.menu;
    setTimeout(function(){if(!mMenu.classList.contains('is-open'))mMenu.hidden=true;LS.req()},LS.motion?300:0);
    if(focus)mBtn.focus();
  }
  LS.menuOpen=function(){return !!(mMenu&&!mMenu.hidden)};
  if(mBtn&&mMenu){
    mBtn.addEventListener('click',function(){mMenu.hidden?openMenu():closeMenu(false)});
    window.addEventListener('resize',function(){if(window.innerWidth>=1080)closeMenu(false)});
  }
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    if(pMenu&&!pMenu.hidden)closeProd(true);
    if(mMenu&&!mMenu.hidden)closeMenu(true);
  });

  /* Section highlighting in the header. A section can point at another
     navigation item with data-spy-as (product showcases count as products). */
  var spyLinks=$$('.nav-link[data-spy]'),spySecs=$$('main section[id]'),spyTops=[];
  LS.on('measure',function(){spyTops=spySecs.map(LS.pageTop)});
  var spyCur=null;
  LS.on('frame',function(y){
    var line=y+LS.hdr+LS.vh*0.3,cur='';
    for(var i=0;i<spySecs.length;i++){if(spyTops[i]<=line)cur=spySecs[i].getAttribute('data-spy-as')||spySecs[i].id}
    if(cur===spyCur)return;spyCur=cur;
    spyLinks.forEach(function(l){l.classList.toggle('is-active',l.getAttribute('data-spy')===cur)});
  });

  /* Questions */
  $$('.faq-q').forEach(function(b){
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded',open?'false':'true');
      b.closest('.faq-i').classList.toggle('is-open',!open);
    });
  });

  /* Tabs: arrow keys, Home and End move between tabs (automatic activation).
     Panels marked data-tab-hidden start hidden once scripts run. */
  $$('[data-tabs]').forEach(function(root){
    var tabs=$$('[role="tab"]',root),panels=tabs.map(function(t){return document.getElementById(t.getAttribute('aria-controls'))});
    function select(i,focus){
      tabs.forEach(function(t,j){
        var on=i===j;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;
        var p=panels[j];if(!p)return;p.removeAttribute('data-tab-hidden');p.hidden=!on;p.classList.toggle('is-shown',on);
      });
      if(focus)tabs[i].focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){select(i,false)});
      t.addEventListener('keydown',function(e){
        var n=tabs.length,k=e.key,j=k==='ArrowRight'?(i+1)%n:k==='ArrowLeft'?(i-1+n)%n:k==='Home'?0:k==='End'?n-1:-1;
        if(j<0)return;e.preventDefault();select(j,true);
      });
    });
    var start=0;tabs.forEach(function(t,i){if(t.getAttribute('aria-selected')==='true')start=i});
    select(start,false);panels.forEach(function(p){if(p)p.classList.remove('is-shown')});
  });

  /* A server-rendered message that must be read first, such as a sign-in
     error, carries data-focus-on-load and takes focus once the page loads.
     (Other messages are tied to the first field with aria-describedby.) */
  var fl=$('[data-focus-on-load]:not([hidden])');
  if(fl){try{fl.focus({preventScroll:true})}catch(e){fl.focus()}}

  /* Copy email address */
  $$('[data-copy]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var label=$('span',btn),text=btn.getAttribute('data-copy'),orig=label.textContent;
      function done(t){label.textContent=t;setTimeout(function(){label.textContent=orig},1800)}
      function fallback(){var src=$('#email-text');if(!src)return;var r=document.createRange();r.selectNodeContents(src);var s=window.getSelection();s.removeAllRanges();s.addRange(r);done('Selected')}
      try{navigator.clipboard.writeText(text).then(function(){done('Copied')},fallback)}catch(e){fallback()}
    });
  });
})();
/* Each origin owns its preference. Analytics is never loaded before consent. */
(function () {
  'use strict';
  var key='ls_analytics_consent', id=document.body.getAttribute('data-analytics-id') || 'G-LF5E1LE400';
  if(window.lucentstarConsent) return;
  var value=null, loaded=false;
  try { value=localStorage.getItem(key); } catch (_) {}
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){
    if(arguments[0]==='event' && value!=='accepted') return;
    window.dataLayer.push(arguments);
  };
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  function apply(v) {
    value=v; window['ga-disable-'+id]=v!=='accepted';
    window.gtag('consent','update',{analytics_storage:v==='accepted'?'granted':'denied'});
    if(v==='accepted'&&!loaded){
      loaded=true; window.gtag('js',new Date());
      var config={};
      if(document.body.hasAttribute('data-analytics-clean-url')){
        config.page_location=location.origin+location.pathname;
        try{config.page_referrer=document.referrer?new URL(document.referrer).origin:''}catch(_){config.page_referrer=''}
      }
      window.gtag('config',id,config);
      var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+id;s.async=true;document.head.appendChild(s);
      window.dispatchEvent(new Event('lucentstar:analytics-enabled'));
    }
    if(v!=='accepted') {
      document.cookie.split(';').forEach(function(c){var name=c.split('=')[0].trim();if(/^_ga/.test(name)){['',location.hostname,'.'+location.hostname,'.lucentstar.ai'].forEach(function(d){document.cookie=name+'=; Max-Age=0; path=/'+(d?'; domain='+d:'')})}});
    }
  }
  var dialog=document.createElement('dialog');dialog.id='analytics-settings';dialog.className='consent-dialog';
  dialog.setAttribute('aria-labelledby','consent-title');
  dialog.innerHTML='<h2 id="consent-title">Your cookie choices</h2><p>Analytics helps us understand how this site is used. You can accept or reject it, and change your choice here at any time.</p><div class="cta-row"><button class="btn btn-primary" data-choice="accepted">Accept analytics</button><button class="btn btn-secondary" data-choice="rejected">Reject analytics</button><button class="btn btn-secondary" data-close>Close</button></div>';
  document.body.appendChild(dialog);
  function save(v){try{localStorage.setItem(key,v)}catch(_){}apply(v);dialog.close();var cb=document.getElementById('analytics-cb');if(cb)cb.checked=v==='accepted';}
  dialog.querySelectorAll('[data-choice]').forEach(function(b){b.addEventListener('click',function(){save(b.getAttribute('data-choice'))})});
  dialog.querySelector('[data-close]').addEventListener('click',function(){dialog.close()});
  window.openCookieSettings=function(){dialog.showModal()};
  window.lucentstarConsent={accepted:function(){return value==='accepted'},save:save};
  document.querySelectorAll('a[href*="cookie-settings"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();window.openCookieSettings()})});
  var cb=document.getElementById('analytics-cb');
  if(cb){cb.checked=value==='accepted';window.savePrefs=function(){save(cb.checked?'accepted':'rejected');var btn=document.querySelector('.cookie-save-btn,.save-btn');if(btn)btn.textContent='Preferences saved';}}
  window.addEventListener('storage',function(e){if(e.key===key||e.key===null){apply(e.newValue);if(cb)cb.checked=e.newValue==='accepted'}});
  apply(value);
  if(value!=='accepted'&&value!=='rejected') {
    var banner=document.createElement('aside');banner.className='consent-banner';banner.setAttribute('aria-label','Cookie choices');
    banner.innerHTML='<p>We use optional analytics only with your permission.</p><button class="btn btn-secondary" type="button">Cookie choices</button>';
    banner.querySelector('button').addEventListener('click',window.openCookieSettings);document.body.appendChild(banner);
    dialog.addEventListener('close',function(){if(value)banner.remove()});
  }
})();
/* Registration attribution contains fixed public labels only, never form values. */
(function(root,factory){
  'use strict';
  var api=factory();
  if(typeof module==='object' && module.exports)module.exports=api;
  if(root && root.document)api.init(root);
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  var pages={home:'Homepage',signal:'LucentSignal page',alba:'LucentAlba page',about:'About page',help:'Help page',ghostwriter:'Ghostwriter help',blog:'Blog index',taplio:'Taplio alternatives article',safe_tools:'Safe LinkedIn tools article',article:'Blog article',login:'Sign-in page',welcome:'Welcome page',other:'Other public page'};
  var zones={header:'Header',footer:'Footer',hero:'Opening section',fit:'Product comparison',pricing:'Pricing',end:'Closing section',article:'Article',page:'Page'};
  var actions={try_signal:'Try LucentSignal',free:'Start free',creator:'Start with Creator',pro:'Start with Pro',register:'Register'};
  function validEntry(value){
    if(typeof value!=='string' || value.length>80)return 'direct';
    var parts=value.split('.');
    return parts.length===3 && Object.prototype.hasOwnProperty.call(pages,parts[0]) && Object.prototype.hasOwnProperty.call(zones,parts[1]) && Object.prototype.hasOwnProperty.call(actions,parts[2])?value:'direct';
  }
  function fields(entry){
    entry=validEntry(entry);var parts=entry.split('.');
    return {page_path:'/register',page_location:'https://signalapp.lucentstar.ai/register',site_area:'app',form_id:'signal_account_registration',form_name:'LucentSignal account registration',form_type:'registration',form_placement:'page',
      cta_id:entry==='direct'?'direct_registration':entry.replace(/\./g,'_'),
      cta_label:entry==='direct'?'Direct registration visit':actions[parts[2]],
      cta_location:entry==='direct'?'Registration page':pages[parts[0]]+' / '+zones[parts[1]]};
  }
  function pageKey(w){
    var p=w.location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
    if(w.location.hostname==='blog.lucentstar.ai')return {'/':'blog','/taplio-alternatives':'taplio','/safe-linkedin-tools':'safe_tools'}[p]||'article';
    return {'/':'home','/index':'home','/lucentsignal':'signal','/lucentalba':'alba','/about':'about','/help':'help','/help/ghostwriter':'ghostwriter','/login':'login','/welcome':'welcome'}[p]||'other';
  }
  function linkEntry(w,a){
    var zone='page',section=a.closest('section[id]');
    if(a.closest('header'))zone='header';
    else if(a.closest('footer'))zone='footer';
    else if(section)zone={top:'hero',fit:'fit',pricing:'pricing',start:'end',contact:'end'}[section.id]||'page';
    else if(w.location.hostname==='blog.lucentstar.ai')zone='article';
    var text=String(a.textContent||'').replace(/\s+/g,' ').trim().toLowerCase(),action='register';
    if(/^start with creator\b/.test(text))action='creator';
    else if(/^start with pro\b/.test(text))action='pro';
    else if(/^start free\b/.test(text))action='free';
    else if(/^try\b/.test(text))action='try_signal';
    return pageKey(w)+'.'+zone+'.'+action;
  }
  function init(w){
    var d=w.document;
    function ready(){
      if(d.documentElement.hasAttribute('data-registration-tracking-ready'))return;
      d.documentElement.setAttribute('data-registration-tracking-ready','');
      function accepted(){return !!(w.lucentstarConsent && w.lucentstarConsent.accepted())}
      function decorate(ev){
        var a=ev.target.closest && ev.target.closest('a[href]');if(!a)return;
        var url;try{url=new URL(a.href,w.location.href)}catch(_){return}
        if(url.origin!=='https://signalapp.lucentstar.ai' || url.pathname!=='/register')return;
        if(accepted())url.searchParams.set('ls_entry',linkEntry(w,a));else url.searchParams.delete('ls_entry');
        a.href=url.href;
      }
      ['click','auxclick','contextmenu'].forEach(function(name){d.addEventListener(name,decorate,true)});
      var form=d.querySelector('form[data-registration-form]'),opened=false,started=false,validationReported=false,confirmationRequested=false;
      var entry=validEntry(new URL(w.location.href).searchParams.get('ls_entry'));
      function track(event,context,extra){
        if(!accepted() || typeof w.gtag!=='function')return false;
        w.gtag('event',event,Object.assign(fields(context),extra||{}));return true;
      }
      function open(){if(form&&!opened&&track('ls_form_open',entry))opened=true}
      function confirm(){
        if(form || !d.body.hasAttribute('data-registration-result') || !accepted() || confirmationRequested)return;
        confirmationRequested=true;
        w.fetch('/api/analytics/registration-complete',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({analyticsConsent:'accepted'})})
          .then(function(r){if(r.status===204)return null;if(!r.ok)throw new Error('registration confirmation unavailable');return r.json()})
          .then(function(result){if(result&&result.created===true)track('sign_up',validEntry(result.entry),{method:'email'})})
          .catch(function(){/* Analytics must never interrupt the product. */});
      }
      if(form){
        form.addEventListener('input',function(ev){
          if(!ev.target.matches('input:not([name="website"]):not([type="hidden"]),textarea,select'))return;
          validationReported=false;open();if(!started&&track('ls_form_start',entry))started=true;
        });
        form.addEventListener('invalid',function(){open();if(!validationReported&&track('ls_form_error',entry,{error_type:'validation'}))validationReported=true},true);
        form.addEventListener('submit',function(){
          form.elements.analytics_consent.value=accepted()?'accepted':'';
          form.elements.analytics_entry.value=accepted()?entry:'direct';
        });
        if(form.hasAttribute('data-registration-error')){open();track('ls_form_error',entry,{error_type:'validation'})}
      }
      w.addEventListener('lucentstar:analytics-enabled',function(){open();confirm()});
      open();confirm();
    }
    if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  }
  return {validEntry:validEntry,fields:fields,init:init};
});
(function(){window.LS.start()})();
