"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { brand } from "@/lib/brand";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => Boolean(username.trim() && password.trim() && !loading), [username, password, loading]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, remember })
      });

      const payload = await response.json().catch(() => ({ message: "تعذر إتمام عملية الدخول." }));

      if (!response.ok) {
        setError(payload.message || "تعذر تسجيل الدخول. حاول مرة أخرى.");
        return;
      }

      router.push("/overview");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء محاولة تسجيل الدخول. تحقق من الاتصال وأعد المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="glass-card panel-sheen space-y-5 p-6 md:p-7">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(85,198,213,0.24)] bg-[var(--brand-cyan-soft)] px-4 py-2 text-[11px] font-bold text-[var(--brand-cyan)]">
          <Icon name="shield" className="h-4 w-4" />
          <span>تسجيل دخول آمن</span>
        </div>
        <div>
          <h2 className="text-[1.55rem] font-black leading-tight">تسجيل الدخول</h2>
          <p className="mt-2 text-[13px] leading-7 text-[var(--text-secondary)]">
            أدخل بيانات الحساب المصرح له للوصول إلى {brand.systemDescription}.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="space-y-2">
          <span className="text-[13px] font-bold text-white">اسم المستخدم</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-[rgba(189,200,218,0.5)] focus:border-[rgba(85,198,213,0.26)] focus:bg-white/[0.06]"
            placeholder="اكتب اسم المستخدم"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="text-[13px] font-bold text-white">كلمة المرور</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-14 text-[13px] text-white outline-none transition placeholder:text-[rgba(189,200,218,0.5)] focus:border-[rgba(85,198,213,0.26)] focus:bg-white/[0.06]"
              placeholder="اكتب كلمة المرور"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 left-3 my-auto grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/6 text-[var(--text-secondary)] transition hover:text-white"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
            </button>
          </div>
        </label>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)]">
          <input
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            type="checkbox"
            className="h-4 w-4 rounded border-white/10 bg-white/5 accent-[var(--brand-cyan)]"
          />
          <span>الاحتفاظ بالجلسة على هذا الجهاز</span>
        </label>
        <p className="text-[12px] text-[var(--text-muted)]">للدعم الفني تواصل مع مسؤول النظام</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-[rgba(251,113,133,0.24)] bg-[var(--danger-soft)] px-4 py-3 text-[13px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-[13px] font-black transition",
          canSubmit
            ? "bg-[linear-gradient(135deg,rgba(200,168,106,0.95),rgba(85,198,213,0.92))] text-slate-950 shadow-[0_16px_36px_rgba(85,198,213,0.16)]"
            : "cursor-not-allowed bg-white/10 text-[var(--text-muted)]"
        )}
      >
        <Icon name="arrow" className="h-4 w-4" />
        <span>{loading ? "جارٍ التحقق من البيانات..." : "الدخول إلى لوحة التحكم"}</span>
      </button>

      <div className="rounded-[22px] border border-white/8 bg-white/4 px-4 py-4">
        <p className="text-[13px] leading-7 text-[var(--text-secondary)]">
          لا يتم عرض أي بيانات مالية أو تشغيلية أو أرقام داخلية قبل اكتمال التحقق من الهوية.
        </p>
      </div>
    </form>
  );
}
