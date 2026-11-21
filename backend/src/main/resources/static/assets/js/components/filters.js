const filter = document.querySelector(".Filter");
const filterOpener = document.querySelector(".Filter-opener");
const filterBackdrop = document.querySelector(".Filter-backdrop");

const categoryButtons = document.querySelectorAll(".Categories-button");
const filterButtons = document.querySelectorAll(".Filter-list-item");

if (filter && filterOpener && filterBackdrop) {
  filterOpener.addEventListener("click", () => {
    filter.classList.toggle("open");
  });

  filterBackdrop.addEventListener("click", () => {
    filter.classList.remove("open");
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (filter) filter.classList.remove("open");
  });
});