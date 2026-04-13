(function () {
  'use strict';

  var DURATION   = 2000;
  var MILESTONES = [0, 33, 66, 100];

  function run() {
    var preloader = document.getElementById('preloader');
    var percent   = document.getElementById('pl-percent');
    var stepEls   = [0,1,2,3].map(function(i){ return document.getElementById('step-' + i); });
    var fillEls   = [0,1,2].map(function(i){ return document.getElementById('fill-' + i); });

    if (!preloader) return;

    var startTime = null;
    var zoomed    = false;

    function tick(ts) {
      if (startTime === null) { startTime = ts; requestAnimationFrame(tick); return; }

      var elapsed = ts - startTime;
      var raw     = Math.min(elapsed / DURATION, 1);
      var prog    = (raw < 0.5 ? 2*raw*raw : -1+(4-2*raw)*raw) * 100;

      if (percent) percent.textContent = Math.round(prog) + '%';

      for (var i = 0; i < stepEls.length; i++) {
        if (prog >= MILESTONES[i]) stepEls[i].classList.add('active');
      }
      for (var j = 0; j < fillEls.length; j++) {
        var from = MILESTONES[j], to = MILESTONES[j+1];
        fillEls[j].style.width = (Math.max(0, Math.min(prog-from, to-from)) / (to-from) * 100) + '%';
      }

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else if (!zoomed) {
        zoomed = true;
        triggerZoom();
      }
    }

    function triggerZoom() {
      var finalWrap = document.getElementById('step-3-wrap');
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      // Fallback center if element not found
      var cx = vw / 2, cy = vh / 2, size = 90;

      if (finalWrap) {
        var r = finalWrap.getBoundingClientRect();
        cx   = r.left + r.width  / 2;
        cy   = r.top  + r.height / 2;
        size = r.width;
      }

      // Create a div that starts as the circle and expands to fill screen
      var el = document.createElement('div');
      var diagonal = Math.ceil(Math.sqrt(vw * vw + vh * vh)) * 2;

      // Position: centered on the circle
      el.style.cssText =
        'position:fixed;' +
        'z-index:100000;' +
        'border-radius:50%;' +
        'pointer-events:none;' +
        'background:url(images/Preloader/krutika-jaggery.png) center/cover no-repeat;' +
        'width:'  + size + 'px;' +
        'height:' + size + 'px;' +
        'left:'   + (cx - size/2) + 'px;' +
        'top:'    + (cy - size/2) + 'px;' +
        'transition:none;';

      document.body.appendChild(el);

      // Force paint, then animate
      el.getBoundingClientRect();

      requestAnimationFrame(function() {
        el.style.transition =
          'width 0.7s cubic-bezier(0.4,0,0.2,1),' +
          'height 0.7s cubic-bezier(0.4,0,0.2,1),' +
          'left 0.7s cubic-bezier(0.4,0,0.2,1),' +
          'top 0.7s cubic-bezier(0.4,0,0.2,1),' +
          'border-radius 0.7s cubic-bezier(0.4,0,0.2,1)';

        el.style.width        = diagonal + 'px';
        el.style.height       = diagonal + 'px';
        el.style.left         = (vw/2 - diagonal/2) + 'px';
        el.style.top          = (vh/2 - diagonal/2) + 'px';
        el.style.borderRadius = '0';
      });

      // Fade out preloader after zoom
      setTimeout(function() {
        preloader.classList.add('pl-hide');
        document.body.classList.remove('loading');
        document.dispatchEvent(new CustomEvent('preloaderDone'));
        setTimeout(function() {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 500);
      }, 300);
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
