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