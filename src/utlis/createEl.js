export function createEl(tag, attributes = {}, text) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "class") {
      el.className = value;
    } else if (key === "dataset") {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        el.dataset[dataKey] = dataValue;
      }
    } else if (key in el) {
      el[key] = value;
    } else {
      el.setAttribute(key, value);
    }
  }

  if (text !== undefined) el.textContent = text;
  return el;
}
