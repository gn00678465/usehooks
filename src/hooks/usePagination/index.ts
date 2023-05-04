import { useEffect, useCallback, useReducer } from 'react';
import { clamp } from '../../utils';

export interface UsePaginationOptions {
  total?: number;
  defaultPage?: number;
  defaultPageSize?: number;
}

export interface usePaginationState {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface usePaginationSetState {
  setPage: (arg: number) => void;
  setPageSize: (arg: number) => void;
  prev: () => void;
  next: () => void;
}

export type UsePaginationReturn = [usePaginationState, usePaginationSetState];

type usePaginationActions = {
  type: 'setPage' | 'setPageSize' | 'setPageCount';
  payload: number;
};

export function usePagination(opt: UsePaginationOptions): UsePaginationReturn;
export function usePagination(options: UsePaginationOptions) {
  const { total = Infinity, defaultPageSize = 10, defaultPage = 1 } = options;

  function calcPageCount(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize));
  }

  const initState: usePaginationState = {
    total,
    page: defaultPage,
    pageSize: defaultPageSize,
    pageCount: 0,
    isFirstPage: false,
    isLastPage: false
  };

  function init(initState: usePaginationState) {
    return {
      ...initState,
      pageSize: clamp(defaultPageSize, 1, Infinity),
      pageCount: calcPageCount(total, defaultPageSize),
      isFirstPage: defaultPage === 1,
      isLastPage: defaultPage === calcPageCount(total, defaultPageSize)
    };
  }

  function reducer(state: usePaginationState, action: usePaginationActions) {
    const actionMap = {
      setPage: () => {
        const pageCount = calcPageCount(total, state.pageSize);
        return {
          ...state,
          page: clamp(action.payload, 1, pageCount),
          isFirstPage: action.payload === 1,
          isLastPage: action.payload === pageCount
        };
      },
      setPageSize: () => {
        const pageCount = calcPageCount(total, action.payload);
        return {
          ...state,
          pageCount: pageCount,
          pageSize: action.payload,
          page: clamp(state.page, 1, pageCount)
        };
      },
      setPageCount: () => {
        const pageCount = calcPageCount(action.payload, state.pageSize);
        const page = clamp(state.page, 1, pageCount);
        return {
          ...state,
          page,
          pageCount: pageCount,
          isFirstPage: state.page === 1,
          isLastPage: page === pageCount
        };
      },
      default: () => state
    };

    const has = action.type in actionMap;

    if (has) return actionMap[action.type]();
    return actionMap.default();
  }

  const [state, dispatch] = useReducer(reducer, initState, init);

  useEffect(() => {
    dispatch({ type: 'setPageCount', payload: total });
  }, [total]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'setPage', payload: page });
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    dispatch({ type: 'setPageSize', payload: pageSize });
  }, []);

  const prev = useCallback(() => {
    const newPage = state.page - 1 < 1 ? 1 : state.page - 1;
    dispatch({ type: 'setPage', payload: newPage });
  }, [state]);

  const next = useCallback(() => {
    const newPage =
      state.page + 1 > state.pageCount ? state.pageCount : state.page + 1;
    dispatch({ type: 'setPage', payload: newPage });
  }, [state.page, state.pageCount]);

  return [
    state,
    {
      setPage,
      setPageSize,
      prev,
      next
    }
  ];
}
