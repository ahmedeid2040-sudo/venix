import { CurrencyCode } from "@/data/mock";

const currencyAliasMap: Record<string, CurrencyCode> = {
  EGP: "EGP",
  AED: "AED",
  SAR: "SAR",
  "جنيه مصري": "EGP",
  "درهم إماراتي": "AED",
  "ريال سعودي": "SAR"
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeCurrency(currency?: string): CurrencyCode {
  if (!currency) return "EGP";
  return currencyAliasMap[currency] ?? "EGP";
}

export function formatCurrencyLabel(currency?: string) {
  const code = normalizeCurrency(currency);
  const labels: Record<CurrencyCode, string> = {
    EGP: "جنيه مصري",
    AED: "درهم إماراتي",
    SAR: "ريال سعودي"
  };
  return labels[code];
}

export function formatMoney(value: number, currency: string = "EGP") {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: normalizeCurrency(currency),
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1
  }).format(value)}%`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
