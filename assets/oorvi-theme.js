// Oorvi theme — lightweight vanilla JS (no build step).
// Handles: mobile menu toggle, scroll reveal.

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

  // -- Shop page "Experience" view ----------------------------------------
  // Only present on sections/main-collection.liquid; a no-op elsewhere.
  var scrollContainer = document.getElementById("st-scroll-container");
  var gridContainer = document.getElementById("products-grid-view");

  if (scrollContainer && gridContainer) {
    var viewToggle = document.getElementById("product-view-toggle");
    var btnScroll = document.getElementById("btn-view-scroll");
    var btnGrid = document.getElementById("btn-view-grid");
    var navDots = document.getElementById("st-nav-dots");
    var header = document.getElementById("nav");

    function setProductView(view) {
      if (view === "scroll") {
        scrollContainer.style.display = "flex";
        gridContainer.style.display = "none";
        if (navDots) navDots.style.display = "flex";
        if (btnScroll) {
          btnScroll.classList.add("bg-brand-olive", "text-white");
          btnScroll.classList.remove("text-brand-textLight", "hover:text-brand-textDark");
        }
        if (btnGrid) {
          btnGrid.classList.remove("bg-brand-olive", "text-white");
          btnGrid.classList.add("text-brand-textLight", "hover:text-brand-textDark");
        }
        if (header) {
          header.classList.remove("relative", "bg-brand-bg");
          header.classList.add("fixed", "top-0", "left-0", "bg-transparent");
        }
      } else {
        scrollContainer.style.display = "none";
        gridContainer.style.display = "block";
        if (navDots) navDots.style.display = "none";
        if (btnGrid) {
          btnGrid.classList.add("bg-brand-olive", "text-white");
          btnGrid.classList.remove("text-brand-textLight", "hover:text-brand-textDark");
        }
        if (btnScroll) {
          btnScroll.classList.remove("bg-brand-olive", "text-white");
          btnScroll.classList.add("text-brand-textLight", "hover:text-brand-textDark");
        }
        if (header) {
          header.classList.add("relative", "bg-brand-bg");
          header.classList.remove("fixed", "top-0", "left-0", "bg-transparent");
        }
      }
    }
    // Exposed globally so the view-toggle buttons' inline onclick can call it.
    window.setProductView = setProductView;

    var sections = scrollContainer.querySelectorAll(".st-scroll-section");
    var dots = navDots ? navDots.querySelectorAll(".st-nav-dot") : [];

    if ("IntersectionObserver" in window) {
      var scrollObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              var index = entry.target.id.split("-")[1];
              dots.forEach(function (dot) { dot.classList.remove("active"); });
              if (dots[index]) dots[index].classList.add("active");
            }
          });
        },
        { root: scrollContainer, rootMargin: "0px", threshold: 0.5 }
      );
      sections.forEach(function (section) { scrollObserver.observe(section); });
    } else {
      sections.forEach(function (section) { section.classList.add("is-visible"); });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var targetIndex = dot.getAttribute("data-target");
        var targetSection = document.getElementById("section-" + targetIndex);
        if (targetSection) targetSection.scrollIntoView({ behavior: "smooth", inline: "start" });
      });
    });

    // Translate vertical mouse-wheel input into horizontal scroll, so a
    // regular scroll wheel/trackpad advances through the panels without
    // requiring a horizontal-scroll gesture.
    scrollContainer.addEventListener(
      "wheel",
      function (evt) {
        if (evt.deltaY !== 0) {
          evt.preventDefault();
          scrollContainer.scrollLeft += evt.deltaY;
        }
      },
      { passive: false }
    );

    setProductView("scroll");
  }
})();
