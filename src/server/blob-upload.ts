import { put } from "@vercel/blob";

export async function uploadImageToBlob(
  file: File,
  fileName: string,
  token: string | undefined,
): Promise<string> {
  const { url } = await put(fileName, file, {
    access: "public",
    token,
  });
  return url;
}
