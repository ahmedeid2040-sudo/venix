import Link from "next/link";
import React from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export type IconName =
  | "overview"
  | "courses"
  | "team"
  | "registrations"
  | "collections"
  | "fees"
  | "refunds"
  | "transfer"
  | "cash"
  | "expenses"
  | "accounts"
  | "parties"
  | "reports"
  | "settings"
  | "search"
  | "bell"
  | "plus"
  | "calendar"
  | "wallet"
  | "trend"
  | "filter"
  | "download"
  | "external"
  | "shield"
  | "spark"
  | "logout"
  | "arrow"
  | "eye"
  | "eyeOff";

const iconPaths: Record<IconName, React.ReactNode> = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="11" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="18" width="7" height="3" rx="1.5" />
    </>
  ),
  courses: (
    <>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H20v15.5A2.5 2.5 0 0 0 17.5 17H5z" />
      <path d="M5 6.5v11A2.5 2.5 0 0 0 7.5 20H19" />
      <path d="M9 8h7" />
      <path d="M9 11h5" />
    </>
  ),
  team: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 21v-2a3 3 0 0 0-2-2.83" />
      <path d="M16 5.13a3 3 0 0 1 0 5.74" />
    </>
  ),
  registrations: (
    <>
      <path d="M7 4h10l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M14 4v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </>
  ),
  collections: (
    <>
      <path d="M3 7h18v10H3z" />
      <path d="M16 12h2" />
      <path d="M7 12h3" />
      <path d="M3 10h18" />
    </>
  ),
  fees: (
    <>
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  refunds: (
    <>
      <path d="M9 14L4 9l5-5" />
      <path d="M20 20v-6a5 5 0 0 0-5-5H4" />
    </>
  ),
  transfer: (
    <>
      <path d="M17 3l4 4-4 4" />
      <path d="M3 7h18" />
      <path d="M7 21l-4-4 4-4" />
      <path d="M21 17H3" />
    </>
  ),
  cash: (
    <>
      <path d="M4 7h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1z" />
      <path d="M16 7V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
      <circle cx="12" cy="13" r="2.5" />
    </>
  ),
  expenses: (
    <>
      <path d="M4 5h16" />
      <path d="M6 5l1 14h10l1-14" />
      <path d="M10 11v4" />
      <path d="M14 11v4" />
    </>
  ),
  accounts: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14h4" />
    </>
  ),
  parties: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </>
  ),
  reports: (
    <>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
      <path d="M3 19h18" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5z" />
      <path d="M17 12h2" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h6v6" />
      <path d="M10 14L20 4" />
      <path d="M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  spark: (
    <>
      <path d="M13 2l2.2 5.8L21 10l-5.8 2.2L13 18l-2.2-5.8L5 10l5.8-2.2L13 2z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4l16 16" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" />
      <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.7 4.6" />
      <path d="M6.2 6.3A18.6 18.6 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 3-.4" />
    </>
  )
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={cn("h-5 w-5", className)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {iconPaths[name]}
    </svg>
  );
}

export function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(200,168,106,0.4),transparent_45%),linear-gradient(160deg,rgba(85,198,213,0.18),rgba(10,18,31,0.95))] shadow-glow">
        <div className="absolute inset-1 rounded-[18px] border border-white/8" />
        <span className="relative text-base font-black text-[var(--brand-gold)]">ف</span>
      </div>
      {!compact ? (
        <div className="space-y-1">
          <p className="text-[13px] font-extrabold text-white">{brand.centerName}</p>
          <p className="text-[11px] text-[var(--text-muted)]">{brand.systemDescription}</p>
        </div>
      ) : null}
    </div>
  );
}

