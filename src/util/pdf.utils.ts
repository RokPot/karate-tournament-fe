import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";

import { logger } from "@/util/logger";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.mjs`;

export namespace PdfUtils {
  export const generatePdfThumbnail = async (pdfUrl: string): Promise<string> => {
    try {
      const loadingTask = getDocument({
        url: pdfUrl,
        cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/cmaps/`,
        cMapPacked: true,
      });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      return canvas.toDataURL("image/jpeg", 0.8);
    } catch (error) {
      logger.error("Error generating PDF thumbnail:", error);
      throw error;
    }
  };
}
