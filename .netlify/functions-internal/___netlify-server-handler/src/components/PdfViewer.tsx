'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Configure PDF.js worker via CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  title: string;
  watermarkText?: string | null;
}

export default function PdfViewer({ url, title, watermarkText }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pageWidth, setPageWidth] = useState(800);

  // Responsive width tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setPageWidth(el.clientWidth - 2); // -2 for border
    });
    observer.observe(el);
    setPageWidth(el.clientWidth - 2);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }, []);

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));

  // Prevent right-click context menu and drag
  const blockInteraction = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#CADCFC]">
      {/* Toolbar */}
      <div className="bg-[#1E2761]/5 border-b border-[#CADCFC] px-4 py-2.5 flex items-center justify-between gap-4 select-none">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            aria-label="Trang trước"
            className="p-1.5 rounded-lg hover:bg-[#1E2761]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#1E2761]" />
          </button>
          <span className="text-sm text-[#1E2761] font-medium tabular-nums min-w-[80px] text-center">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : '—'}
          </span>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            aria-label="Trang tiếp"
            className="p-1.5 rounded-lg hover:bg-[#1E2761]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#1E2761]" />
          </button>
        </div>

        {/* Title */}
        <span className="text-xs text-gray-400 truncate hidden sm:block flex-1 text-center">{title}</span>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            aria-label="Thu nhỏ"
            className="p-1.5 rounded-lg hover:bg-[#1E2761]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-[#1E2761]" />
          </button>
          <span className="text-xs text-gray-500 tabular-nums w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.5}
            aria-label="Phóng to"
            className="p-1.5 rounded-lg hover:bg-[#1E2761]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-[#1E2761]" />
          </button>
        </div>
      </div>

      {/* PDF canvas area */}
      <div
        ref={containerRef}
        className="overflow-auto bg-[#F5F7FA]"
        style={{ maxHeight: '82vh', minHeight: '600px' }}
        onContextMenu={blockInteraction}
        onDragStart={blockInteraction}
      >
        <div className="relative flex justify-center py-6 px-2">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-[600px]">
                <div className="w-8 h-8 border-2 border-[#1E2761] border-t-transparent rounded-full animate-spin" />
              </div>
            }
            error={
              <div className="flex items-center justify-center h-[600px] text-gray-400 text-sm">
                Không thể tải tài liệu. Vui lòng thử lại.
              </div>
            }
          >
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                width={Math.floor(pageWidth * scale)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              {/* Watermark overlay */}
              {watermarkText && (
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  aria-hidden="true"
                  style={{ userSelect: 'none' }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-[#1E2761] text-xs font-medium opacity-[0.07] whitespace-nowrap"
                      style={{
                        top: `${12 + i * 16}%`,
                        left: '-10%',
                        width: '120%',
                        transform: 'rotate(-30deg)',
                        transformOrigin: 'left center',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {watermarkText} &nbsp;&nbsp;&nbsp; {watermarkText} &nbsp;&nbsp;&nbsp; {watermarkText}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Document>
        </div>
      </div>

      {/* Bottom navigation bar (keyboard shortcuts hint) */}
      <div className="bg-[#1E2761]/5 border-t border-[#CADCFC] px-4 py-2 flex justify-center gap-6 select-none">
        <button
          onClick={prevPage}
          disabled={pageNumber <= 1}
          className="text-xs text-gray-400 hover:text-[#1E2761] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Trang trước
        </button>
        <span className="text-xs text-gray-300">|</span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className="text-xs text-gray-400 hover:text-[#1E2761] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          Trang tiếp <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
