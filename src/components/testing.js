//husky test
// testing testing one, two
// testing again. yay

function createHeader() {
   const      header = document.querySelector("header");
   const h1 = document.createElement("h1");
  h1.text Content = "Hellooooooooooooooooooo, is this working?";
            header.appendChild(h1);
  return header ;
}

// Example usage:
document.body.prepend(createHeader());
