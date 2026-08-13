// =========================================================
// GLOBAL COMPONENT LOADER AND SITE FUNCTIONALITY
// =========================================================

console.log("main.js loaded");

// Global DOM state references
const root = document.documentElement;

// 1. Theme Toggles Setup
const setupThemeToggles = () => {
  console.log("setupThemeToggles running");
  document.querySelectorAll(".theme-toggle").forEach(btn => {
    if (btn.dataset.themed === "true") return;
    btn.dataset.themed = "true";
    console.log("Binding theme toggle click");
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

// 2. Mobile Hamburger Menu Setup
const setupHamburger = () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    if (hamburger.dataset.hamburgerBound === "true") return;
    hamburger.dataset.hamburgerBound = "true";
    console.log("Binding hamburger click");

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("show");
      document.body.style.overflow = navLinks.classList.contains("show") ? "hidden" : "";
    });

    navLinks.querySelectorAll("[data-close]").forEach(link => {
      if (link.dataset.hamburgerBound === "true") return;
      link.dataset.hamburgerBound = "true";
      console.log("Binding hamburger-close click to link:", link.textContent.trim());
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("show");
        document.body.style.overflow = "";
      });
    });
  }
};

// 3. Dynamic Form Overlay Controls
const setupContactOverlay = () => {
  // Overlay Openers and Closers
  const openButtons = document.querySelectorAll(".js-open-contact");
  console.log(`setupContactOverlay: found ${openButtons.length} open buttons`);
  openButtons.forEach(btn => {
    if (btn.dataset.contactBound === "true") return;
    btn.dataset.contactBound = "true";
    console.log("Binding open-contact click to button", btn.textContent.trim());
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const contactOverlay = document.getElementById("contact-overlay");
      if (contactOverlay) {
        contactOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
        console.log("Contact overlay shown");
      } else {
        console.warn("Contact overlay element not found!");
      }
    });
  });

  document.querySelectorAll(".js-close-contact").forEach(btn => {
    if (btn.dataset.contactBound === "true") return;
    btn.dataset.contactBound = "true";
    console.log("Binding close-contact click");
    btn.addEventListener("click", () => {
      const contactOverlay = document.getElementById("contact-overlay");
      if (contactOverlay) {
        contactOverlay.classList.remove("show");
        document.body.style.overflow = "";
        console.log("Contact overlay closed");
      }
    });
  });
};

// 4. Lightbox Setup
const initializeLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxContent) return;
  if (lightbox.dataset.lightboxBound === "true") return;
  lightbox.dataset.lightboxBound = "true";
  console.log("Initializing lightbox listeners");

  // Bind item click dynamically or on existing items
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

// Scroll reveal (Intersection Observer)
const setupScrollReveal = () => {
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
};

// Initialize listeners based on dynamic components loading or DOMContentLoaded
const initializeAll = () => {
  console.log("initializeAll triggered");
  setupThemeToggles();
  setupHamburger();
  setupContactOverlay();
  initializeLightbox();
};

// Global Keydown Handler (Registered exactly ONCE)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const overlay = document.getElementById("contact-overlay");
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

// Global Scroll Handler (Registered exactly ONCE)
const onScroll = () => {
  const header = document.querySelector("header, .nav-pill");
  if (!header) return;
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Link Prefetching for Performance (Registered exactly ONCE)
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

// Work library search/filter (registered once, handles elements if they exist)
const setupSearchFilter = () => {
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
};

// Listen to custom event for dynamic components loading at top-level
window.addEventListener('component-loaded', (e) => {
  console.log(`component-loaded event: ${e.detail?.type}`);
  initializeAll();
});

// Run when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event");
  initializeAll();
  setupScrollReveal();
  setupSearchFilter();
});
