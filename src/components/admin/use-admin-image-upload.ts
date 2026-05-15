import { $, useSignal } from "@builder.io/qwik";
import imageCompression from "browser-image-compression";

export interface ImageCompressConfig {
  fieldName: string;
  maxWidthOrHeight: number;
  outputFileName: string;
}

export const compressFormImages = $(async (formData: FormData, configs: ImageCompressConfig[]) => {
  for (const config of configs) {
    const file = formData.get(config.fieldName) as File | null;
    if (!file?.size || !file.name) continue;

    const compressedBlob = await imageCompression(file, {
      maxWidthOrHeight: config.maxWidthOrHeight,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.8,
    });

    formData.set(
      config.fieldName,
      new File([compressedBlob], config.outputFileName, { type: "image/webp" }),
    );
  }
});

export function useAdminImageUpload(initialStoredUrl = "") {
  const storedUrl = useSignal(initialStoredUrl);
  const previewUrl = useSignal<string | null>(null);
  const isCompressing = useSignal(false);

  const onFileChange = $((event: Event) => {
    const element = event.target as HTMLInputElement;
    if (!element.files?.length) return;
    previewUrl.value = URL.createObjectURL(element.files[0]);
    storedUrl.value = "";
  });

  return { storedUrl, previewUrl, isCompressing, onFileChange };
}
