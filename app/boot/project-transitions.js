/* Shared media between the project index and a project page. Native links keep their usual navigation behavior. */
(function () {
  function route(fromUrl, toUrl) {
    try {
      var from = new URL(fromUrl);
      var to = new URL(toUrl);
      if (from.origin !== to.origin) return null;
      var a = from.pathname.replace(/\/+$/, "") || "/";
      var b = to.pathname.replace(/\/+$/, "") || "/";
      var project;
      if (a === "/" && !to.hash && (project = /^\/work\/([^/]+)$/.exec(b))) {
        return { direction: "open", slug: project[1] };
      }
      if (b === "/" && (!to.hash || to.hash === "#projects") && (project = /^\/work\/([^/]+)$/.exec(a))) {
        return { direction: "close", slug: project[1] };
      }
    } catch (error) {}
    return null;
    return null;
  }

  globalThis.__projectTransitions = { route: route };
  if (typeof window === "undefined") return;

  var root = document.documentElement;
  var names = new WeakMap();
  var serial = 0;
  var run = 0;
  var playbackKey = "portfolio-project-playback";
  var navigationKey = "portfolio-project-navigation";
  var returnKey = "portfolio-project-return";

  function returnPreview(slug, reduced) {
    if (!matchMedia("(min-width: 1000px) and (hover: hover) and (pointer: fine)").matches) return;
    document.querySelectorAll(".index-preview-column [data-project-preview]").forEach(function (container) {
      if (container.getAttribute("data-project-preview") !== slug) return;
      var figure = container.closest("figure");
      figure.hidden = false;
      if (!reduced) {
        figure.dataset.projectRestoring = "";
        figure.style.animation = "none";
      }
      container.querySelectorAll("[data-src]").forEach(function (asset) {
        if (asset.dataset.poster) asset.poster = asset.dataset.poster;
        if (asset.getAttribute("src") !== asset.dataset.src) asset.src = asset.dataset.src;
      });
    });
    try { sessionStorage.setItem(returnKey, slug); } catch (error) {}
    window.dispatchEvent(new CustomEvent("project-preview-return", { detail: slug }));
  }

  function visible(element) {
    if (!element) return false;
    var rect = element.getBoundingClientRect();
    var height = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 60);
    return rect.width > 0 && rect.height > 0 && height >= Math.min(rect.height * 0.2, 120);
  }

  function media(slug, home) {
    var selector = home ? "[data-project-preview]" : "[data-project-hero]";
    var attribute = home ? "data-project-preview" : "data-project-hero";
    var containers = document.querySelectorAll(selector);
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (container.getAttribute(attribute) !== slug || !visible(container)) continue;
      var element;
      if (home) {
        var video = container.querySelector("video");
        var image = container.querySelector("img");
        element = video && (video.readyState >= 2 || !image) ? video : image;
      } else element = container.querySelector(".media-composition, .media-logo, .device");
      if (visible(element)) return element;
    }
    return null;
  }

  function name(element, transition, incoming) {
    if (!element) return;
    var token = ++serial;
    names.set(element, token);
    element.style.viewTransitionName = "project-media";
    var clear = function () {
      if (names.get(element) !== token) return;
      element.style.removeProperty("view-transition-name");
      names.delete(element);
    };
    (incoming ? transition.ready : transition.finished).then(clear, clear);
  }

  function videoIn(element) {
    return element && (element.tagName === "VIDEO" ? element : element.querySelector("video"));
  }

  function savePlayback(element, slug) {
    var video = videoIn(element);
    if (!video) return;
    try {
      sessionStorage.setItem(playbackKey, JSON.stringify({
        slug: slug, src: video.src, time: video.currentTime, saved: Date.now(),
      }));
    } catch (error) {}
    video.pause();
  }

  function restorePlayback(element, slug) {
    var video = videoIn(element);
    var saved;
    try {
      saved = JSON.parse(sessionStorage.getItem(playbackKey));
      sessionStorage.removeItem(playbackKey);
    } catch (error) {}
    if (!saved || saved.slug !== slug || Date.now() - saved.saved > 8000) return;
    // Some previews are short excerpts, while the hero is a longer film. Keep the excerpt visible during the
    // expansion, then hand over to the different film rather than snapping between unrelated frames on click.
    if (!video || saved.src !== video.src) {
      root.dataset.projectMediaSwap = "";
      return;
    }
    if (!Number.isFinite(saved.time) || saved.time < 0) return;
    var seek = function () {
      if (isFinite(video.duration) && video.duration > 0) video.currentTime = saved.time % video.duration;
      if (!document.hidden) video.play().catch(function () {});
    };
    if (video.readyState) seek();
    else {
      video.addEventListener("loadedmetadata", seek, { once: true });
      video.preload = "auto";
    }
  }

  function prepare(transition, navigation, incoming) {
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (incoming && navigation.direction === "close") returnPreview(navigation.slug, reduced);
    if (reduced) {
      transition.skipTransition();
      return;
    }
    var token = ++run;
    delete root.dataset.projectMediaSwap;
    root.dataset.projectMotion = navigation.direction;
    var home = incoming ? navigation.direction === "close" : navigation.direction === "open";
    var element = media(navigation.slug, home);
    name(element, transition, incoming);
    if (incoming) restorePlayback(element, navigation.slug);
    else savePlayback(element, navigation.slug);
    var clear = function () {
      if (run === token) {
        delete root.dataset.projectMotion;
        delete root.dataset.projectMediaSwap;
        var figure = element && element.closest("figure");
        if (figure) figure.removeAttribute("data-project-restoring");
      }
    };
    transition.finished.then(clear, clear);
  }

  addEventListener("pageswap", function (event) {
    if (!event.activation || !event.activation.entry) return;
    var navigation = route(location.href, event.activation.entry.url);
    if (navigation) {
      try {
        sessionStorage.setItem(navigationKey, JSON.stringify({ from: location.href, to: event.activation.entry.url, saved: Date.now() }));
      } catch (error) {}
      if (event.viewTransition) prepare(event.viewTransition, navigation, false);
    }
  });

  addEventListener("pagereveal", function (event) {
    var activation = window.navigation && window.navigation.activation;
    var previous;
    try {
      previous = JSON.parse(sessionStorage.getItem(navigationKey));
      sessionStorage.removeItem(navigationKey);
    } catch (error) {}
    // pageswap also supplies a return address in browsers without the global Navigation API.
    var savedFrom = previous && previous.to === location.href && Date.now() - previous.saved < 8000 ? previous.from : null;
    var from = activation && activation.from ? activation.from.url : savedFrom || document.referrer;
    var navigation = route(from, location.href);
    if (navigation) {
      if (event.viewTransition) prepare(event.viewTransition, navigation, true);
      else if (navigation.direction === "close") returnPreview(navigation.slug, true);
    }
  });
})();
