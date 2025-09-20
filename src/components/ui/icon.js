const SVG_NS = "http://www.w3.org/2000/svg";

const ICON_PATHS = Object.freeze({
  reply:
    "M11 20L1 12L11 4V9C16.5228 9 21 13.4772 21 19C21 19.2727 20.9891 19.5428 20.9676 19.81C20.5269 17.0003 18.0762 14.7816 15.0181 14.1449L14.5 14.0507L14 14.0017V14H11V20Z",
  edit: "M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z",
  delete:
    "M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z",
  upvote:
    "M2 8.99997H5V21H2C1.44772 21 1 20.5523 1 20V9.99997C1 9.44769 1.44772 8.99997 2 8.99997ZM7.29289 7.70708L13.6934 1.30661C13.8693 1.13066 14.1479 1.11087 14.3469 1.26016L15.1995 1.8996C15.6842 2.26312 15.9026 2.88253 15.7531 3.46966L14.5998 7.99997H21C22.1046 7.99997 23 8.8954 23 9.99997V12.1043C23 12.3656 22.9488 12.6243 22.8494 12.8658L19.755 20.3807C19.6007 20.7554 19.2355 21 18.8303 21H8C7.44772 21 7 20.5523 7 20V8.41419C7 8.14897 7.10536 7.89462 7.29289 7.70708Z",
  comment:
    "M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z",
});

/**
 * Create an SVG icon element
 * @param {string} name - Icon name from ICON_PATHS
 * @param {Object} options - Configuration options
 * @param {number} [options.size=16] - Icon size in pixels
 * @param {string} [options.className] - Additional CSS class
 * @param {string} [options.title] - Accessibility title
 * @returns {SVGElement|null}
 */
export function createIcon(name, options = {}) {
  const path = ICON_PATHS[name];
  if (!path) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const {
    size = 16,
    className = "",
    title = "",
    color = "currentColor",
  } = options;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("fill", color);
  svg.setAttribute("focusable", "false");
  svg.setAttribute("class", `ui-icon${className ? ` ${className}` : ""}`);

  if (title) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", title);
    const titleEl = document.createElementNS(SVG_NS, "title");
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  } else {
    svg.setAttribute("aria-hidden", "true");
  }

  const pathEl = document.createElementNS(SVG_NS, "path");
  pathEl.setAttribute("d", path);
  svg.appendChild(pathEl);

  return svg;
}