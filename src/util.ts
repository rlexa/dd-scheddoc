export const jsonCopy = <T>(from: T): T => JSON.parse(JSON.stringify(from));

export const strPadStart = (padWith: string) => (max: number) => (val: string | null) => val?.padStart(max, padWith) ?? null;
export const strPadStartWithZero = strPadStart('0');
export const strPadStartWithZero2 = strPadStartWithZero(2);
export const strPadStartWithZero4 = strPadStartWithZero(4);

export function downloadBlob(blob: Blob, fileName: string) {
  const elem = document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = fileName || 'blob.data';
  document.body.appendChild(elem);
  elem.click();
  window.URL.revokeObjectURL(elem.href);
  document.body.removeChild(elem);
}
