export async function bytesToBase64DataUrl(
  bytes: string,
  type = 'application/octet-stream',
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result as string),
      onerror: () => reject(reader.error),
    });
    reader.readAsDataURL(new File([bytes], '', { type }));
  });
}

export function toBase64(source: string) {
  const bytes = new TextEncoder().encode(source);
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
  return btoa(binString);
}
