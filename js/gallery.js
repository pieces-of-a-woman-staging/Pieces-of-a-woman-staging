(() => {
  "use strict";

  const dialog = document.querySelector("[data-gallery-dialog]");
  const links = Array.from(document.querySelectorAll("[data-gallery-image]"));
  if (!dialog || !links.length || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("[data-gallery-full-image]");
  const caption = dialog.querySelector("[data-gallery-caption]");
  const close = dialog.querySelector("[data-gallery-close]");
  let index = 0;
  let trigger = null;

  function show(nextIndex) {
    index = (nextIndex + links.length) % links.length;
    const link = links[index];
    image.src = link.href;
    image.alt = link.dataset.galleryCaption;
    caption.textContent = link.dataset.galleryCaption;
  }

  links.forEach((link, linkIndex) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      show(linkIndex);
      dialog.showModal();
      close.focus();
    });
  });

  close.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-gallery-previous]").addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-gallery-next]").addEventListener("click", () => show(index + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(index + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    trigger?.focus();
  });
})();
