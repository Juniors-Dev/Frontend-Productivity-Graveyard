export function createFooter() {
  const footer = document.querySelector("footer");
  footer.classList.add("footer-container");

  //Left text
  const leftText = document.createElement("p");
  leftText.className = "footer-left";
  leftText.textContent = "Junior.Dev";

  //Middle text
  const middleLink = document.createElement("p");
  middleLink.className = "footer-middle";
  middleLink.innerHTML = `<a href="/termsofservice.html" class="footer-link">Terms of Service</a>`;

  //Right text
  const rightText = document.createElement("p");
  rightText.className = "footer-right";
  rightText.textContent = "© Copyright 2025";

  //Append elements to footer
  footer.appendChild(leftText);
  footer.appendChild(middleLink);
  footer.appendChild(rightText);

  return footer;
}
