import "@testing-library/jest-dom";

// Polyfill IntersectionObserver for jsdom (used by framer-motion whileInView)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill ResizeObserver for jsdom (used by Remotion Player)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
