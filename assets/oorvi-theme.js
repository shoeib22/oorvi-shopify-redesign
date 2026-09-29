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

  // -- Product image gallery ----------------------------------------------
  // Only present on sections/main-product.liquid; a no-op elsewhere.
  var galleryImage = document.getElementById("product-gallery-image");
  var galleryThumbs = document.getElementById("product-gallery-thumbs");

  if (galleryImage && galleryThumbs) {
    galleryThumbs.querySelectorAll(".product-gallery-thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var fullSrc = thumb.getAttribute("data-full-src");
        var alt = thumb.getAttribute("data-alt");
        if (fullSrc) galleryImage.setAttribute("src", fullSrc);
        if (alt) galleryImage.setAttribute("alt", alt);

        galleryThumbs.querySelectorAll(".product-gallery-thumb").forEach(function (t) {
          t.classList.remove("border-brand-olive");
          t.classList.add("border-transparent");
        });
        thumb.classList.remove("border-transparent");
        thumb.classList.add("border-brand-olive");
      });
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
    var currentIndex = 0;

    if ("IntersectionObserver" in window) {
      var scrollObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              var index = entry.target.id.split("-")[1];
              currentIndex = parseInt(index, 10) || 0;
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

    function goToSection(index) {
      if (index < 0 || index >= sections.length) return;
      var target = document.getElementById("section-" + index);
      if (target) target.scrollIntoView({ behavior: "smooth", inline: "start" });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goToSection(parseInt(dot.getAttribute("data-target"), 10));
      });
    });

    // Translate vertical mouse-wheel/trackpad input into horizontal panel
    // navigation, so a regular scroll wheel advances through the panels
    // without needing a horizontal-scroll gesture.
    //
    // This container uses scroll-snap-type: x mandatory. Nudging scrollLeft
    // by the wheel event's small per-notch deltaY (commonly ~100-120px,
    // versus a full ~1920px panel) fights that mandatory snap: the browser
    // immediately snaps back to the current panel after every tiny nudge,
    // so the wheel visually does nothing. Instead, treat each wheel gesture
    // as "advance one panel" (like the nav dots already do), with a cooldown
    // so one continuous scroll gesture doesn't fire through multiple panels.
    var wheelCooldown = false;
    var wheelCooldownMs = 700;
    scrollContainer.addEventListener(
      "wheel",
      function (evt) {
        if (Math.abs(evt.deltaY) < 2) return;
        evt.preventDefault();
        if (wheelCooldown) return;
        wheelCooldown = true;
        goToSection(currentIndex + (evt.deltaY > 0 ? 1 : -1));
        setTimeout(function () { wheelCooldown = false; }, wheelCooldownMs);
      },
      { passive: false }
    );

    setProductView("scroll");
  }
})();
