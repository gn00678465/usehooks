import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { useCreation } from './index';

class Foo {
  data: number;
  constructor() {
    this.data = Math.random();
  }
}

const setUp = () =>
  renderHook((): any => {
    const [count, setCount] = useState(0);
    const [, setFlag] = useState({});
    const foo = useCreation(() => new Foo(), [count]);

    return {
      setCount,
      setFlag,
      foo
    };
  });

describe('useCreation', () => {
  it('it should work', () => {
    const hook = setUp();
    const { foo } = hook.result.current;

    act(() => {
      hook.result.current.setFlag({});
    });
    expect(hook.result.current.foo).toBe(foo);

    act(() => {
      hook.result.current.setCount(1);
    });
    expect(hook.result.current.foo).not.toBe(foo);
  });
});
