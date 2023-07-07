export function toBase64(source: string): string {
  const bytes = new TextEncoder().encode(source);
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
  return window.btoa(binString);
}
