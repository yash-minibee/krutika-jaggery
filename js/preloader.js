// (function () {
//     const DURATION = 4000;

//     const overlay = document.getElementById("preloader");
//     const video = document.getElementById("preloader-video");
//     const fill = document.getElementById("preloader-bar-fill");
//     const pct = document.getElementById("preloader-pct");

//     if (!overlay) return;

//     document.body.classList.add("loading");

//     let startTime = null;
//     let rafId = null;

//     function tick(ts) {
//         if (!startTime) startTime = ts;
//         const elapsed = Math.min(ts - startTime, DURATION);
//         const progress = (elapsed / DURATION) * 100;

//         fill.style.width = progress + "%";
//         if (pct) pct.textContent = Math.floor(progress) + "%";

//         if (elapsed < DURATION) {
//             rafId = requestAnimationFrame(tick);
//         }
//     }

//     function hidePreloader() {
//         cancelAnimationFrame(rafId);

//         fill.style.width = "100%";
//         if (pct) pct.textContent = "100%";

//         if (video) video.style.opacity = "0";

//         setTimeout(function () {
//             overlay.classList.add("hide");

//             overlay.addEventListener("transitionend", function onEnd() {
//                 overlay.removeEventListener("transitionend", onEnd);
//                 overlay.remove();
//                 document.body.classList.remove("loading");
//                 document.dispatchEvent(new CustomEvent("preloaderDone"));
//             });
//         }, 80);
//     }

//     function start() {
//         requestAnimationFrame(tick);
//         setTimeout(hidePreloader, DURATION);
//     }

//     // if (video) {
//     //     let started = false;

//     //     function startWhenReady() {
//     //         if (started) return;
//     //         started = true;

//     //         video.classList.add("loaded");
//     //         video.play().catch(() => {});
//     //         start();
//     //     }

//     //     video.addEventListener("canplaythrough", startWhenReady);

//     //     // fallback
//     //     setTimeout(startWhenReady, 1200);

//     //     video.load();
//     // } else {
//     //     start();
//     // }

//     if (video) {
//         let started = false;

//         function startWhenReady() {
//             if (started) return;
//             started = true;

//             video.classList.add("loaded");
//             video.play().catch(() => {});
//             start();
//         }

//         // Try multiple events (more reliable)
//         video.addEventListener("loadeddata", startWhenReady);
//         video.addEventListener("canplay", startWhenReady);
//         video.addEventListener("canplaythrough", startWhenReady);

//         // Strong fallback
//         setTimeout(startWhenReady, 2000);

//         video.load();
//     } else {
//         start();
//     }
// })();



(function () {
    const overlay = document.getElementById("preloader");
    const video = document.getElementById("preloader-video");
    const fill = document.getElementById("preloader-bar-fill");
    const pct = document.getElementById("preloader-pct");

    if (!overlay) return;

    document.body.classList.add("loading");

    let progress = 0;
    let rafId;

    function animateProgress() {
        progress += (100 - progress) * 0.08; // smooth easing

        if (fill) fill.style.width = progress + "%";
        if (pct) pct.textContent = Math.floor(progress) + "%";

        if (progress < 99) {
            rafId = requestAnimationFrame(animateProgress);
        }
    }

    function finishLoading() {
        cancelAnimationFrame(rafId);

        progress = 100;
        if (fill) fill.style.width = "100%";
        if (pct) pct.textContent = "100%";

        if (video) video.style.opacity = "0";

        setTimeout(() => {
            overlay.classList.add("hide");

            overlay.addEventListener("transitionend", function onEnd() {
                overlay.removeEventListener("transitionend", onEnd);
                overlay.remove();
                document.body.classList.remove("loading");
                document.dispatchEvent(new CustomEvent("preloaderDone"));
            });
        }, 300);
    }

    function startPreloader() {
        animateProgress();

        // Minimum visible time (UX smoothness)
        setTimeout(finishLoading, 1200);
    }

    if (video) {
        let started = false;

        function handleReady() {
            if (started) return;
            started = true;

            video.classList.add("loaded");

            video.play().catch(() => {});
            startPreloader();
        }

        // BEST event (use only ONE)
        video.addEventListener("canplaythrough", handleReady, { once: true });

        // Fallback if video fails
        setTimeout(handleReady, 2500);

    } else {
        startPreloader();
    }
})();