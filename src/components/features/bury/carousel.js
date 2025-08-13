//carousel for bury, maybe we can make this dynmaic aswell?

export function setupTombstoneCarousel() {
  const carousel = document.getElementById("tombstoneCarousel");
  const leftBtn = document.getElementById("carouselLeftBtn");
  const rightBtn = document.getElementById("carouselRightBtn");

  // Scroll amount per click
  const scrollAmount = 180;

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  // Highlight selected icon
  carousel.addEventListener("change", (e) => {
    if (e.target.name === "tombstoneId") {
      Array.from(carousel.children).forEach((child) =>
        child.classList.remove("selected"),
      );
      const selected = e.target.closest(".tombstone-option");
      if (selected) selected.classList.add("selected");
    }
  });

  // On page load, highlight the pre-selected icon if any
  setTimeout(() => {
    const checked = carousel.querySelector('input[type="radio"]:checked');
    if (checked) {
      const selected = checked.closest(".tombstone-option");
      if (selected) selected.classList.add("selected");
    }
  }, 100);
}
