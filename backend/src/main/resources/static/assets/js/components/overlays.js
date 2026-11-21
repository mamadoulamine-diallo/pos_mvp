document.querySelectorAll(".Overlay").forEach((overlay) => {
  const backdrop = overlay.querySelector(".Overlay-backdrop");
  const close = overlay.querySelector(".Overlay-close");

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      overlay.classList.remove("open");
    });
  }

  if (close) {
    close.addEventListener("click", () => {
      overlay.classList.remove("open");
    });
  }
});