declare namespace DomTarget {
  type TargetValue<T> = T | undefined | null;

  type TargetType = HTMLElement | Element | Window | Document;

  type BasicTarget<T extends TargetType = Element> =
    | TargetValue<T>
    | (() => TargetValue<T>)
    | import('react').MutableRefObject<TargetValue<T>>;
}