export function Badge({
  label,
  tone = "neutral",
  className
}: {
  label: string;
  tone?: "success" | "warning" | "danger" | "info" | "gold" | "neutral";
  className?: string;
}) {
  const tones = {
    success: "bg-[var(--success-soft)] text-[var(--success)] border-[rgba(52,211,153,0.24)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)] border-[rgba(251,191,36,0.24)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)] border-[rgba(251,113,133,0.24)]",
    info: "bg-[var(--info-soft)] text-[var(--info)] border-[rgba(96,165,250,0.24)]",
    gold: "bg-[var(--brand-gold-soft)] text-[var(--brand-gold)] border-[rgba(200,168,106,0.24)]",
    neutral: "bg-white/6 text-[var(--text-secondary)] border-white/10"
  };

  return <span className={cn("status-pill", tones[tone], className)}>{label}</span>;
}

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "soft";
  size?: "sm" | "md";
  icon?: IconName;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "secondary",
  size = "md",
  icon,
  className
}: ButtonProps) {
  const sizes = {
    sm: "h-8.5 px-3.5 text-[12px]",
    md: "h-10 px-4.5 text-[13px]"
  };

  const variants = {
    primary:
      "bg-[linear-gradient(135deg,rgba(200,168,106,0.95),rgba(85,198,213,0.92))] text-slate-950 shadow-[0_16px_36px_rgba(85,198,213,0.16)]",
    secondary: "border border-white/10 bg-white/6 text-white hover:bg-white/10",
    ghost: "text-[var(--text-secondary)] hover:bg-white/8",
    soft: "border border-[rgba(200,168,106,0.18)] bg-[var(--brand-gold-soft)] text-[var(--brand-gold)]"
  };

  const content = (
    <>
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      <span>{children}</span>
    </>
  );

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition duration-200",
    sizes[size],
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <button className={classes}>{content}</button>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass-card panel-sheen mb-8 p-5 md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,168,106,0.18)] bg-[var(--brand-gold-soft)] px-4 py-2 text-xs font-bold text-[var(--brand-gold)]">
              <Icon name="spark" className="h-4 w-4" />
              <span>{eyebrow}</span>
            </div>
          ) : null}
          <div className="space-y-2">
            <h1 className="text-[1.6rem] font-black tracking-tight md:text-[1.8rem]">{title}</h1>
            {description ? (
              <p className="max-w-3xl text-[13px] leading-7 text-[var(--text-secondary)]">{description}</p>
            ) : null}
          </div>
          {children ? <div>{children}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  helper,
  delta,
  icon,
  tone = "info"
}: {
  label: string;
  value: string;
  helper?: string;
  delta?: string;
  icon?: IconName;
  tone?: "success" | "warning" | "danger" | "info" | "gold" | "neutral";
}) {
  const accents = {
    success: "from-[rgba(52,211,153,0.16)] to-transparent text-[var(--success)]",
    warning: "from-[rgba(251,191,36,0.16)] to-transparent text-[var(--warning)]",
    danger: "from-[rgba(251,113,133,0.16)] to-transparent text-[var(--danger)]",
    info: "from-[rgba(96,165,250,0.16)] to-transparent text-[var(--info)]",
    gold: "from-[rgba(200,168,106,0.18)] to-transparent text-[var(--brand-gold)]",
    neutral: "from-white/8 to-transparent text-white"
  };

  return (
    <div className="soft-card panel-sheen p-[18px]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[var(--text-muted)]">{label}</p>
          <h3 className="text-[1.35rem] font-black leading-tight">{value}</h3>
          {helper ? <p className="text-[12px] text-[var(--text-secondary)]">{helper}</p> : null}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br", accents[tone])}>
          {icon ? <Icon name={icon} className="h-5 w-5" /> : <Icon name="spark" className="h-5 w-5" />}
        </div>
      </div>
      {delta ? <div className="mt-4 text-[13px] font-semibold text-[var(--text-muted)]">{delta}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass-card panel-sheen p-5", className)}>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-[1.02rem] font-black">{title}</h2>
          {description ? <p className="text-[13px] leading-7 text-[var(--text-secondary)]">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function FilterBar({
  filters,
  children
}: {
  filters: Array<{ label: string; active?: boolean }>;
  children?: React.ReactNode;
}) {
  return (
    <div className="soft-card mb-6 flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <span
            key={filter.label}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-bold",
              filter.active
                ? "border-[rgba(85,198,213,0.22)] bg-[var(--brand-cyan-soft)] text-[var(--brand-cyan)]"
                : "border-white/8 bg-white/4 text-[var(--text-secondary)]"
            )}
          >
            {filter.label}
          </span>
        ))}
      </div>
      {children ? <div className="section-divider pt-4">{children}</div> : null}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  compact = false
}: {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[rgba(8,15,26,0.62)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead className="bg-white/4">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={cn(
                    "whitespace-nowrap px-4 py-3.5 text-[11px] font-extrabold text-[var(--text-muted)]",
                    compact ? "py-3" : ""
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-white/6">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "px-4 py-3.5 align-top text-[12px] text-[var(--text-secondary)]",
                      compact ? "py-3 text-[12.5px]" : ""
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function baseFieldClass() {
  return "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white outline-none ring-0 transition placeholder:text-[rgba(189,200,218,0.5)] focus:border-[rgba(85,198,213,0.26)] focus:bg-white/[0.06]";
}

export function Field({
  label,
  hint,
  type = "text",
  placeholder,
  defaultValue
}: {
  label: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold text-white">{label}</span>
        {hint ? <span className="text-[11px] text-[var(--text-muted)]">{hint}</span> : null}
      </div>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} className={baseFieldClass()} />
    </label>
  );
}

export function SelectField({
  label,
  options,
  hint,
  defaultValue
}: {
  label: string;
  options: string[];
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold text-white">{label}</span>
        {hint ? <span className="text-[11px] text-[var(--text-muted)]">{hint}</span> : null}
      </div>
      <select defaultValue={defaultValue} className={baseFieldClass()}>
        <option value="">اختر...</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  placeholder,
  defaultValue,
  rows = 4
}: {
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold text-white">{label}</span>
        {hint ? <span className="text-[11px] text-[var(--text-muted)]">{hint}</span> : null}
      </div>
      <textarea rows={rows} placeholder={placeholder} defaultValue={defaultValue} className={cn(baseFieldClass(), "resize-none")} />
    </label>
  );
}

export function KeyValueGrid({ items }: { items: Array<{ label: string; value: React.ReactNode }> }) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <dt className="text-[11px] font-bold text-[var(--text-muted)]">{item.label}</dt>
          <dd className="mt-2 text-[13px] font-semibold text-white">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BarList({
  items
}: {
  items: Array<{ label: string; value: string; percent: number; tone?: "gold" | "cyan" | "success" | "danger" }>;
}) {
  const tones = {
    gold: "from-[rgba(200,168,106,0.9)] to-[rgba(200,168,106,0.25)]",
    cyan: "from-[rgba(85,198,213,0.9)] to-[rgba(85,198,213,0.25)]",
    success: "from-[rgba(52,211,153,0.95)] to-[rgba(52,211,153,0.2)]",
    danger: "from-[rgba(251,113,133,0.95)] to-[rgba(251,113,133,0.2)]"
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-white">{item.label}</span>
            <span className="text-[var(--text-secondary)]">{item.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/6">
            <div className={cn("h-full rounded-full bg-gradient-to-l", tones[item.tone ?? "cyan"])} style={{ width: `${Math.max(6, Math.min(100, item.percent))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const width = 280;
  const height = 96;

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const normalized = max === min ? 0.5 : (value - min) / (max - min);
      const y = height - normalized * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full overflow-visible">
      <defs>
        <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(85,198,213,0.24)" />
          <stop offset="100%" stopColor="rgba(85,198,213,0)" />
        </linearGradient>
        <linearGradient id="sparkStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(200,168,106,1)" />
          <stop offset="100%" stopColor="rgba(85,198,213,1)" />
        </linearGradient>
      </defs>
      <polyline points={fillPoints} fill="url(#sparkFill)" stroke="none" />
      <polyline points={points} fill="none" stroke="url(#sparkStroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/12 bg-white/3 px-6 py-10 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/6">
        <Icon name="spark" className="h-6 w-6 text-[var(--brand-gold)]" />
      </div>
      <h3 className="text-base font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-[13px] leading-7 text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

export function QuickActionStrip({ actions }: { actions: Array<{ label: string; href: string }> }) {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button key={action.label} href={action.href} variant="secondary" size="sm" icon="plus">
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export function InfoNote({
  icon = "shield",
  title,
  description
}: {
  icon?: IconName;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/4 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold)]">
          <Icon name={icon} className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-black">{title}</h3>
          <p className="text-[13px] leading-7 text-[var(--text-secondary)]">{description}</p>
        </div>
      </div>
    </div>
  );
}
