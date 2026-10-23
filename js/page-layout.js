(() => {
  "use strict";
  const revealLinkedDetail = () => {
    if (!window.location.hash) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    const detail = target.closest("details");
    if (!detail) return;
    detail.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "auto" }));
  };
  window.addEventListener("hashchange", revealLinkedDetail);
  revealLinkedDetail();
})();
