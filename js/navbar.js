(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".navigation-panel");

  if (header) {
    const updateScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
  }

  if (!toggle || !panel) return;

  const setOpen = (open, restoreFocus = false) => {
    toggle.classList.toggle("is-open", open);
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );

    if (restoreFocus) toggle.focus();
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      setOpen(false, true);
    }
  });

  document.addEventListener("focusin", (event) => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  window
    .matchMedia("(min-width: 901px)")
    .addEventListener("change", () => setOpen(false));
})();
