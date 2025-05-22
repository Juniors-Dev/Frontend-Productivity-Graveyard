const HEADER_CONFIG = {
  BREAKPOINT: 815,
  MOON_SIZE: 300,
  NAV_LINKS: [
    { text: "HOME", href: "index.html" },
    { text: "GRAVYARD", href: "gravyard.html" },
    { text: "BURY", href: "bury.html" },
    { text: "PROFILE", href: "profile.html" },
    { text: "LOGIN", href: "login.html" },
    // { text: 'LOGOUT', href: 'index.html' } when logged in the login becomes logout
  ],
};

class Header {
  constructor() {
    this.header = document.querySelector("header");
    if (!this.header) {
      throw new Error("Header element not found");
    }

    this.menuButton = null;
    this.mobileMenu = null;
    this.navLinksList = null;
    this.resizeHandler = this.handleResize.bind(this);
    this.clickHandler = this.handleOutsideClick.bind(this);
  }

  createNavigationLink(link) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.text;

    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === link.href) {
      a.classList.add("active");
    }

    li.appendChild(a);
    return li;
  }

  createMoon() {
    if (!document.querySelector(".moon")) {
      const moon = document.createElement("div");
      moon.className = "moon";
      document.body.appendChild(moon);
    }
  }

  createMobileMenu() {
    this.mobileMenu = document.createElement("ul");
    this.mobileMenu.className = "mobile-menu";
    this.mobileMenu.style.display = "none";
    this.mobileMenu.setAttribute("aria-hidden", "true");

    HEADER_CONFIG.NAV_LINKS.forEach((link) => {
      this.mobileMenu.appendChild(this.createNavigationLink(link));
    });
  }

  createMenuButton() {
    this.menuButton = document.createElement("button");
    this.menuButton.className = "menu-toggle";
    this.menuButton.setAttribute("aria-label", "Open menu");
    this.menuButton.setAttribute("aria-expanded", "false");
    this.menuButton.innerHTML = "&#9776;";

    this.menuButton.addEventListener("click", () => this.toggleMenu());
  }

  toggleMenu() {
    const isOpen = this.mobileMenu.style.display === "flex";
    this.mobileMenu.style.display = isOpen ? "none" : "flex";
    this.menuButton.innerHTML = isOpen ? "&#9776;" : "☠";
    this.menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open menu" : "Close menu",
    );
    this.menuButton.setAttribute("aria-expanded", !isOpen);
    this.mobileMenu.setAttribute("aria-hidden", isOpen);
  }

  handleResize() {
    const isMobile = window.innerWidth < HEADER_CONFIG.BREAKPOINT;
    this.menuButton.style.display = isMobile ? "block" : "none";
    this.mobileMenu.style.display = "none";
    this.navLinksList.style.display = isMobile ? "none" : "flex";
    this.menuButton.innerHTML = "&#9776;";
    this.menuButton.setAttribute("aria-expanded", "false");
    this.mobileMenu.setAttribute("aria-hidden", "true");
  }

  handleOutsideClick(event) {
    const isMenuOpen = this.mobileMenu.style.display === "flex";
    if (
      isMenuOpen &&
      !this.mobileMenu.contains(event.target) &&
      !this.menuButton.contains(event.target)
    ) {
      this.toggleMenu();
    }
  }

  init() {
    this.createMoon();

    const nav = document.createElement("nav");
    nav.className = "nav-container";

    this.navLinksList = document.createElement("ul");
    this.navLinksList.className = "nav-links";

    HEADER_CONFIG.NAV_LINKS.forEach((link) => {
      this.navLinksList.appendChild(this.createNavigationLink(link));
    });

    nav.appendChild(this.navLinksList);
    this.createMenuButton();
    this.createMobileMenu();
    nav.appendChild(this.menuButton);
    nav.appendChild(this.mobileMenu);
    this.header.appendChild(nav);

    window.addEventListener("resize", this.resizeHandler);
    document.addEventListener("click", this.clickHandler);
    this.handleResize();
  }

  destroy() {
    window.removeEventListener("resize", this.resizeHandler);
    document.removeEventListener("click", this.clickHandler);
  }
}

// Initialize header when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const header = new Header();
  header.init();
});
