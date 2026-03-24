/* ============================================
   PRELOADER — synchronized with video (4s)
   ============================================ */
(function () {
    const DURATION = 4000; // ms — must match video length

    const overlay = document.getElementById("preloader");
    const video = document.getElementById("preloader-video");
    const fill = document.getElementById("preloader-bar-fill");
    const pct = document.getElementById("preloader-pct");

    if (!overlay) return;

    // Lock scroll
    document.body.classList.add("loading");

    let startTime = null;
    let rafId = null;

    /* ---- Progress animation ---- */
    function tick(ts) {
        if (!startTime) startTime = ts;
        const elapsed = Math.min(ts - startTime, DURATION);
        const progress = (elapsed / DURATION) * 100;

        fill.style.width = progress + "%";
        if (pct) pct.textContent = Math.floor(progress) + "%";

        if (elapsed < DURATION) {
            rafId = requestAnimationFrame(tick);
        }
    }

    /* ---- Hide preloader ---- */
    function hidePreloader() {
        cancelAnimationFrame(rafId);

        // Ensure bar is full
        fill.style.width = "100%";
        if (pct) pct.textContent = "100%";

        // Fade video out slightly before overlay fades
        if (video) video.style.opacity = "0";

        // Short delay then fade overlay
        setTimeout(function () {
            overlay.classList.add("hide");

            // After CSS transition ends, remove from DOM & unlock
            overlay.addEventListener("transitionend", function onEnd() {
                overlay.removeEventListener("transitionend", onEnd);
                overlay.remove();
                document.body.classList.remove("loading");
                // Fire custom event so script.js can start animations
                document.dispatchEvent(new CustomEvent("preloaderDone"));
            });
        }, 80);
    }

    /* ---- Start ---- */
    function start() {
        requestAnimationFrame(tick);
        setTimeout(hidePreloader, DURATION);
    }

    /* ---- Video handling ---- */
    if (video) {
        let videoReady = false;

        function startWhenReady() {
            if (!videoReady) {
                videoReady = true;
                video.classList.add("loaded");

                video.play().catch(() => {});
                start(); // 🔥 start preloader ONLY after video ready
            }
        }

        // When video can actually play
        video.addEventListener("canplaythrough", startWhenReady);

        // Fallback (slow network)
        setTimeout(startWhenReady, 1200);

        video.load();
    } else {
        start();
    }

    start();
})();
