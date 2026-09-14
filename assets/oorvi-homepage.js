// Oorvi homepage — lightweight vanilla JS (no build step, no 3D dependency).
// Handles: mobile menu toggle, range filters, scroll reveal.

(function () {
  "use strict";

  // -- Mobile menu -----------------------------------------------------
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  var menuClose = document.getElementById("menuClose");

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add("is-open");
  }
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove("is-open");
  }
  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  // -- Range filters -----------------------------------------------------
  var filterButtons = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".oil-card");

  function applyFilter(filter) {
    cards.forEach(function (card) {
      var cats = (card.getAttribute("data-categories") || "").split(",");
      var show = filter === "all" || cats.indexOf(filter) !== -1;
      card.classList.toggle("is-visible", show);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  applyFilter("all");

  // -- Scroll reveal -----------------------------------------------------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
