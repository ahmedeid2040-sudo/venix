"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

export function AttachmentUploader({
  title = "المرفقات",
  description = "يمكن رفع إيصال أو صورة تحويل أو ملف داعم وربطه بالسجل بعد الحفظ."
}: {
  title?: string;
  description?: string;
}) {
  const [status, setحالة] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<Array<{ name: string; url: string }>>([]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setحالة(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/uploads", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok) {
        setحالة(payload.message || "تعذر رفع الملف.");
        return;
      }
      setFiles((current) => [...current, { name: payload.file.name, url: payload.file.url }]);
      setحالة("تم رفع المرفق بنجاح.");
    } catch {
      setحالة("حدث خطأ أثناء رفع المرفق.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--brand-cyan-soft)] text-[var(--brand-cyan)]">
          <Icon name="external" className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-black">{title}</h3>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
          <label className="mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10">
            <Icon name="plus" className="h-4 w-4" />
            <span>{loading ? "جارٍ الرفع..." : "رفع مرفق"}</span>
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
          {status ? <p className="text-xs text-[var(--text-muted)]">{status}</p> : null}
          {files.length ? (
            <div className="grid gap-2 pt-2">
              {files.map((file) => (
                <a key={file.url} href={file.url} target="_blank" className="rounded-2xl border border-white/8 bg-[rgba(10,18,31,0.54)] px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-white">
                  {file.name}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
