export type GeneratedImage = {
  id: string;
  imageUri: string;
  detailedPrompt: string;
  originalPrompt: string;
};

export const generateImage = async (prompt: string): Promise<[string?, GeneratedImage?]> => {
  const res = await fetch("/api/image/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return [await res.text(), undefined] as [string, undefined];

  const data = await res.json();

  return [undefined, data as GeneratedImage];
};

export const getImage = async (id: string) => {
  const res = await fetch(`/api/image/${id}`);
  const data = await res.json();

  return data as GeneratedImage;
};
