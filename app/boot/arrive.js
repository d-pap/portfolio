/* Lazy images fade in over their average color once they can paint (class "arrive", styles in media.css).
   Inlined in <head> so it hears every load event. Images that are ready before the first paint, including
   everything on a prerendered page, show at once without the fade. The mark (data-arrived) can land before React
   hydrates, so every <img> with the arrive class carries suppressHydrationWarning. */
(function () {
  if (typeof window === "undefined") return;
  // Lazy images are hidden only while this script is here to show them again (media.css).
  document.documentElement.classList.add("arrive-on");
  var painted = false;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { painted = true; });
  });
  document.addEventListener("load", function (event) {
    var img = event.target;
    if (!img || img.tagName !== "IMG" || !img.classList.contains("arrive") || img.hasAttribute("data-arrived")) return;
    if (!painted) {
      img.setAttribute("data-arrived", "instant");
      return;
    }
    var show = function () { img.setAttribute("data-arrived", ""); };
    if (img.decode) img.decode().then(show, show);
    else show();
  }, true);
})();
