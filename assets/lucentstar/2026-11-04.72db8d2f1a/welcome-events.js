/* Preserve welcome attribution without delaying the action into the app. */
(function(){
  if(!document.querySelector('.wl-cta'))return;
  var p=new URLSearchParams(location.search),segment=(p.get('segment')||'csuite').slice(0,64),sent=false;
  function track(){
    var consent=null;try{consent=localStorage.getItem('ls_analytics_consent')}catch(_){}
    if(consent!=='accepted'||sent)return;sent=true;
    var data={segment:segment};['utm_source','utm_medium','utm_campaign','utm_content'].forEach(function(k){var v=p.get(k);if(v)data[k]=v.slice(0,k==='utm_source'||k==='utm_medium'?128:256)});
    gtag('event','welcome_screen_viewed',{segment:segment,device:/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?'mobile':'desktop'});
    gtag('event','magic_link_login',data);gtag('event','welcome_page_view',data);
  }
  window.addEventListener('lucentstar:analytics-enabled',track);track();
  document.querySelector('.wl-cta').addEventListener('click',function(){try{if(localStorage.getItem('ls_analytics_consent')==='accepted')gtag('event','welcome_cta_clicked',{segment:segment})}catch(_){}});
})();