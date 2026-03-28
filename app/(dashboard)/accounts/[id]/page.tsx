import { notFound } from "next/navigation";
import { accountMovements, accounts, getParty, statusToneMap } from "@/data/mock";
import { formatCurrencyLabel, formatDate, formatMoney } from "@/lib/utils";
import {
  Badge,
  DataTable,
  KeyValueGrid,
  PageHeader,
  SectionCard,
  StatCard
} from "@/components/ui";

export default async function AccountDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = accounts.find((item) => item.id === id);

  if (!account) {
    notFound();
  }

  const owner = getParty(account.ownerPartyId);
  const movements = accountMovements(account.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={account.code}
        title={account.name}
        description={account.notes}
        actions={<Badge label={account.status} tone={statusToneMap[account.status]} />}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="الرصيد الحالي" value={formatMoney(account.balanceEgp, "جنيه مصري")} helper={formatMoney(account.balanceOriginal, account.baseCurrency)} icon="wallet" tone="gold" />
        <StatCard label="إجمالي التحصيلات" value={formatMoney(account.totalCollectedEgp, "جنيه مصري")} helper="ما دخل عبر الوسيلة" icon="collections" tone="info" />
        <StatCard label="الرسوم المرتبطة" value={formatMoney(account.feesEgp, "جنيه مصري")} helper="سترايب / تحويل / سحب" icon="fees" tone="warning" />
        <StatCard label="ما تم توريده للخزنة" value={formatMoney(account.transferredToCashEgp, "جنيه مصري")} helper="تحويلات داخلية موثقة" icon="cash" tone="success" />
        <StatCard label="الصافي المتاح" value={formatMoney(account.netAvailableEgp, "جنيه مصري")} helper="بعد الرسوم والتحويلات" icon="spark" tone="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="ملف الحساب"
          description="الخصائص الأساسية لصاحب الوسيلة وطبيعتها وتشغيلها."
        >
          <KeyValueGrid
            items={[
              { label: "الاسم", value: account.name },
              { label: "النوع", value: account.type },
              { label: "صاحب الوسيلة", value: owner?.name ?? account.ownerPartyId },
              { label: "شخصية أم للمركز", value: account.isPersonal ? "شخصية" : "مخصصة للمركز" },
              { label: "العملة الأساسية", value: formatCurrencyLabel(account.baseCurrency) },
              { label: "يستقبل من العملاء", value: account.acceptsCollections ? "نعم" : "لا" },
              { label: "يتم الصرف منها", value: account.canSpend ? "نعم" : "لا" },
              { label: "يتم التحويل منها للخزنة", value: account.canTransferToCash ? "نعم" : "لا" }
            ]}
          />
        </SectionCard>

        <SectionCard
          title="سجل الحركة"
          description="يُظهر التحصيلات والرسوم والتحويلات المرتبطة بالوسيلة."
        >
          <DataTable
            columns={["الحركة", "النوع", "التاريخ", "الوصف", "الاتجاه", "القيمة", "ملاحظات"]}
            rows={movements.map((movement) => [
              <span key="id" className="font-black text-white">{movement.id.toUpperCase()}</span>,
              movement.type,
              formatDate(movement.date),
              movement.label,
              <span key="direction" className={movement.direction === "in" ? "font-black text-[var(--success)]" : "font-black text-[var(--danger)]"}>
                {movement.direction === "in" ? "داخل" : "خارج"}
              </span>,
              <span key="amount" className="font-black text-white">{formatMoney(movement.amountEgp, "جنيه مصري")}</span>,
              movement.notes
            ])}
          />
        </SectionCard>
      </div>
    </div>
  );
}
