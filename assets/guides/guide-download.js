/* Guide delivery: a click is distinct from a complete, integrity-checked PDF
   received by the browser. Neither event proves a local save or a read. */
(function () {
  'use strict';
  if (window.lucentstarGuideDownloads) return;
  window.lucentstarGuideDownloads = true;
  var busy = false;
  function accepted() {
    return window.lucentstarConsent && window.lucentstarConsent.accepted();
  }
  function track(name, data) {
    if (!accepted() || typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', name, Object.assign({page_path: location.pathname, site_area: 'website'}, data));
    } catch (_) { /* Analytics must never stop delivery. */ }
  }
  function metadata(a) {
    return {
      guide_id: a.getAttribute('data-guide-download') || a.getAttribute('data-guide-open'),
      guide_name: 'ChatGPT Business Hub guide',
      cta_location: a.getAttribute('data-guide-location'),
      cta_label: a.textContent.trim(),
      cta_id: 'chatgpt_guide_' + (a.hasAttribute('data-guide-open') ? 'homepage_open' : a.getAttribute('data-guide-location') === 'Opening section' ? 'opening_download' : 'closing_download'),
      file_name: 'chatgpt-business-hub-guide.pdf',
      file_extension: 'pdf'
    };
  }
  function status(a, text, error) {
    var panel = a.parentNode.parentNode;
    var el = panel.querySelector('[data-guide-status]');
    if (!el) {
      el = document.createElement('p');
      el.className = panel.classList && panel.classList.contains('band') ? 'lead' : 'prod-note';
      el.setAttribute('data-guide-status', '');
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      panel.appendChild(el);
    }
    el.textContent = text;
    if (error) {
      var direct = document.createElement('a');
      direct.href = a.href;
      direct.className = 'tlink';
      direct.setAttribute('download', a.getAttribute('download'));
      direct.textContent = 'Open the PDF directly';
      el.appendChild(document.createTextNode(' '));
      el.appendChild(direct);
    }
  }
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-guide-download]'));
  function setBusy(on) {
    busy = on;
    buttons.forEach(function(a) {
      if (!a.hasAttribute('data-guide-label')) a.setAttribute('data-guide-label', a.textContent);
      a.setAttribute('aria-disabled', on ? 'true' : 'false');
      a.setAttribute('aria-busy', on ? 'true' : 'false');
      a.textContent = on ? 'Preparing your PDF…' : a.getAttribute('data-guide-label');
    });
  }
  document.querySelectorAll('[data-guide-open]').forEach(function(a) {
    a.addEventListener('click', function() {
      track('guide_cta_click', metadata(a));
    });
  });
  buttons.forEach(function(a) {
    a.addEventListener('click', async function(e) {
      if (e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (busy) { e.preventDefault(); return; }
      var fields = metadata(a);
      track('guide_download_click', fields);
      // Older browsers retain the working native link, without a completion claim.
      if (!window.fetch || !window.crypto || !window.crypto.subtle || !window.AbortController || !window.URL.createObjectURL) return;
      e.preventDefault();
      setBusy(true);
      status(a, 'Preparing your PDF…');
      var controller = new AbortController();
      var timer = window.setTimeout(function() { controller.abort(); }, 30000);
      var failure = 'network';
      try {
        var response = await window.fetch(a.href, {signal: controller.signal, credentials: 'same-origin'});
        if (!response.ok) throw new Error('Response unavailable');
        var payload = await response.arrayBuffer();
        failure = 'integrity';
        var expectedSize = Number(a.getAttribute('data-guide-bytes'));
        var expectedHash = a.getAttribute('data-guide-sha256');
        if (!expectedSize || payload.byteLength !== expectedSize) throw new Error('Incomplete PDF');
        var digest = await window.crypto.subtle.digest('SHA-256', payload);
        var hash = Array.from(new Uint8Array(digest)).map(function(n) { return n.toString(16).padStart(2, '0'); }).join('');
        if (hash !== expectedHash) throw new Error('PDF differs from published version');
        failure = 'delivery';
        var blobUrl = window.URL.createObjectURL(new Blob([payload], {type: 'application/pdf'}));
        var save = document.createElement('a');
        save.href = blobUrl;
        save.download = a.getAttribute('download');
        save.hidden = true;
        document.body.appendChild(save);
        save.click();
        save.remove();
        window.setTimeout(function() { window.URL.revokeObjectURL(blobUrl); }, 60000);
        track('guide_download_complete', Object.assign({}, fields, {
          bytes_received: payload.byteLength,
          completion_method: 'full_pdf_verified'
        }));
        status(a, 'Your PDF is ready. Check your browser downloads.');
      } catch (error) {
        track('guide_download_error', Object.assign({}, fields, {error_type: error.name === 'AbortError' ? 'timeout' : failure}));
        status(a, 'We couldn’t prepare the guide. Try again, or use the direct link.', true);
      } finally {
        window.clearTimeout(timer);
        setBusy(false);
      }
    });
  });
})();
