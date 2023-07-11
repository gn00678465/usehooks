import { RefObject, useEffect, useState, useCallback } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

export interface useElementSizeOptions {
  /**
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;
}

export type UseElementSizeReturn = ElementSize;

export function useElementSize(
  target: RefObject<Element>,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: useElementSizeOptions = {}
): UseElementSizeReturn {
  const { box = 'content-box' } = options;

  const [size, setSize] = useState<ElementSize>(() => ({
    width: target.current ? initialSize.width : 0,
    height: target.current ? initialSize.height : 0
  }));

  const callbackFunction = useCallback<
    (arg: ReadonlyArray<ResizeObserverEntry>) => void
  >(
    ([entry]) => {
      const boxSize =
        box === 'border-box'
          ? entry.borderBoxSize
          : box === 'content-box'
          ? entry.contentBoxSize
          : entry.devicePixelContentBoxSize;
      if (window) {
        const $elm = target.current;
        if ($elm) {
          const styles = window.getComputedStyle($elm);

          setSize({
            width: parseFloat(styles.width),
            height: parseFloat(styles.height)
          });
        }
      } else {
        if (boxSize) {
          const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
          setSize({
            width: formatBoxSize.reduce(
              (acc, { inlineSize }) => acc + inlineSize,
              0
            ),
            height: formatBoxSize.reduce(
              (acc, { blockSize }) => acc + blockSize,
              0
            )
          });
        } else {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    },
    [box, target]
  );

  useEffect(() => {
    let observerRefValue: null | Element = null;

    const resizeObserver = new ResizeObserver(callbackFunction);

    if (target.current) {
      resizeObserver.observe(target.current);
      observerRefValue = target.current;
    }
    return () => {
      if (observerRefValue) {
        resizeObserver.unobserve(observerRefValue);
      }
    };
  }, [callbackFunction, target]);

  return size;
}
