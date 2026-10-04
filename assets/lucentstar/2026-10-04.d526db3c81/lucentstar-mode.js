/* LucentStar reduced-motion mode, version 2026-10-04.d526db3c81. Put it in the <head>. */
/* Runs in the page head, before anything is drawn.
   Motion follows the device's reduced-motion setting only. The old
   "Reduce motion" switch stored a preference in this browser; it is cleared
   here so an earlier choice can never leave the site without animation. */
(function(){
  var d=document.documentElement,rm=false;
  try{localStorage.removeItem('ls-motion')}catch(e){}
  try{rm=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){}
  d.classList.add(rm?'still':'motion');
})();