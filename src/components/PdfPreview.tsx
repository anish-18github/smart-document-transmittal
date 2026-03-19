import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface PdfPreviewProps {
  file: File;
  className?: string;
  /** Multiplier for render resolution; final scale is also clamped to container width. Default 1.5 */
  scale?: number;
}

/**
 * Renders every page of a PDF onto canvases (no iframe / external viewer).
 * Suitable for print: each page wrapper uses print page-break-after.
 */
export function PdfPreview({ file, className = "", scale: baseScale = 1.5 }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const urlRef = useRef<string | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const loadingTaskRef = useRef<ReturnType<typeof getDocument> | null>(null);
  const renderGenerationRef = useRef(0);

  // Observe container width for responsive scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setContainerWidth(el.clientWidth);

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load PDF from object URL; cleanup on file change / unmount
  useEffect(() => {
    setError(null);
    setLoading(true);
    setNumPages(0);
    canvasRefs.current = [];
    renderGenerationRef.current += 1;

    const url = URL.createObjectURL(file);
    urlRef.current = url;

    const loadingTask = getDocument({ url });
    loadingTaskRef.current = loadingTask;

    loadingTask.promise
      .then((pdf) => {
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load PDF";
        setError(message);
        setLoading(false);
      });

    return () => {
      loadingTask.destroy();
      loadingTaskRef.current = null;
      pdfRef.current?.destroy();
      pdfRef.current = null;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]);

  // Render all pages to canvases after layout (refs attached)
  useLayoutEffect(() => {
    if (!numPages || !pdfRef.current || containerWidth <= 0) return;

    const pdf = pdfRef.current;
    const generation = ++renderGenerationRef.current;
    let cancelled = false;

    const renderPages = async () => {
      setLoading(true);
      try {
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          if (cancelled || generation !== renderGenerationRef.current) return;

          const page = await pdf.getPage(pageNum);
          const canvas = canvasRefs.current[pageNum - 1];
          if (!canvas) continue;

          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) continue;

          const unscaled = page.getViewport({ scale: 1 });
          const maxW = Math.max(containerWidth - 4, 100);
          const widthScale = maxW / unscaled.width;
          const scale = Math.min(baseScale, widthScale);

          const viewport = page.getViewport({ scale });

          // Clear previous bitmap
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: ctx,
            viewport,
          }).promise;
        }

        if (!cancelled && generation === renderGenerationRef.current) {
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled && generation === renderGenerationRef.current) {
          setError(e instanceof Error ? e.message : "Failed to render PDF");
          setLoading(false);
        }
      }
    };

    void renderPages();

    return () => {
      cancelled = true;
    };
  }, [numPages, file, containerWidth, baseScale]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {error && (
        <div className="rounded-sm border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {loading && !error && (
        <div className="text-xs text-muted-foreground py-4 text-center">Loading PDF…</div>
      )}

      {numPages > 0 && (
        <div className="flex flex-col gap-6 mt-2">
          {Array.from({ length: numPages }, (_, idx) => (
            <div
              key={`${file.name}-${file.lastModified}-${idx}`}
              className="pdf-preview-canvas-page flex justify-center border border-foreground/20 rounded-sm bg-white p-2"
            >
              <canvas
                ref={(el) => {
                  canvasRefs.current[idx] = el;
                }}
                className="max-w-full h-auto block"
                aria-label={`PDF page ${idx + 1} of ${numPages}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PdfPreview;
