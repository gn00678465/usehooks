import { RefObject, useEffect, useState, useCallback, useRef } from 'react';

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

  const ref = useRef(0);
  const setRafState = useCallback(
    (value: ElementSize | ((prevSize: ElementSize) => ElementSize)) => {
      cancelAnimationFrame(ref.current);

      ref.current = requestAnimationFrame(() => {
        setSize(value);
      });
    },
    []
  );

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

          setRafState({
            width: parseFloat(styles.width),
            height: parseFloat(styles.height)
          });
        }
      } else {
        if (boxSize) {
          const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
          setRafState({
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
          setRafState({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    },
    [setRafState, box, target]
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
        cancelAnimationFrame(ref.current);
      }
    };
  }, [callbackFunction, target]);

  return size;
}
