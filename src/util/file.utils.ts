export namespace FileUtils {
  /** Replaces characters that are not allowed in file names. */
  export const toSafeFileName = (name: string, fallback = "download"): string => {
    // eslint-disable-next-line no-control-regex
    const cleaned = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim();
    return cleaned || fallback;
  };

  /** Saves a blob as a file through a temporary link. */
  export const saveBlob = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // let the browser start the download before releasing the URL
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
}
