import { getPagination } from "../../../utlis/getPagination.js";

export function pagination({ current, total, container, onPageChange }) {
  container.innerHTML = "";

  // Prev
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "« Prev";
  prevBtn.classList.add("page-btn");
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener("click", () => {
    if (current > 1) {
      onPageChange(current - 1);
    }
  });
  container.appendChild(prevBtn);

  // Pages
  const pages = getPagination(current, total);
  for (let p of pages) {
    if (p === "...") {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("page-ellipsis");
      container.appendChild(dots);
    } else {
      const btn = document.createElement("button");
      btn.textContent = p;
      btn.classList.add("page-btn");
      if (p === current) btn.classList.add("active");
      btn.addEventListener("click", () => {
        if (p !== current) {
          onPageChange(p); // let caller manage currentPage
        }
      });
      container.appendChild(btn);
    }
  }

  // Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next »";
  nextBtn.classList.add("page-btn");
  nextBtn.disabled = current === total;
  nextBtn.addEventListener("click", () => {
    if (current < total) {
      onPageChange(current + 1);
    }
  });
  container.appendChild(nextBtn);
}
