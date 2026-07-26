// =========================================================
// GLOBAL COMPONENT LOADER AND SITE FUNCTIONALITY
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const initializeCommonListeners = () => {
    // Theme toggle (light / dark)
    const root = document.documentElement;

    const setupThemeToggles = () => {
      document.querySelectorAll(".theme-toggle").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
      });

      document.querySelectorAll(".theme-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
          const isDark = root.getAttribute("data-theme") === "dark";
          if (isDark) {
            root.removeAttribute("data-theme");
            localStorage.setItem("adranin-theme", "light");
          } else {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("adranin-theme", "dark");
          }
        });
      });
    };

    setupThemeToggles();

    // Sticky header shrink on scroll
    const header = document.querySelector("header, .nav-pill");
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile hamburger menu
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("show");
        document.body.style.overflow = navLinks.classList.contains("show") ? "hidden" : "";
      });

      navLinks.querySelectorAll("[data-close]").forEach(link => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          navLinks.classList.remove("show");
          document.body.style.overflow = "";
        });
      });
    }

    // Contact form drop-down menu toggle and choice select
    const ddTrigger = document.getElementById("ddTrigger");
    const dd = document.getElementById("dd");
    const ddMenu = document.getElementById("ddMenu");
    const serviceInputVal = document.getElementById("serviceInputVal");
    const ddLabel = document.getElementById("ddLabel");

    if (ddTrigger && dd && ddMenu) {
      ddTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        dd.classList.toggle("active");
      });

      ddMenu.querySelectorAll(".opt").forEach(opt => {
        opt.addEventListener("click", () => {
          const val = opt.getAttribute("data-value");
          if (serviceInputVal) serviceInputVal.value = val;
          if (ddLabel) ddLabel.textContent = opt.textContent;
          dd.classList.remove("active");
        });
      });

      document.addEventListener("click", () => {
        dd.classList.remove("active");
      });
    }

    // Overlay display controls
    const overlay = document.getElementById("contact-overlay");
    if (overlay) {
      document.querySelectorAll(".js-open-contact").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          overlay.classList.add("show");
          document.body.style.overflow = "hidden";
        });
      });

      document.querySelectorAll(".js-close-contact").forEach(btn => {
        btn.addEventListener("click", () => {
          overlay.classList.remove("show");
          document.body.style.overflow = "";
        });
      });
    }

    // Keyboard handlers (Close on Escape)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (overlay) overlay.classList.remove("show");
        const lightbox = document.getElementById("lightbox");
        if (lightbox) {
          lightbox.classList.remove("show");
          const content = document.getElementById("lightbox-content");
          if (content) content.innerHTML = "";
        }
        document.body.style.overflow = "";
      }
    });
  };

  // Listen to custom event for header / footer / contact loading
  let loadedCount = 0;
  window.addEventListener('component-loaded', () => {
    loadedCount++;
    initializeCommonListeners();
  });

  initializeCommonListeners();

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));

  // Link Prefetching for Webflow Performance
  const prefetchCache = new Set();
  const prefetchLink = (url) => {
    if (!url || prefetchCache.has(url) || url.startsWith('#') || url.includes('mailto:') || url.startsWith('http')) return;
    prefetchCache.add(url);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a');
    if (a && a.href) {
      prefetchLink(a.getAttribute('href'));
    }
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    const a = e.target.closest('a');
    if (a && a.href) {
      prefetchLink(a.getAttribute('href'));
    }
  }, { passive: true });

  // Lightbox
  const initializeLightbox = () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxContent = document.getElementById("lightbox-content");
    const lightboxClose = document.getElementById("lightbox-close");

    if (!lightbox || !lightboxContent) return;

    document.addEventListener("click", (e) => {
      const item = e.target.closest(".lib-item, .work-card, .feed-item");
      if (!item) return;

      const media = item.querySelector("img, video");
      if (!media) return;

      lightboxContent.innerHTML = "";
      const clone = media.cloneNode(true);
      if (clone.tagName === "VIDEO") {
        clone.setAttribute("controls", "");
        clone.removeAttribute("autoplay");
      }
      lightboxContent.appendChild(clone);
      lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    });

    lightboxClose?.addEventListener("click", () => {
      lightbox.classList.remove("show");
      lightboxContent.innerHTML = "";
      document.body.style.overflow = "";
    });

    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("show");
        lightboxContent.innerHTML = "";
        document.body.style.overflow = "";
      }
    });
  };

  initializeLightbox();

  // Work library search/filter
  const searchInput = document.getElementById("workSearch");
  const filterBtns = document.querySelectorAll(".filter");
  const items = document.querySelectorAll("#fullWorkGrid .lib-item, #fullWorkGrid .cs-card, #fullWorkGrid .feed-item");
  let activeFilter = "all";

  function applyFilters() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    items.forEach(item => {
      const tags = item.getAttribute("data-tags") || "";
      const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
      const matchesQuery = query === "" || tags.includes(query);
      item.classList.toggle("hidden", !(matchesFilter && matchesQuery));
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
});