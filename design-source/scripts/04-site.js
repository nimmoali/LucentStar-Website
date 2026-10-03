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
    var a=e.target.closest('a[href^="#"]');
    if(!a)return;
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
