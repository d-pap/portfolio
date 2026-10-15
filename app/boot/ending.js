/* The home ending: one card per deliberate gesture, then the personal plane. Runs before hydration, like trip.js.
   With no script the first card is a still interlude and the personal links remain ordinary links. */
(function () {
  if (typeof window === "undefined" || location.pathname !== "/") return;
  var root = document.documentElement;
  var SEEN = "after-hours-seen";
  var done = false;
  try { done = sessionStorage.getItem(SEEN) === "1"; } catch (e) {}
  root.dataset.ending = done ? "done" : "waiting";
  root.dataset.bumpStep = done ? "2" : "0";

  function start() {
    var bump = document.getElementById("ending");
    var personal = document.getElementById("back");
    var edge = document.querySelector(".sheet-end");
    if (!bump || !personal || !edge || !personal.querySelector(".door")) {
      delete root.dataset.ending;
      delete root.dataset.bumpStep;
      return;
    }
    var active = false, revealing = false, step = done ? 2 : 0, timer = 0, frame = 0;
    var lastWheel = -Infinity, wheelConsumed = false, wheelSum = 0;
    var touchY = 0, touchSum = 0, touchConsumed = false, touchManual = false;
    personal.inert = !done;

    function gate() {
      var peek = parseFloat(getComputedStyle(bump).getPropertyValue("--lime-peek")) || 12;
      return Math.max(0, edge.getBoundingClientRect().top + scrollY - innerHeight + peek);
    }
    function pin() {
      var y = gate();
      if (Math.abs(scrollY - y) > .5) scrollTo({ top: y, behavior: "instant" });
    }
    function setCard(index) {
      step = index;
      root.dataset.bumpStep = String(index);
    }
    function enter() {
      if (active || done) return;
      active = true;
      root.dataset.ending = "holding";
      setCard(0);
      // Arrival consumes this whole gesture, including its trailing trackpad or touch momentum.
      wheelConsumed = touchConsumed = true;
      wheelSum = 0;
      pin();
    }
    function leaveUp() {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      active = revealing = false;
      root.dataset.ending = "waiting";
      setCard(0);
    }
    function finish() {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      active = revealing = false;
      done = true;
      root.dataset.ending = "done";
      personal.inert = false;
      try { sessionStorage.setItem(SEEN, "1"); } catch (e) {}
    }
    function reveal() {
      if (!active || step !== 2) return;
      active = false;
      revealing = true;
      root.dataset.ending = "revealing";
      personal.inert = false;
      var from = scrollY, started = performance.now();
      function tick(now) {
        if (!revealing) return;
        var t = Math.min(1, (now - started) / 800);
        var ease = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        var to = document.documentElement.scrollHeight - innerHeight;
        scrollTo({ top: from + (to - from) * ease, behavior: "instant" });
        if (t < 1) frame = requestAnimationFrame(tick);
        else finish();
      }
      frame = requestAnimationFrame(tick);
    }
    function advance() {
      if (!active || step === 2) return;
      setCard(step + 1);
      if (step === 2) timer = setTimeout(reveal, 950);
    }
    function prevent(event) { if (event.cancelable) event.preventDefault(); }
    function editable(target) { return target instanceof Element && target.closest("input,textarea,select,[contenteditable]"); }
    function clamp() {
      if (done || revealing || document.prerendering) return;
      if (active) pin();
      else if (scrollY >= gate() - .5) enter();
    }
    addEventListener("scroll", clamp, { passive: true });
    addEventListener("resize", function () { if (active) pin(); }, { passive: true });
    addEventListener("wheel", function (event) {
      if (done || event.ctrlKey || editable(event.target) || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      var dy = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
      if (!dy) return;
      if (revealing) {
        prevent(event);
        if (dy < 0) { finish(); scrollBy({ top: dy, behavior: "instant" }); }
        return;
      }
      var now = performance.now(), fresh = now - lastWheel > 200;
      lastWheel = now;
      if (fresh) { wheelConsumed = false; wheelSum = 0; }
      if (active) {
        prevent(event);
        if (dy < 0) { leaveUp(); scrollBy({ top: dy, behavior: "instant" }); return; }
        wheelSum += dy;
        if (!wheelConsumed && wheelSum >= 24) { wheelConsumed = true; advance(); }
      } else if (dy > 0 && scrollY + dy >= gate()) {
        prevent(event);
        enter();
      }
    }, { passive: false });
    addEventListener("touchstart", function (event) {
      if (done || event.touches.length !== 1 || editable(event.target)) return;
      touchY = event.touches[0].clientY;
      touchSum = 0;
      touchConsumed = false;
      touchManual = (active || revealing) && !event.target.closest("button,a");
      if (touchManual) prevent(event);
    }, { passive: false });
    function touchEnd() { touchManual = false; }
    addEventListener("touchend", touchEnd, { passive: true });
    addEventListener("touchcancel", touchEnd, { passive: true });
    addEventListener("touchmove", function (event) {
      if (done || event.touches.length !== 1 || editable(event.target)) return;
      var y = event.touches[0].clientY, dy = touchY - y;
      touchY = y;
      if (!active && !revealing && touchManual) {
        prevent(event);
        scrollBy({ top: dy, behavior: "instant" });
        return;
      }
      if (revealing) {
        prevent(event);
        if (dy < 0) { finish(); scrollBy({ top: dy, behavior: "instant" }); }
        return;
      }
      if (active) {
        prevent(event);
        if (dy < 0) { leaveUp(); scrollBy({ top: dy, behavior: "instant" }); return; }
        touchSum += dy;
        if (!touchConsumed && touchSum >= 40) { touchConsumed = true; advance(); }
      } else if (dy > 0 && scrollY + dy >= gate()) { prevent(event); enter(); }
    }, { passive: false });
    addEventListener("keydown", function (event) {
      if (done || event.altKey || event.ctrlKey || event.metaKey || editable(event.target)) return;
      // A focused button or link keeps its native activation keys; arrows and Page Down still scroll.
      if ((event.code === "Space" || event.key === "Enter") && event.target.closest("button,a")) return;
      var down = ["ArrowDown", "PageDown", "End"].includes(event.key) || (event.code === "Space" && !event.shiftKey);
      var up = ["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.code === "Space" && event.shiftKey);
      if (!down && !up) return;
      if (revealing) {
        prevent(event);
        if (up) { finish(); scrollBy({ top: -100, behavior: "instant" }); }
        return;
      }
      if (active) {
        prevent(event);
        if (up) {
          leaveUp();
          scrollTo({ top: event.key === "Home" ? 0 : Math.max(0, scrollY - (event.key === "ArrowUp" ? 60 : innerHeight * .75)), behavior: "instant" });
        } else if (!event.repeat) advance();
      } else if (down && (event.key === "End" || scrollY + (event.key === "ArrowDown" ? 60 : innerHeight * .9) >= gate())) {
        prevent(event);
        enter();
      }
    });
    bump.querySelector(".ending-next").addEventListener("click", advance);
    // Native Back/Forward can restore a position after the plane was revealed, with or without bfcache.
    // A fresh home in the same tab also remembers the ending rather than making the visitor repeat it.
    addEventListener("pageshow", function () {
      try { if (sessionStorage.getItem(SEEN) === "1") { setCard(2); finish(); } } catch (e) {}
      if (!done && active && step === 2) { clearTimeout(timer); timer = setTimeout(reveal, 950); }
      clamp();
    });
    addEventListener("pagehide", function () {
      if (revealing) finish();
      clearTimeout(timer);
    });
    // An explicit link to the personal section should land where it says it does.
    function anchor() { if (location.hash === "#back") { setCard(2); finish(); } }
    addEventListener("hashchange", anchor);
    anchor();
    clamp();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
