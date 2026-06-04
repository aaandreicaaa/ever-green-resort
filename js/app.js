/* EVER GREEN RESORT — interactions */

/* ---- Page loader ---- */
(function () {
  var loader = document.getElementById("loader");
  var root = document.documentElement;

  function heroReady() { root.classList.add("hero-ready"); }

  if (!loader) { heroReady(); return; }

  var MIN = 1700;
  var start = Date.now();
  var done = false;

  function dismiss() {
    if (done) return;
    done = true;
    var delay = Math.max(0, MIN - (Date.now() - start));
    setTimeout(function () {
      loader.classList.add("is-done");
      heroReady();
      setTimeout(function () { loader.remove(); }, 750);
    }, delay);
  }

  if (document.readyState === "complete") { dismiss(); }
  else { window.addEventListener("load", dismiss); }
  setTimeout(dismiss, 5000);
})();

(function () {
  "use strict";

  /* ---- WhatsApp deep links ---- */
  var PHONE = "37368333032";
  var MSG = encodeURIComponent("Bună ziua! Aș dori să fac o rezervare la Ever Green Resort.");
  var WA_URL = "https://wa.me/" + PHONE + "?text=" + MSG;
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.setAttribute("href", WA_URL); });

  /* ---- Nav: solid on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu toggle ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () {
    setMenu(!menu.classList.contains("is-open"));
  });
  if (menu) menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---- Scroll reveal (Palmaria fade-up + image scale + headline mask) ----
     Resilient: base CSS is VISIBLE. We add `.anim-ready` to <html> only now (JS alive),
     which switches on the hidden start states; the observer adds `.in` to reveal.
     Two safety nets force everything visible if the observer never fires. */
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // collect every animatable node
  var nodes = [].slice.call(document.querySelectorAll(".reveal, .mask, .media:not(.hero__bg), .svc, .gal figure"));

  if (reduce) { root.classList.add("anim-ready"); nodes.forEach(function (n) { n.classList.add("in"); }); return; }

  root.classList.add("anim-ready");

  var ioFired = false, io;
  function reveal(el) { el.classList.add("in"); }

  try {
    io = new IntersectionObserver(function (entries) {
      ioFired = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  } catch (err) {
    nodes.forEach(reveal);
    return;
  }

  // Reveal anything already in view on load (e.g. hero) next frame.
  requestAnimationFrame(function () {
    var vh = window.innerHeight || 800;
    nodes.forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < vh * 0.92) reveal(n);
    });
  });

  // Safety net 1: if the observer never delivered a callback, reveal all.
  setTimeout(function () { if (!ioFired) nodes.forEach(reveal); }, 1400);
  // Safety net 2: nothing should ever stay hidden.
  setTimeout(function () { nodes.forEach(reveal); }, 6000);
})();

/* ---- Amenities: set --amen-top CSS var = height of sticky left panel (mobile) ---- */
(function () {
  var left = document.querySelector(".amen__left");
  if (!left) return;
  function update() {
    document.documentElement.style.setProperty("--amen-top", left.offsetHeight + "px");
  }
  update();
  window.addEventListener("resize", update);
})();

/* ---- Amenities sticky-stack: update pinned text + counter on scroll ---- */
(function () {
  var section = document.querySelector(".amen");
  if (!section) return;
  var panels = [].slice.call(section.querySelectorAll(".amen__panel"));
  var numEl = document.getElementById("amenNum");
  var descEl = document.getElementById("amenDesc");
  if (!panels.length) return;

  var active = -1;
  function setActive(i) {
    if (i === active || i < 0 || i >= panels.length) return;
    active = i;
    var p = panels[i];
    section.setAttribute("data-active", p.getAttribute("data-num").replace(/^0/, "") || (i + 1));
    if (numEl) numEl.textContent = p.getAttribute("data-num");
    if (descEl) {
      descEl.style.opacity = "0";
      setTimeout(function () {
        descEl.textContent = p.getAttribute("data-desc");
        descEl.style.opacity = "1";
      }, 200);
    }
  }
  setActive(0);

  try {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var idx = panels.indexOf(e.target);
        if (e.isIntersecting) {
          setActive(idx);
        } else if (idx > 0 && e.boundingClientRect.top > 0) {
          // Panel exited downward — scrolling back up, activate previous
          setActive(idx - 1);
        }
      });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
    panels.forEach(function (p) { io.observe(p); });
  } catch (err) { /* sticky still works without the counter */ }
})();

