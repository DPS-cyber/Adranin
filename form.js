document.addEventListener("DOMContentLoaded", () => {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzKWDmuNvxtkx9IsMMRzkIIUZ3QcnnA6cSlpT2H0QhMvdxOT2-8oqFF1Ey9qREo-eoVJA/exec";

  // "RemadeBrand_Secure_2024" encoded to Base64 — unchanged from original
  const _k = atob("QWRkaXRCcmFuZF9TZWN1cmVfMjAyNA==");

  const form = document.getElementById("contactForm");
  const formResp = document.getElementById("form-resp");

  // ---------- Service dropdown ----------
  const dd = document.getElementById("dd");
  const ddTrigger = document.getElementById("ddTrigger");
  const ddMenu = document.getElementById("ddMenu");
  const ddLabel = document.getElementById("ddLabel");
  const serviceInput = document.getElementById("serviceInputVal");

  if (ddTrigger) {
    ddTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dd.classList.toggle("active");
    });
  }

  document.querySelectorAll(".dd-menu .opt").forEach(opt => {
    opt.addEventListener("click", () => {
      serviceInput.value = opt.getAttribute("data-value");
      ddLabel.textContent = opt.textContent;
      ddLabel.style.color = "var(--ink)";
      dd.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (dd && !dd.contains(e.target)) dd.classList.remove("active");
  });

  // ---------- Submission ----------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = form.querySelector("button");
      const originalLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Processing…";

      const formData = new FormData(form);
      formData.append("access_key", _k);

      try {
        await fetch(scriptURL, {
          method: "POST",
          mode: "no-cors",
          body: formData
        });

        formResp.textContent = "Success! We'll be in touch.";
        formResp.style.color = "#2f9e44";
        form.reset();
        if (ddLabel) ddLabel.textContent = "Select service";

        setTimeout(() => {
          document.getElementById("contact-overlay")?.classList.remove("show");
          document.body.style.overflow = "";
          formResp.textContent = "";
        }, 2500);

      } catch (error) {
        formResp.textContent = "Network error. Please try again.";
        formResp.style.color = "#e03131";
      } finally {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    });
  }
});
