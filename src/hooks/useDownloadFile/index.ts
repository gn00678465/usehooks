import { useState, useEffect, useCallback } from 'react';
import { forceDownload } from '../../utils';

export interface UseDownloadFileProps<T = Blob> {
  fileName: string;
  format: Mime.HintedString<Mime.MimeType>;
  data: string | T;
  onCreateBlob?: (
    data: string | T,
    format: Mime.HintedString<Mime.MimeType>
  ) => Blob;
}

export function useDownloadFile<T = Blob>({
  fileName,
  format,
  data,
  onCreateBlob
}: UseDownloadFileProps<T>) {
  const [blobUrl, setBlobUrl] = useState<string>();

  useEffect(() => {
    const isBlob = data instanceof Blob;

    setBlobUrl(
      URL.createObjectURL(
        isBlob
          ? data
          : onCreateBlob
          ? onCreateBlob(data, format)
          : new Blob([data as string], { type: format })
      )
    );
  }, [format, data, onCreateBlob]);

  const downloadFile = useCallback(forceDownload, [fileName, blobUrl]);

  const linkProps = {
    download: fileName,
    href: blobUrl
  };

  return {
    downloadFile,
    linkProps
  };
}

export type UseDownloadFileReturns = ReturnType<typeof useDownloadFile>;
