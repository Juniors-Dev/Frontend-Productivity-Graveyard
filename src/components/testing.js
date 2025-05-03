//husky test
// testing testing one, two
// testing again. yay

function createHeader() {
  const header = document.querySelector("header");
  const h1 = document.createElement("h1");
  h1.textContent = "Hi, is this working?";
  header.appendChild(h1);
  const h2 = document.createElement("h2");
  h2.textContent = "This test is going so well!";
  h1.appendChild(h2);
  return header;
}

// Example usage:
document.body.prepend(createHeader());
