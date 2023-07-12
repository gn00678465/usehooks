export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
