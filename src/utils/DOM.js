export function createElement(tag, props = {}) {
  const el = document.createElement(tag);
  Object.assign(el, props);
  return el;
}
