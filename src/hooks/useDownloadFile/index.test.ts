import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDownloadFile } from '.';

const blobUrl = 'blob:http://example.com/550e8400-e29b-41d4-a716-446655440000';
global.URL.createObjectURL = vi.fn(() => blobUrl);
global.URL.revokeObjectURL = vi.fn(() => undefined);

// from github: https://github.com/s1r-J/str2ab/blob/main/src/str2ab.ts
function string2arraybuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
}

describe('useDownloadFile', () => {
  it('linkProps', () => {
    const { result } = renderHook(() =>
      useDownloadFile({
        fileName: 'test.svg',
        format: 'image/svg+xml',
        data: ''
      })
    );
    expect(result.current.linkProps).toEqual({
      download: 'test.svg',
      href: blobUrl
    });
  });

  it('downloadFile', () => {
    const createElement = vi.spyOn(document, 'createElement');
    const removeElement = vi.spyOn(Element.prototype, 'remove');

    const { result } = renderHook(() =>
      useDownloadFile({
        fileName: 'test.svg',
        format: 'image/svg+xml',
        data: ''
      })
    );

    act(() => {
      result.current.downloadFile();
    });

    expect(createElement).toBeCalledWith('a');
    expect(removeElement).toBeCalledTimes(1);
    expect(document.querySelector('a')).toBeFalsy();
  });

  it('onCreateBlob', () => {
    const buffer = string2arraybuffer('Content for ArrayBuffer');
    const onCreateBlob = vi.fn((_, format) => {
      return new Blob([buffer], { type: format });
    });

    const { result } = renderHook(() =>
      useDownloadFile({
        fileName: 'test.svg',
        format: 'image/svg+xml',
        data: null,
        onCreateBlob
      })
    );

    act(() => {
      result.current.downloadFile();
    });

    expect(onCreateBlob).toBeCalled();
  });
});
