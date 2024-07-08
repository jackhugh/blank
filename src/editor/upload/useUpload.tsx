import { useCallback, useEffect, useRef } from "react";

interface UseUploadParams {
  singleFileCallback?: (imageURL: string) => void;
  multipleFileCallback?: (imageURLs: string[]) => void;
}

export const useUpload = ({
  singleFileCallback,
  multipleFileCallback,
}: UseUploadParams) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = useCallback(
    (e: Event) => {
      const target = e.target as HTMLInputElement;

      const imageFiles = target.files;

      if (!imageFiles?.length) {
        return;
      }

      const urls = [...imageFiles].map((image) => URL.createObjectURL(image));

      if (singleFileCallback) {
        singleFileCallback(urls.at(0)!);
      }

      if (multipleFileCallback) {
        multipleFileCallback(urls);
      }
    },
    [singleFileCallback, multipleFileCallback]
  );

  useEffect(() => {
    inputRef.current = document.createElement("input");
    inputRef.current.style.display = "none";
    inputRef.current.type = "file";
    inputRef.current.accept = "image/*";

    if (multipleFileCallback) {
      inputRef.current.multiple = true;
    }

    inputRef.current.onchange = handleUpload;
  }, [handleUpload, multipleFileCallback]);

  const openUploadDialog = () => {
    inputRef.current?.click();
  };

  return openUploadDialog;
};
