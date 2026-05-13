import '@testing-library/jest-dom';

// Mock CSS modules
const handler = {
  get: function (target, name) {
    return name;
  },
};

// Mock matchMedia for antd components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserver;

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock getComputedStyle for antd
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (elt, pseudoElt) => {
  const style = originalGetComputedStyle(elt, pseudoElt);
  return {
    ...style,
    getPropertyValue: (prop) => {
      return style.getPropertyValue(prop);
    },
  };
};
