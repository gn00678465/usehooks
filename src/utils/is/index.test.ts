import { clamp } from '.';
import { describe, test, expect } from 'vitest';

describe('is', () => {
  test('clamp', () => {
    expect(clamp(10, 1, Infinity)).toBe(10);
    expect(clamp(10, 1, 40)).toBe(10);
    expect(clamp(20, 1, 20)).toBe(20);
  });
});
