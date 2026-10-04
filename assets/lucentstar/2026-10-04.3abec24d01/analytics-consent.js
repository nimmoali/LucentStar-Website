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
      loaded=true; window.gtag('js',new Date());window.gtag('config',id);
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