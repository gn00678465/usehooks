import { DependencyList } from 'react';

export function depsAsSame(oldDeps: DependencyList, deps: DependencyList) {
  if (oldDeps === deps) return true;
  for (const i in oldDeps) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}
