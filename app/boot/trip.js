/* The trip between the work and the rooms behind it. Inlined in <head> by app/boot/boot.ts so its listeners exist
   before the first paint; also loaded by trip.test.ts, which reads the pure helpers from globalThis.__trip. */
(function () {
  var FRONT = /^\/(work\/[^/]+)?$/;
  var ROOM = /^\/(bookshelf|notes)(\/[^/]+)?$/;
  var CASE = /^\/work\/[^/]+$/;
  var CLEARANCE = 120; // room for the sheet's shadow to leave the screen with it

  function pathOf(url) {
    return url.pathname.replace(/\/+$/, "") || "/";
  }

  function transitionType(fromUrl, toUrl) {
    if (!fromUrl || !toUrl) return null;
    var from, to;
    try {
      from = new URL(fromUrl);
      to = new URL(toUrl);
    } catch (e) {
      return null;
    }
    if (from.origin !== to.origin) return null;
    var a = pathOf(from);
    var b = pathOf(to);
    if (FRONT.test(a) && ROOM.test(b)) return "to-back";
    if (ROOM.test(a) && FRONT.test(b)) return "to-front";
    if (ROOM.test(a) && ROOM.test(b) && a !== b && ROOM.exec(a)[1] === ROOM.exec(b)[1]) return "within-room";
    if ((a === "/" && CASE.test(b)) || (CASE.test(a) && b === "/")) return "to-case";
    return null;
  }

  // The sheet's view-transition group reports where the sheet was (or will be) as a transform plus a height. Its bottom
  // edge on screen, clamped to the screen; NaN when there is no sheet group to read.
  function sheetEdge(transform, height, viewport) {
    var ty = NaN;
    if (transform === "none") ty = 0;
    var m = /^matrix(3d)?\(([^)]+)\)$/.exec(transform || "");
    if (m) ty = Number(m[2].split(",")[m[1] ? 13 : 5]);
    var bottom = ty + parseFloat(height);
    return isFinite(bottom) ? Math.min(Math.max(bottom, 0), viewport) : NaN;
  }

  function liftDistance(transform, height, viewport) {
    var bottom = sheetEdge(transform, height, viewport);
    return isFinite(bottom) ? Math.round(bottom + CLEARANCE) : viewport + CLEARANCE;
  }

  // The frame takes the color of the plane beneath it. Its new snapshot is uncovered along the sheet's edge, which sits
  // at edge - lift·p going behind and edge - lift·(1 - p) coming back, for the lift's eased progress p. Keyframe offsets
  // are in that same eased space, so a wipe run with the lift's easing stays exactly on the edge.
  function frameWipe(type, edge, lift, height) {
    if (!isFinite(edge) || !(lift > 0) || !(height > 0)) return null;
    var behind = type === "to-back";
    var enter = behind ? (edge - height) / lift : 1 - edge / lift;
    var leave = behind ? edge / lift : 1 - (edge - height) / lift;
    // An edge already inside the frame wipes from the start rather than jumping; one that never reaches it switches
    // the frame at the nearest end.
    var from = Math.min(Math.max(enter, 0), 1);
    var to = Math.max(from, Math.min(Math.max(leave, 0), 1));
    var covered = behind ? "inset(" + height + "px 0px 0px 0px)" : "inset(0px 0px " + height + "px 0px)";
    var shown = "inset(0px 0px 0px 0px)";
    return [
      { offset: 0, clipPath: covered },
      { offset: from, clipPath: covered },
      { offset: to, clipPath: shown },
      { offset: 1, clipPath: shown },
    ];
  }

  function roomOf(url) {
    if (!url) return null;
    try {
      var match = ROOM.exec(pathOf(new URL(url)));
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  }

  globalThis.__trip = {
    transitionType: transitionType,
    liftDistance: liftDistance,
    roomOf: roomOf,
    sheetEdge: sheetEdge,
    frameWipe: frameWipe,
  };
  if (typeof window === "undefined" || !("onpagereveal" in window)) return;

  var root = document.documentElement;

  function token(name, fallback) {
    var value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
  }

  // Lime behind the sheet while it's at the end of the page, so the gap it leaves when it lifts is the plane's color.
  function markEnd() {
    var end = document.querySelector(".sheet-end");
    root.classList.toggle("at-end", !!end && end.getBoundingClientRect().top <= innerHeight);
  }

  // Only the doorway for the room being entered or left carries a name; the others stay with the back plane. A doorway
  // the sheet still covers stays put too: its group draws above the sheet, so the word would cross the work in plain
  // sight. trip.css then fades the title with the room's contents.
  function onlyDoor(room) {
    var end = document.querySelector(".sheet-end");
    var edge = end ? end.getBoundingClientRect().top : -Infinity;
    document.querySelectorAll(".door").forEach(function (door) {
      var word = door.querySelector(".door-word");
      if (!word) return;
      var flies = door.getAttribute("data-room") === room && word.getBoundingClientRect().top >= edge;
      word.style.viewTransitionName = flies ? "" : "none";
    });
  }

  // Switching entries keeps the filters and the list exactly where they are (spec §3.4), but a new page opens at its
  // top. Before leaving, this notes how far the next page should scroll: as far as this one, or, once the list has
  // stuck, just far enough to stick it, so the next entry starts at its top. Everything above the list is the same on
  // every page of a room. Back and Forward restore each page's own scroll, so only the old entry's place is noted for
  // them. Phones stack the list over the entry and keep the default.
  var KEEP = "room-scroll";

  function noteListScroll(toUrl, traverse) {
    var reader = document.querySelector(".reader");
    var side = reader && reader.querySelector(".reader-side");
    var entry = reader && reader.querySelector(".reader-entry");
    if (!side || !entry || !matchMedia("(min-width: 900px)").matches) return;
    var note = { url: toUrl, entryTop: entry.getBoundingClientRect().top };
    // The side starts at the grid's top; measuring the side itself would give where it's stuck. Rounded up, so the
    // next page's list sticks rather than resting a fraction of a pixel lower.
    var sticks = Math.ceil(reader.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(side).top));
    if (!traverse) note.y = Math.min(scrollY, sticks);
    try {
      sessionStorage.setItem(KEEP, JSON.stringify(note));
    } catch (e) {}
  }

  function keepListScroll(transition, traverse) {
    var kept = null;
    try {
      kept = JSON.parse(sessionStorage.getItem(KEEP));
      sessionStorage.removeItem(KEEP);
    } catch (e) {}
    if (!kept || kept.url !== location.href) return;
    if (!traverse && typeof kept.y === "number") scrollTo(0, kept.y);
    // The old entry's snapshot is drawn at the new entry's top; this puts it back where it was on screen, so it fades
    // out in place instead of jumping by the difference in scroll (trip.css).
    var entry = document.querySelector(".reader-entry");
    if (!entry || typeof kept.entryTop !== "number") return;
    root.style.setProperty("--reader-from", kept.entryTop - entry.getBoundingClientRect().top + "px");
    transition.finished.then(function () { root.style.removeProperty("--reader-from"); }, function () {});
  }

  addEventListener("pageswap", function (event) {
    if (!event.viewTransition || !event.activation || !event.activation.entry) return;
    var type = transitionType(location.href, event.activation.entry.url);
    if (!type) return;
    if (type === "within-room") noteListScroll(event.activation.entry.url, event.activation.navigationType === "traverse");
    if (type === "to-back") {
      markEnd();
      onlyDoor(roomOf(event.activation.entry.url));
    }
    // A push from a room to a front page (the frame's name, or × after arriving directly) lands at its top, so the
    // pages crossfade. Back and Forward restore the end of the page and keep the trip.
    if (type === "to-front" && event.activation.navigationType !== "traverse") return;
    event.viewTransition.types.add(type);
  });

  addEventListener("pagereveal", function (event) {
    var transition = event.viewTransition;
    if (!transition) return;
    var activation = window.navigation && navigation.activation;
    var from = activation && activation.from ? activation.from.url : document.referrer;
    var type = transitionType(from, location.href);
    if (!type) return;
    if (type === "within-room") keepListScroll(transition, !activation || activation.navigationType === "traverse");
    if (type === "to-front") {
      // The same call the room made in pageswap, plus where the page actually landed: only a traversal back to the
      // end of the sheet can show it dropping into place. trip.css fades anything the room already named.
      if (activation && activation.navigationType !== "traverse") return;
      markEnd();
      if (!root.classList.contains("at-end")) return;
      onlyDoor(roomOf(from));
    }
    transition.types.add(type);
    if (type !== "to-back" && type !== "to-front") return;
    transition.ready.then(function () {
      var duration = parseFloat(token("--t-surface", "780")) || 780;
      var easing = token("--ease-surface", "cubic-bezier(.7, 0, .2, 1)");
      var sheet = type === "to-back" ? "::view-transition-old(sheet)" : "::view-transition-new(sheet)";
      var group = getComputedStyle(root, "::view-transition-group(sheet)");
      var edge = sheetEdge(group.transform, group.height, innerHeight);
      var animations = [];
      // Going behind from higher up the page (Tab to a doorway, or Back into a room), the sheet runs past the bottom of
      // the screen and can't be seen lifting away: it fades out over the room instead, and the frame crossfades with it.
      var runsPast = sheetEdge(group.transform, group.height, Infinity) > innerHeight;
      if (runsPast) {
        animations.push(root.animate(
          { opacity: type === "to-back" ? [1, 0] : [0, 1] },
          { duration: 160, fill: "both", pseudoElement: sheet }
        ));
        // The sheet covers everything else on the old page, so that goes at once instead of showing through it.
        if (type === "to-back") {
          animations.push(root.animate(
            { opacity: [0, 0] },
            { duration: 160, fill: "both", pseudoElement: "::view-transition-old(root)" }
          ));
        }
        edge = NaN;
      }
      var lift = isFinite(edge) ? liftDistance(group.transform, group.height, innerHeight) : 0;
      if (lift) {
        var lifted = "translateY(" + -lift + "px)";
        animations.push(root.animate(
          { transform: type === "to-back" ? ["none", lifted] : [lifted, "none"] },
          {
            duration: duration,
            easing: easing,
            fill: "both",
            pseudoElement: sheet,
          }
        ));
      }
      // The frame is pinned to the top of the screen, so the edge's distance down the screen is its depth into the
      // frame. The wipe shares the lift's duration and easing so it stays on the edge; without a sheet to follow, the
      // frame crossfades about halfway through instead, or with the sheet's fade when that goes at once (else a dark
      // frame would sit over the lime room).
      var height = parseFloat(getComputedStyle(root, "::view-transition-group(frame)").height);
      var wipe = frameWipe(type, edge, lift, height);
      animations.push(root.animate(
        wipe || { opacity: [0, 1] },
        wipe
          ? { duration: duration, easing: easing, fill: "both", pseudoElement: "::view-transition-new(frame)" }
          : {
              duration: runsPast ? 160 : parseFloat(token("--t-quick", "220")) || 220,
              delay: runsPast ? 0 : duration * (type === "to-back" ? 0.5 : 0.45),
              fill: "both",
              pseudoElement: "::view-transition-new(frame)",
            }
      ));
      // Their fill holds the sheet and the frame until the transition ends; after that they would linger in
      // getAnimations().
      transition.finished.then(function () {
        animations.forEach(function (animation) { animation.cancel(); });
      }, function () {});
    }, function () {});
  });
})();
