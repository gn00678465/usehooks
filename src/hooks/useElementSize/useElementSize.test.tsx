import { describe, expect, it, vi } from 'vitest';
import { renderHook, render, screen } from '@testing-library/react';
import { useElementSize } from './index';
import { useRef } from 'react';

describe('useElementSize', () => {
  it('should work when target is a mounted DOM', () => {
    const hook = renderHook(() => useElementSize(document.body));
    expect(hook.result.current).toEqual({ width: 0, height: 0 });
  });

  it('should work when target is a `MutableRefObject`', async () => {
    const mockRaf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

    const Setup = () => {
      const ref = useRef(null);
      const size = useElementSize(ref);
      return (
        <>
          <div ref={ref}>
            <div>width: {String(size?.width)}</div>
            <div>height: {String(size?.height)}</div>
          </div>
        </>
      );
    };

    render(<Setup />);
    expect((await screen.findByText(/^width/)).textContent).toEqual('width: 0');
    expect((await screen.findByText(/^height/)).textContent).toEqual(
      'height: 0'
    );
    mockRaf.mockRestore();
  });

  it('should not work when target is null', () => {
    expect(() => {
      renderHook(() => useElementSize(null));
    }).not.toThrowError();
  });
});
