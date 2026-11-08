/* Studio Krivo — interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var PROJECTS = window.PROJECTS || [];
  var DIMS = window.DIMS || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mqMobile = window.matchMedia("(max-width: 860px)");
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- image helpers ---------- */
  var IMG_V = "?v=34"; // bump when an image file is replaced under the same name
  function full(file) { return "images/" + file + IMG_V; }
  function thumb(file) {
    if (/^tile-t\d+/.test(file)) return "images/" + file + IMG_V;
    var base = file.replace(/\.(jpe?g|png)$/i, "");
    if (/^ghostcloth-s\d|^viking-render/.test(file)) return "thumbs/" + base + ".png" + IMG_V; // transparent PNGs
    return "thumbs/" + base + ".jpg" + IMG_V;
  }
  function dims(file) { return DIMS[file] || [1600, 1200]; }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ==========================================================================
     Theme (day / night)
     ========================================================================== */
  var themeBtn = document.querySelector(".theme-toggle");
  function syncThemeLabel() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to day mode" : "Switch to night mode");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sk-theme", next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ==========================================================================
     Header: sliding background, logo shadow, current section, mobile menu
     ========================================================================== */
  var header = document.querySelector(".site-header");
  var brand = document.querySelector(".brand");
  var nav = document.getElementById("site-nav");
  var menuBtn = document.querySelector(".menu-toggle");
  var backTop = document.querySelector(".back-to-top");
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var navTargets = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    updateHeader();
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });

  function updateHeader() {
    var y = window.scrollY;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = clamp(y / max, 0, 1);
    // shadow travels left → right as the page scrolls
    brand.style.setProperty("--sx", (-7 + 14 * p).toFixed(2) + "px");
    header.classList.toggle("is-scrolled", y > 6 || nav.classList.contains("is-open"));
    backTop.classList.toggle("is-visible", y > window.innerHeight * 0.9);

    var current = -1;
    var line = window.innerHeight * 0.45;
    navTargets.forEach(function (t, i) {
      if (t && t.getBoundingClientRect().top <= line) current = i;
    });
    var contact = navTargets[navTargets.length - 1];
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4 && contact) current = navTargets.length - 1;
    navLinks.forEach(function (a, i) { a.classList.toggle("is-current", i === current); });
  }

  /* smooth scroll for in-page links */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-scroll]");
    if (!a) return;
    var id = a.getAttribute("href");
    if (!id || id.charAt(0) !== "#") return;
    e.preventDefault();
    setMenu(false);
    var top = 0;
    if (id !== "#top") {
      var t = document.querySelector(id);
      if (!t) return;
      top = t.getBoundingClientRect().top + window.scrollY;
    }
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", id === "#top" ? location.pathname : id);
  });

  /* ==========================================================================
     Gallery — museum wall
     ========================================================================== */
  var gallery = document.getElementById("gallery");
  var viewport = gallery.querySelector(".gallery__viewport");
  var wall = document.getElementById("wall");
  var filtersEl = gallery.querySelector(".filters");
  var progressEl = gallery.querySelector(".floor__progress");
  var rooms = [];
  var currentId = null;
  var galleryTop = 0;
  var maxX = 0;

  function wallImages(p) {
    // the render, then the hand-picked photos (`wall` in data.js); detail view still shows every photo
    return [p.cover].concat(p.wall || p.photos);
  }

  function frameHTML(p, file, idx, isCover) {
    var d = dims(file);
    var no = pad(p.n) + "." + idx;
    return (
      '<button class="frame' + (isCover ? " frame--cover" : "") + (isCover && p.cutout ? " frame--cutout" : "") + '" type="button" data-piece="' + p.id + '" data-file="' + file + '"' +
      ' aria-label="' + esc(p.name) + ", image " + no + ' — view details">' +
      '<img data-src="' + thumb(file) + '" width="' + d[0] + '" height="' + d[1] + '" alt="' + esc(p.name) + (isCover ? " — render" : " — realization") + '" decoding="async">' +
      '<span class="frame__cap"><b>' + no + "</b><i>" + esc(p.name) + "</i></span>" +
      "</button>"
    );
  }

  function buildGallery() {
    PROJECTS.forEach(function (p, i) {
      p.n = i + 1;
      var imgs = wallImages(p);

      var room = el("article", "room");
      room.id = "piece-" + p.id;
      room.dataset.piece = p.id;
      room.setAttribute("aria-label", p.name);

      var placard = el("div", "placard",
        '<span class="placard__no">No. ' + pad(p.n) + "</span>" +
        '<h3 class="placard__name">' + esc(p.name) + "</h3>" +
        '<p class="placard__meta"><span>' + esc(p.category) + "</span><span>" + p.year + "</span></p>" +
        '<button class="placard__btn" type="button" data-piece="' + p.id + '">View piece</button>'
      );

      var cover = el("div", "room__cover", frameHTML(p, imgs[0], 1, true));
      var photos = el("div", "room__photos");
      photos.innerHTML = imgs.slice(1).map(function (f, k) { return frameHTML(p, f, k + 2, false); }).join("");

      room.appendChild(placard);
      room.appendChild(cover);
      if (imgs.length > 1) room.appendChild(photos);
      wall.appendChild(room);
      rooms.push(room);
    });

    // filter chips
    PROJECTS.forEach(function (c) {
      var b = el("button", "chip");
      b.type = "button";
      b.dataset.filter = c.id;
      b.innerHTML =
        '<img class="chip__thumb" src="' + thumb(c.cover) + '" alt="" loading="lazy">' +
        "<span>" + esc(c.name) + "</span>";
      filtersEl.appendChild(b);
    });
  }

  /* quick, fixed-length glide so a chip takes you straight to its sculpture
     instead of slowly panning past every room on the way */
  var glideRaf = 0;
  function glideTo(top) {
    cancelAnimationFrame(glideRaf);
    var from = window.scrollY, dist = top - from;
    if (reduceMotion || Math.abs(dist) < 2) { window.scrollTo(0, top); return; }
    var dur = clamp(Math.abs(dist) * 0.12, 450, 900), t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // ease in-out
      window.scrollTo(0, from + dist * e);
      if (k < 1) glideRaf = requestAnimationFrame(step);
    }
    glideRaf = requestAnimationFrame(step);
  }
  ["wheel", "touchstart", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () { cancelAnimationFrame(glideRaf); }, { passive: true });
  });

  function scrollToRoom(id) {
    var room = id === "all" ? null : document.getElementById("piece-" + id);
    if (mqMobile.matches) {
      var target = room || wall;
      // land just below the fixed header (plus the filter rows if they're pinned too)
      var head = gallery.querySelector(".gallery__head");
      var off = header.offsetHeight + 16 + (getComputedStyle(head).position === "sticky" ? head.offsetHeight : 0);
      glideTo(target.getBoundingClientRect().top + window.scrollY - off);
      return;
    }
    if (!room) { glideTo(galleryTop); return; }
    var vw = viewport.clientWidth;
    var x = clamp(room.offsetLeft - Math.max(0, (vw - room.offsetWidth) / 2), 0, maxX);
    if (room.offsetWidth > vw) x = clamp(room.offsetLeft - vw * 0.08, 0, maxX);
    glideTo(galleryTop + x);
  }

  /* the chip of the sculpture you're looking at stays highlighted */
  function spyRoom() {
    var g = gallery.getBoundingClientRect();
    var id = null;
    if (g.top < window.innerHeight * 0.5 && g.bottom > window.innerHeight * 0.5) {
      var best = Infinity;
      rooms.forEach(function (r) {
        var b = r.getBoundingClientRect();
        var d = mqMobile.matches
          ? Math.abs(b.top + Math.min(b.height, window.innerHeight) / 2 - window.innerHeight / 2)
          : Math.abs(b.left + b.width / 2 - window.innerWidth / 2);
        if (d < best) { best = d; id = r.dataset.piece; }
      });
    }
    if (id === currentId) return;
    currentId = id;
    Array.prototype.forEach.call(filtersEl.children, function (b) {
      b.classList.toggle("is-current", b.dataset.filter === id);
    });
  }

  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) scrollToRoom(b.dataset.filter);
  });

  /* horizontal travel driven by vertical scroll */
  function layoutGallery() {
    if (mqMobile.matches) {
      gallery.style.height = "";
      wall.style.transform = "";
      maxX = 0;
      return;
    }
    maxX = Math.max(0, wall.offsetWidth - viewport.clientWidth);
    gallery.style.height = window.innerHeight + maxX + "px";
    galleryTop = gallery.getBoundingClientRect().top + window.scrollY;
    moveWall();
  }

  function moveWall() {
    if (mqMobile.matches) return;
    var x = clamp(window.scrollY - galleryTop, 0, maxX);
    wall.style.transform = "translate3d(" + (-x).toFixed(1) + "px,0,0)";
    progressEl.style.transform = "scaleX(" + (maxX ? x / maxX : 0).toFixed(4) + ")";
  }

  /* load wall images once the gallery is near */
  function loadWallImages() {
    wall.querySelectorAll("img[data-src]").forEach(function (img) {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }

  /* ==========================================================================
     Piece detail dialog
     ========================================================================== */
  var dialog = document.getElementById("piece");
  var cursorEl = document.querySelector(".cursor");

  function openPiece(id, file) {
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    dialog.querySelector(".piece__index").textContent = "No. " + pad(p.n);
    dialog.querySelector(".piece__title").textContent = p.title;
    dialog.querySelector(".piece__meta").textContent = p.category + " · " + p.year;
    dialog.querySelector(".piece__text").innerHTML = p.text.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
    dialog.querySelector(".piece__inquiry").innerHTML =
      esc(window.INQUIRY || "For inquiries or custom requests, please contact us at") +
      ' <a href="mailto:etan@krivorot.com">etan@krivorot.com</a>';

    var imgTag = function (f, alt) {
      var d = dims(f);
      return '<img src="' + full(f) + '" width="' + d[0] + '" height="' + d[1] + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">';
    };
    var grid = dialog.querySelector(".piece__grid");
    var hasFill = !!(p.fill && p.fill.length);
    grid.classList.toggle("piece__grid--fill", hasFill);
    if (hasFill) {
      // fixed layout: render with a pair of images under it, tall photos beside (see .piece__grid--fill)
      grid.innerHTML =
        "<figure>" + imgTag(p.cover, p.name) + "</figure>" +
        '<figure class="piece__pair">' + p.fill.map(function (f) { return imgTag(f, p.name + " tile"); }).join("") + "</figure>" +
        p.photos.concat(p.extras || []).map(function (f) { return "<figure>" + imgTag(f, p.name) + "</figure>"; }).join("");
    } else {
      var files = [p.cover].concat(p.photos, p.extras || []);
      if (file) files = [file].concat(files.filter(function (f) { return f !== file; }));
      grid.innerHTML = files.map(function (f) { return "<figure>" + imgTag(f, p.name) + "</figure>"; }).join("");
    }
    // e.g. the individual tiles: their own grid, underneath the sculpture photos
    dialog.querySelector(".piece__below").innerHTML = (p.below || []).map(function (f) {
      var d = dims(f);
      return '<figure><img src="' + full(f) + '" width="' + d[0] + '" height="' + d[1] + '" alt="' + esc(p.name) + ' tile" loading="lazy" decoding="async"></figure>';
    }).join("");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    dialog.scrollTop = 0;
    root.style.overflow = "hidden";
    if (cursorEl) dialog.appendChild(cursorEl); // keep the cursor above the top layer
  }

  function closePiece() {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  dialog.addEventListener("close", function () {
    root.style.overflow = "";
    if (cursorEl) document.body.appendChild(cursorEl);
  });
  dialog.querySelector(".piece__close").addEventListener("click", closePiece);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closePiece(); });

  wall.addEventListener("click", function (e) {
    var t = e.target.closest("[data-piece]");
    if (!t) return;
    openPiece(t.dataset.piece, t.dataset.file);
  });

  /* ==========================================================================
     Cursor — a soft ball that blends with the page
     ========================================================================== */
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !cursorEl) return;
    root.classList.add("has-cursor");
    var x = -100, y = -100, cx = -100, cy = -100, s = 1, ts = 1;
    var ease = reduceMotion ? 1 : 0.2;
    var interactive = "a, button, [role='button'], .frame, summary, label";

    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY;
      if (cx < -50) { cx = x; cy = y; }
      cursorEl.classList.remove("is-hidden");
      ts = e.target.closest && e.target.closest(interactive) ? 2.4 : 1;
    }, { passive: true });
    window.addEventListener("pointerdown", function () { ts *= 0.75; });
    window.addEventListener("pointerup", function (e) {
      ts = e.target.closest && e.target.closest(interactive) ? 2.4 : 1;
    });
    document.addEventListener("pointerleave", function () { cursorEl.classList.add("is-hidden"); });
    document.documentElement.addEventListener("mouseleave", function () { cursorEl.classList.add("is-hidden"); });

    (function tick() {
      cx += (x - cx) * ease;
      cy += (y - cy) * ease;
      s += (ts - s) * 0.18;
      cursorEl.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0) scale(" + s.toFixed(3) + ")";
      requestAnimationFrame(tick);
    })();
  }

  /* ==========================================================================
     Reveal on scroll, methodology image swap
     ========================================================================== */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ==========================================================================
     Typewriter — text types in as its block scrolls up into view, and
     untypes (last character first) when you scroll back up past it.
     Characters are pre-laid-out (just invisible), so nothing jumps while typing.
     ========================================================================== */
  function initTypewriter() {
    // [block that triggers, the text elements inside it typed in order]
    var blocks = [];
    var studio = document.querySelector(".studio__text");
    if (studio) blocks.push([studio, studio.querySelectorAll("h2, p")]);
    var aboutLead = document.querySelector(".about .lead");
    if (aboutLead) blocks.push([aboutLead, [aboutLead]]);
    if (!blocks.length || reduceMotion || !("IntersectionObserver" in window)) return; // text simply stays visible

    var SHORT_MS = 800;   // shortest line
    var LONG_MS = 2500;   // longest paragraph
    var MS_PER_CHAR = 12; // in between, time scales with length

    function prepare(node) {
      var full = node.textContent;
      var chars = [];
      var visual = el("span", "tw-visual");
      visual.setAttribute("aria-hidden", "true");

      // move the node's children into the visual layer, splitting text nodes into characters
      (function split(src, dest) {
        Array.prototype.slice.call(src.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var frag = document.createDocumentFragment();
            for (var i = 0; i < c.data.length; i++) {
              var s = document.createElement("span");
              s.className = "tw-ch";
              s.textContent = c.data[i];
              frag.appendChild(s);
              chars.push(s);
            }
            dest.appendChild(frag);
          } else if (c.nodeType === 1) {
            var copy = c.cloneNode(false);
            dest.appendChild(copy);
            split(c, copy);
          }
        });
      })(node, visual);

      var sr = el("span", "sr-only");
      sr.textContent = full;
      node.textContent = "";
      node.appendChild(sr);
      node.appendChild(visual);
      node.classList.add("tw");
      return chars;
    }

    // One animator per block: `dir` 1 types forward, -1 untypes backward,
    // and it can reverse mid-way from wherever it currently is.
    function makeBlock(trigger, nodes) {
      var chars = [], ms = [];
      Array.prototype.forEach.call(nodes, function (n) {
        var c = prepare(n);
        var per = clamp(c.length * MS_PER_CHAR, SHORT_MS, LONG_MS) / Math.max(1, c.length);
        c.forEach(function (ch) { chars.push(ch); ms.push(per); });
      });
      var state = { shown: 0, dir: 0, budget: 0, last: 0, raf: 0 };

      function frame(t) {
        state.budget += Math.min(100, t - state.last);
        state.last = t;
        if (state.dir > 0) {
          while (state.shown < chars.length && state.budget >= ms[state.shown]) {
            state.budget -= ms[state.shown];
            chars[state.shown++].classList.add("on");
          }
        } else {
          while (state.shown > 0 && state.budget >= ms[state.shown - 1]) {
            state.budget -= ms[state.shown - 1];
            chars[--state.shown].classList.remove("on");
          }
        }
        var finished = state.dir > 0 ? state.shown >= chars.length : state.shown <= 0;
        state.raf = finished ? 0 : requestAnimationFrame(frame);
      }

      return function go(dir) {
        if (state.dir === dir && state.raf) return;
        state.dir = dir;
        state.budget = 0;
        if (!state.raf) {
          state.last = performance.now();
          state.raf = requestAnimationFrame(frame);
        }
      };
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var go = en.target._tw;
        if (en.isIntersecting) go(1);
        // only untype when the block drops below the fold (scrolling back up);
        // scrolling down past it keeps the text
        else if (en.boundingClientRect.top > 0) go(-1);
      });
    }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });

    blocks.forEach(function (b) {
      b[0]._tw = makeBlock(b[0], b[1]);
      io.observe(b[0]);
    });
  }

  /* ==========================================================================
     About — orange highlights, swept in one at a time, in reading order.
     Each phrase waits until it is on screen AND the previous one has finished.
     ========================================================================== */
  function initHighlights() {
    var marks = Array.prototype.slice.call(document.querySelectorAll("mark.hl"));
    if (!marks.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      marks.forEach(function (m) { m.classList.add("is-lit"); });
      return;
    }
    var SWEEP_MS = 1000, PAUSE_MS = 250;
    var visible = new Set(), next = 0, busy = false;

    function pump() {
      if (busy || next >= marks.length || !visible.has(marks[next])) return;
      busy = true;
      marks[next].classList.add("is-lit");
      next++;
      setTimeout(function () { busy = false; pump(); }, SWEEP_MS + PAUSE_MS);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target);
        else visible.delete(en.target);
      });
      pump();
    }, { threshold: 1, rootMargin: "0px 0px -10% 0px" });
    marks.forEach(function (m) { io.observe(m); });
  }

  /* ==========================================================================
     Methodology connectors — evenly spaced dots, a dot on every corner
     ========================================================================== */
  var DOT_R = 3.2;      // dot radius (px)
  var DOT_GAP = 17;     // target centre-to-centre spacing (px)
  var SVG_NS = "http://www.w3.org/2000/svg";

  function mediaCenter(step, linkBox) {
    var m = step && step.querySelector(".step__media");
    if (!m) return null;
    var b = m.getBoundingClientRect();
    return b.left + b.width / 2 - linkBox.left;
  }

  function drawDots() {
    document.querySelectorAll(".step-link").forEach(function (link) {
      var box = link.getBoundingClientRect();
      var w = box.width, h = box.height;
      var pts;
      if (mqMobile.matches) {
        pts = [[DOT_R, DOT_R], [DOT_R, h - DOT_R]];
      } else {
        var x1 = mediaCenter(link.previousElementSibling, box);
        var x2 = mediaCenter(link.nextElementSibling, box);
        if (x1 == null || x2 == null) return;
        x1 = Math.round(x1); x2 = Math.round(x2);
        var mid = Math.round(h / 2);
        pts = [[x1, DOT_R], [x1, mid], [x2, mid], [x2, h - DOT_R]];
      }

      // walk each straight segment, splitting it into whole steps so its end is a dot
      var circles = [];
      for (var s = 0; s < pts.length - 1; s++) {
        var a = pts[s], b = pts[s + 1];
        var len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        var n = Math.max(1, Math.round(len / DOT_GAP));
        for (var i = s === 0 ? 0 : 1; i <= n; i++) {
          circles.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);
        }
      }

      var svg = link.querySelector("svg");
      if (!svg) {
        svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("aria-hidden", "true");
        link.appendChild(svg);
      }
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.innerHTML = circles.map(function (c) {
        return '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + DOT_R + '"/>';
      }).join("");
    });
  }

  /* Landing hover layering: the photo under the mouse is always on top (3),
     the one you just left sits just below it while it shrinks back (2),
     and the rest stay underneath (1). */
  function initLandingHover() {
    var pics = Array.prototype.slice.call(document.querySelectorAll(".landing__pic"));
    var last = null;
    pics.forEach(function (p) {
      p.addEventListener("pointerenter", function () {
        pics.forEach(function (q) {
          q.style.zIndex = q === p ? 3 : q === last ? 2 : 1;
        });
        last = p;
      });
    });
  }

  function initSwap() {
    var swap = document.querySelector(".step__media--swap");
    if (!swap || reduceMotion) return;
    setInterval(function () { swap.classList.toggle("is-swapped"); }, 3200);
  }

  /* ==========================================================================
     Boot
     ========================================================================== */
  buildGallery();
  initCursor();
  initReveal();
  initTypewriter();
  initHighlights();
  initSwap();
  initLandingHover();

  if ("IntersectionObserver" in window) {
    var near = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loadWallImages(); near.disconnect(); }
    }, { rootMargin: "150% 0px" });
    near.observe(gallery);
  } else {
    loadWallImages();
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateHeader();
      moveWall();
      spyRoom();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { layoutGallery(); updateHeader(); drawDots(); }, 120);
  });
  if (mqMobile.addEventListener) mqMobile.addEventListener("change", function () { layoutGallery(); setMenu(false); drawDots(); });
  if ("ResizeObserver" in window) new ResizeObserver(function () { layoutGallery(); }).observe(wall);

  layoutGallery();
  updateHeader();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutGallery);

  window.addEventListener("load", function () { layoutGallery(); drawDots(); });
  drawDots();
  // phones: pin the landing height to the first measured viewport height so it doesn't jump
  // when the browser toolbar collapses on scroll; only re-measure on rotation
  function setLandingHeight() { root.style.setProperty("--landing-h", window.innerHeight + "px"); }
  setLandingHeight();
  window.addEventListener("orientationchange", function () { setTimeout(setLandingHeight, 300); });

  // start the landing reveal (timeout as well, since rAF pauses in background tabs)
  var reveal = function () { document.body.classList.add("is-loaded"); };
  requestAnimationFrame(function () { requestAnimationFrame(reveal); });
  setTimeout(reveal, 120);

  // arriving with #gallery / #methodology etc. in the URL
  if (location.hash && location.hash.length > 1) {
    var target = document.querySelector(location.hash);
    if (target) setTimeout(function () { window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY); }, 60);
  }
})();
