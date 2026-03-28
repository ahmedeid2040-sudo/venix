"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppLogo, Badge, Button, Icon } from "@/components/ui";
import { navigation, quickActions } from "@/data/mock";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface ActiveUser {
  displayName: string;
  roleLabel: string;
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-shell-grid border-l border-white/6 bg-[rgba(6,12,21,0.92)] lg:sticky lg:top-0 lg:h-screen no-print">
      <div className="flex h-full flex-col gap-6 p-5">
        <div className="glass-card panel-sheen p-4">
          <AppLogo />
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
          {navigation.map((group) => (
            <div key={group.section} className="space-y-2">
              <p className="px-2 text-[11px] font-black text-[var(--text-muted)]">{group.section}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-sm font-bold transition",
                        active
                          ? "border-[rgba(85,198,213,0.22)] bg-[var(--brand-cyan-soft)] text-[var(--brand-cyan)]"
                          : "border-transparent text-[var(--text-secondary)] hover:border-white/8 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn("grid h-10 w-10 place-items-center rounded-2xl border", active ? "border-[rgba(85,198,213,0.22)] bg-white/5" : "border-white/8 bg-white/4 text-[var(--text-muted)]")}>
                          <Icon name={item.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <span>{item.label}</span>
                      </span>
                      <Icon name="arrow" className={cn("h-4 w-4 transition", active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="glass-card panel-sheen space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black text-[var(--text-muted)]">جاهزية التشغيل</p>
              <p className="mt-1 text-lg font-black">رفع وطباعة وتصدير</p>
            </div>
            <Badge label="جاهز" tone="gold" />
          </div>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            التقارير قابلة للطباعة على مقاس أ٤، والواجهة مهيأة لرفع المرفقات وتعدد المستخدمين داخل مركز فينكس.
          </p>
        </div>
      </div>
    </aside>
  );
}

function QuickCreateMenu() {
  return (
    <div className="hidden items-center gap-2 xl:flex">
      {quickActions.slice(0, 3).map((action) => (
        <Button key={action.href} href={action.href} variant="secondary" size="sm" icon="plus">
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);

  const activeModule = useMemo(() => {
    for (const group of navigation) {
      const match = group.items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
      if (match) return match.label;
    }
    return "نظرة عامة";
  }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.user) {
          setActiveUser({ displayName: payload.user.displayName, roleLabel: payload.user.roleLabel });
        }
      })
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/6 bg-[rgba(7,13,23,0.84)] backdrop-blur-xl no-print">
      <div className="flex flex-col gap-4 px-5 py-4 md:px-8 lg:px-10 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
            <span className="font-black text-white">{activeModule}</span>
            <span className="mx-2 text-[var(--text-muted)]">/</span>
            <span>{brand.centerName}</span>
          </div>
          <div className="flex-1 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Icon name="search" className="h-4 w-4 text-[var(--brand-cyan)]" />
              <input className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]" placeholder="ابحث عن دورة أو تسجيل أو رقم حركة أو اسم عميل" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <QuickCreateMenu />
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-white/4 text-[var(--text-secondary)] transition hover:bg-white/8 hover:text-white">
            <Icon name="bell" />
          </button>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-2.5">
            <p className="text-xs text-[var(--text-muted)]">الفترة الحالية</p>
            <p className="text-sm font-black">مارس ٢٠٢٦</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-2.5">
            <p className="text-xs text-[var(--text-muted)]">المستخدم النشط</p>
            <p className="text-sm font-black">{activeUser ? `${activeUser.displayName} — ${activeUser.roleLabel}` : "جارٍ تحميل المستخدم"}</p>
          </div>
          <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/8 hover:text-white">
            <Icon name="logout" className="h-4 w-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-white">
      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <Sidebar />
        <div className="min-w-0 print-root">
          <TopHeader />
          <main className="px-5 py-6 md:px-8 lg:px-10">{children}</main>
          <footer className="border-t border-white/6 px-5 py-4 text-center text-sm text-[var(--text-muted)] md:px-8 lg:px-10 no-print">
            {brand.footerCredit}
          </footer>
        </div>
      </div>
    </div>
  );
}
