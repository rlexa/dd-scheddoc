export function downloadBlob(blob: Blob, fileName: string) {
  const elem = document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = fileName || 'blob.data';
  document.body.appendChild(elem);
  elem.click();
  window.URL.revokeObjectURL(elem.href);
  document.body.removeChild(elem);
}
