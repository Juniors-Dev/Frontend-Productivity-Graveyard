function createHeader() {
  const header = document.querySelector("header");
  const h1 = document.createElement("h1");
  h1.textContent = "Hey";
  header.appendChild(h1);
  return header;
}

// Example usage:
document.body.prepend(createHeader());

// Header component
