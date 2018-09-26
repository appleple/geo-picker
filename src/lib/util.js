export const findAncestor = (el, query) => {
  if (typeof el.closest === 'function') {
    return el.closest(query) || null;
  }
  while (el) {
    if (matches(el, query)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
};
