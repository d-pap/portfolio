/* The first page of a visit settles in once (styles in base.css). Every later page arrives through its view
   transition instead. A prerendered page waits until it is actually shown. */
(function () {
  if (typeof window === "undefined") return;
  var root = document.documentElement;
  // Wait until every entrance finishes, including staggered elements.
  function settled(event) {
    if (event && event.animationName !== "enter") return;
    var left = document.getAnimations().some(function (animation) { return animation.animationName === "enter"; });
    if (left) return;
    root.classList.remove("first-visit");
    document.removeEventListener("animationend", settled);
  }
  function start() {
    try {
      if (sessionStorage.getItem("visited")) return;
      sessionStorage.setItem("visited", "1");
    } catch (e) {
      return;
    }
    root.classList.add("first-visit");
    // The class goes once the entrance is over, so its finished animations don't stay applied. The timeout covers a
    // page with nothing to enter; one still running then is caught by its own animationend.
    document.addEventListener("animationend", settled);
    setTimeout(settled, 1500);
  }
  if (document.prerendering) document.addEventListener("prerenderingchange", start, { once: true });
  else start();
})();
