import { usePagination, UsePaginationOptions } from '.';
import { renderHook, act } from '@testing-library/react-hooks';
import { describe, test, expect, it } from 'vitest';

const setup = (options: UsePaginationOptions) =>
  renderHook(({ options }) => usePagination(options), {
    initialProps: { options }
  });

describe('usePagination', () => {
  test('should be defined', () => {
    expect(usePagination).toBeDefined();
  });

  describe('when page is 1', () => {
    it("returns the initial page number when prev() or next() haven't been called", () => {
      const { result } = setup({ defaultPage: 1, total: 40 });
      expect(result.current[0].page).toBe(1);
    });

    test('increments after calling next() when there are still pages left', () => {
      const { result } = setup({ defaultPage: 1, total: 40 });
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].page).toBe(2);
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].page).toBe(3);
    });

    test("doesn't decrement after calling prev() when still on the first page", () => {
      const { result } = setup({ defaultPage: 1, total: 40 });
      act(() => {
        result.current[1].prev();
      });
      expect(result.current[0].page).toBe(1);
    });

    test("doesn't increment past the last page", () => {
      const { result } = setup({ defaultPage: 1, total: 40 });
      act(() => {
        result.current[1].next();
      });
      act(() => {
        result.current[1].next();
      });
      act(() => {
        result.current[1].next();
      });
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].page).toBe(4);
    });
  });

  describe('when page is something other than 1', () => {
    test("returns the page number when prev() or next() haven't been called", () => {
      const { result } = setup({ defaultPage: 3, total: 40 });
      expect(result.current[0].page).toBe(3);
    });
  });

  describe('when total is 0', () => {
    test('returns a page of 1', () => {
      const { result } = setup({ defaultPage: 1, total: 0 });
      expect(result.current[0].page).toBe(1);
    });
  });

  describe('when the page is outside of the range of possible pages', () => {
    test('returns the maximum page number possible', () => {
      const { result } = setup({ defaultPage: 1, total: 40 });
      act(() => {
        result.current[1].setPage(1234);
      });
      expect(result.current[0].page).toBe(4);
    });

    test('clamps the lower end of the range to 1', () => {
      const { result } = setup({ defaultPage: 1, total: 40 });
      act(() => {
        result.current[1].setPage(1);
      });
      expect(result.current[0].page).toBe(1);
      act(() => {
        result.current[1].setPage(0);
      });
      expect(result.current[0].page).toBe(1);
      act(() => {
        result.current[1].setPage(-1234);
      });
      expect(result.current[0].page).toBe(1);
    });
  });

  describe('pageSize', () => {
    test('returns the given initial pageSize', () => {
      const { result } = setup({
        defaultPage: 1,
        total: 45,
        defaultPageSize: 14
      });
      expect(result.current[0].pageSize).toBe(14);
    });

    test('does not change pageSize when navigating through to the last page', () => {
      const { result } = setup({
        defaultPage: 1,
        total: 45,
        defaultPageSize: 14
      });

      act(() => {
        result.current[1].prev();
      });
      expect(result.current[0].pageSize).toBe(14);
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].pageSize).toBe(14);
    });

    test('when pageSize is not given, defaults to 10', () => {
      const { result } = setup({
        defaultPage: 1,
        total: 45
      });
      expect(result.current[0].pageSize).toBe(10);
    });

    test('更新 pageSize, pageCount 需一併更新', () => {
      const { result } = setup({
        defaultPage: 1,
        total: 45
      });
      act(() => {
        result.current[1].setPageSize(20);
      });
      expect(result.current[0].pageCount).toBe(3);
    });
  });

  describe('isFirstPage', () => {
    test('returns true when on the first page', () => {
      const { result } = setup({ defaultPageSize: 20, total: 35 });
      expect(result.current[0].isFirstPage).toBe(true);
      act(() => {
        result.current[1].prev();
      });
      expect(result.current[0].isFirstPage).toBe(true);
    });
    test('returns false when not the first page', () => {
      const { result } = setup({ defaultPageSize: 10, total: 35 });
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].isFirstPage).toBe(false);
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].isFirstPage).toBe(false);
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].isFirstPage).toBe(false);
    });
  });

  describe('isLastPage', () => {
    test('returns true when on the last page', () => {
      const { result } = setup({ defaultPageSize: 20, total: 35 });
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].isLastPage).toBe(true);
      act(() => {
        result.current[1].next();
      });
      expect(result.current[0].isLastPage).toBe(true);
    });
    test('returns false when not the last page', () => {
      const { result } = setup({ defaultPageSize: 20, total: 35 });
      expect(result.current[0].isLastPage).toBe(false);
      act(() => {
        result.current[1].prev();
      });
      expect(result.current[0].isLastPage).toBe(false);
    });
  });
});
