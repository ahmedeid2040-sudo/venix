"use client";

import { Icon } from "@/components/ui";

function downloadإكسلFromElement(element: HTMLElement, fileName: string) {
  const documentTitle = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body>${element.outerHTML}</body>
    </html>`;

  const blob = new Blob(["\ufeff", documentTitle], {
    type: "application/vnd.ms-excel;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportActions({ fileName = "تقارير-مركز-فينكس" }: { fileName?: string }) {
  const handlePrint = () => window.print();

  const handleExport = () => {
    const root = document.querySelector<HTMLElement>("[data-report-root]");
    if (!root) return;
    downloadإكسلFromElement(root, fileName);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <button onClick={handlePrint} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-5 text-sm font-bold text-white transition hover:bg-white/10">
        <Icon name="download" className="h-4 w-4" />
        <span>طباعة أ٤</span>
      </button>
      <button onClick={handleExport} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,rgba(200,168,106,0.95),rgba(85,198,213,0.92))] px-5 text-sm font-bold text-slate-950 shadow-[0_16px_36px_rgba(85,198,213,0.16)] transition">
        <Icon name="download" className="h-4 w-4" />
        <span>تصدير ملف إكسل</span>
      </button>
    </div>
  );
}
