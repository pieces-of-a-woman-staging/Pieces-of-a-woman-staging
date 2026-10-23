(() => {
  "use strict";
  const main = document.querySelector(".brand-backdrops");
  if (!main) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const buttons = main.querySelectorAll("[data-brand-motion]");
  let paused = reduced.matches;
  const update = () => {
    main.classList.toggle("brand-motion-enabled", !paused);
    buttons.forEach(button => {
      button.hidden = false;
      button.setAttribute("aria-pressed", String(paused));
      button.textContent = paused ? "Play background motion" : "Pause background motion";
    });
  };
  buttons.forEach(button => button.addEventListener("click", () => {
    paused = !paused;
    update();
  }));
  reduced.addEventListener("change", event => {
    paused = event.matches;
    update();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("brand-scene-visible", entry.isIntersecting));
    });
    main.querySelectorAll(".brand-puzzle-scene, .brand-cross-scene").forEach(scene => observer.observe(scene));
  } else {
    main.querySelectorAll(".brand-puzzle-scene, .brand-cross-scene").forEach(scene => scene.classList.add("brand-scene-visible"));
  }
  update();
})();
