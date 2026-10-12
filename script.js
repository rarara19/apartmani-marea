/* Apartmani Marea — zajedničke skripte */
(function () {
  "use strict";

  /* Mobilni meni */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Zatvori meni klikom na link
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Tekuća godina u podnožju */
  var y = String(new Date().getFullYear());
  document.querySelectorAll(".year").forEach(function (el) { el.textContent = y; });

  /* Dugmad za kopiranje (telefon, email...) */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "Kopirano ✓";
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch (e) { /* tiho */ }
  }

  /* Kontakt forma — prikaz potvrde (bez stvarnog slanja) */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var ime = (document.getElementById("ime") || {}).value || "";
      var box = document.getElementById("formSuccess");
      if (box) {
        box.textContent = "Hvala" + (ime ? ", " + ime : "") +
          "! Vaš upit je zabeležen u ovoj probnoj verziji. Da bi poruke stvarno stizale na email, forma se povezuje sa servisom za slanje (uputstvo je uz sajt).";
        box.hidden = false;
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  /* Otkrivanje elemenata pri skrolovanju */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    var revealSel = ".section-head, .feature, .card, .split > div, .table-wrap, .map-box, .cta-band, .info-list, .form-card, .list-plain, .marquee";
    var revealTargets = [];
    document.querySelectorAll(revealSel).forEach(function (el) {
      if (el.closest(".marquee-track")) return;
      el.classList.add("reveal");
      revealTargets.push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (t) { io.observe(t); });
  }
})();
