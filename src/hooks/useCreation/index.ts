import { useRef, DependencyList } from 'react';
import { depsAsSame } from '../../utils';

export function useCreation<T>(factory: () => T, deps: DependencyList) {
  const { current } = useRef({
    initialized: false,
    data: undefined as T | undefined,
    deps
  });

  if (!current.initialized || !depsAsSame(current.deps, deps)) {
    current.deps = deps;
    current.data = factory();
    current.initialized = true;
  }

  return current.data as T;
}
