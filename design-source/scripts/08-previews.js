/* Review-only behaviour for design previews of other LucentStar sites.
   The sign-in design sends nothing on submit, and can show each kind of
   message the app renders above the fields, with example wording and the
   same roles and focus behaviour. Not part of the shared export. */
(function(){
  'use strict';
  var LS=window.LS,$=LS.$;
  var form=$('[data-auth-preview]');
  if(!form)return;
  var box=$('#auth-msg'),h=$('#auth-msg-h'),t=$('#auth-msg-t'),use=box&&$('use',box),
      sel=$('[data-auth-states]'),live=$('#auth-live'),first=$('#email');
  function show(opt){
    if(!box)return;
    if(!opt||!opt.value){box.hidden=true;first.removeAttribute('aria-describedby');return}
    var v=opt.getAttribute('data-variant');
    box.className='auth-msg auth-msg-'+v;
    h.textContent=opt.getAttribute('data-heading');
    t.textContent=opt.getAttribute('data-text');
    if(use)use.setAttribute('href','#i-'+opt.getAttribute('data-icon'));
    if(v==='error'){
      /* As in the app after a failed sign-in: the error is announced and takes focus */
      box.setAttribute('role','alert');box.setAttribute('tabindex','-1');
      first.removeAttribute('aria-describedby');box.hidden=false;box.focus();
    }else{
      /* Success and neutral messages are read with the first field */
      box.setAttribute('role','status');box.removeAttribute('tabindex');
      first.setAttribute('aria-describedby','auth-msg');box.hidden=false;
    }
  }
  if(sel)sel.addEventListener('change',function(){show(sel.options[sel.selectedIndex])});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(live)live.textContent='Design preview. In the app, this signs you in.';
  });
})();
