(() => {
  "use strict";
  const rail = document.querySelector(".home-product-rail");
  const previous = document.querySelector("[data-product-prev]");
  const next = document.querySelector("[data-product-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (rail && previous && next) {
    const update = () => {
      const overflows = rail.scrollWidth > rail.clientWidth + 2;
      previous.hidden = next.hidden = !overflows;
      previous.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    };
    const move = direction => rail.scrollBy({ left: direction * rail.clientWidth * .82, behavior: reducedMotion.matches ? "instant" : "smooth" });
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
})();
