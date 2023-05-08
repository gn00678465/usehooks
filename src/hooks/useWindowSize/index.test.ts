import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWindowSize, useWindowSizeOptions } from '.';

const setup = (options: useWindowSizeOptions) =>
  renderHook(({ options }) => useWindowSize(options), {
    initialProps: { options }
  });

describe('useWindowSize', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

  beforeEach(() => {
    addEventListenerSpy.mockReset();
  });

  afterAll(() => {
    addEventListenerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(useWindowSize).toBeDefined();
  });

  it('should work', () => {
    const { result } = setup({ initialWidth: 100, initialHeight: 200 });

    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it('should exclude scrollbar', () => {
    const { result } = setup({
      initialWidth: 100,
      initialHeight: 200,
      includeScrollbar: false
    });

    expect(result.current.width).toBe(
      window.document.documentElement.clientWidth
    );
    expect(result.current.height).toBe(
      window.document.documentElement.clientHeight
    );
  });

  it('sets handle for window "resize" event', async () => {
    setup({ initialWidth: 100, initialHeight: 200, includeScrollbar: false });

    expect(addEventListenerSpy).toHaveBeenCalledOnce();

    const call = addEventListenerSpy.mock.calls[0] as any;
    expect(call[0]).toEqual('resize');
    expect(call[2]).toEqual({ passive: true });
  });
});
