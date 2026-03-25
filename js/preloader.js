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

    function tick(ts) {
      if (startTime === null) {
        startTime = ts;
        requestAnimationFrame(tick);
        return;
      }

      var elapsed = ts - startTime;
      var raw     = Math.min(elapsed / DURATION, 1);
      var prog    = (raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw) * 100;

      if (percent) percent.textContent = Math.round(prog) + '%';

      for (var i = 0; i < stepEls.length; i++) {
        if (prog >= MILESTONES[i]) stepEls[i].classList.add('active');
      }

      for (var j = 0; j < fillEls.length; j++) {
        var from  = MILESTONES[j];
        var to    = MILESTONES[j + 1];
        var local = Math.max(0, Math.min(prog - from, to - from));
        fillEls[j].style.width = (local / (to - from) * 100) + '%';
      }

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          preloader.classList.add('pl-hide');
          document.body.classList.remove('loading');
          document.dispatchEvent(new CustomEvent('preloaderDone'));
        }, 300);
      }
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
