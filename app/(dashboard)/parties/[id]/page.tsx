import { notFound } from "next/navigation";
import Link from "next/link";
import { accountMovements, accounts, getParty, parties, partyMovements, statusToneMap } from "@/data/mock";
import { formatCurrencyLabel, formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  Badge,
  DataTable,
  KeyValueGrid,
  PageHeader,
  SectionCard,
  StatCard
} from "@/components/ui";

export default async function PartyDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const party = parties.find((item) => item.id === id);

  if (!party) {
    notFound();
  }

  const linkedAccounts = accounts.filter((account) => party.linkedAccountIds.includes(account.id));
  const movements = partyMovements(party.id);

  const roleLabels = [
    party.isPartner ? "شريك" : null,
    party.isFunder ? "ممّول" : null,
    party.receivesMoney ? "مستلم أموال" : null,
    party.paysExpenses ? "دافع مصروفات" : null,
    party.ownsCollectionAccount ? "صاحب وسيلة تحصيل" : null,
    party.hasRunningBalance ? "له جاري / عهدة" : null
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={party.code}
        title={party.name}
        description={party.accountingNotes}
        actions={
          <>
            <Badge label={party.status} tone={statusToneMap[party.status]} />
            {roleLabels.map((role) => (
              <Badge key={role} label={role} tone="info" />
            ))}
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="ما لديه للمركز" value={formatMoney(party.fundsHeldEgp, "جنيه مصري")} helper="أموال مرتبطة بالمركز خارج الخزنة" icon="wallet" tone="gold" />
        <StatCard label="ما دفعه من جيبه" value={formatMoney(party.personalSpendEgp, "جنيه مصري")} helper="مصروفات لصالح المركز" icon="expenses" tone="warning" />
        <StatCard label="ما تمت تسويته" value={formatMoney(party.settledEgp, "جنيه مصري")} helper="مبالغ تم إقفالها" icon="spark" tone="success" />
        <StatCard label="المتبقي للتسوية" value={formatMoney(party.outstandingEgp, "جنيه مصري")} helper="جاري / عهدة / مستحقات" icon="trend" tone="danger" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="الملف المحاسبي للطرف"
          description="يوضح صفته الإدارية ودوره المالي وما إذا كان له أرصدة قائمة أو وسائل تحصيل مرتبطة."
        >
          <KeyValueGrid
            items={[
              { label: "الاسم", value: party.name },
              { label: "الصفة الإدارية", value: party.adminRole },
              { label: "الحالة", value: <Badge label={party.status} tone={statusToneMap[party.status]} /> },
              { label: "الأدوار المالية", value: roleLabels.join(" / ") },
              { label: "عدد الوسائل المرتبطة", value: `${formatNumber(linkedAccounts.length)} حسابات` },
              { label: "ملاحظات محاسبية", value: party.accountingNotes }
            ]}
          />
        </SectionCard>

        <SectionCard
          title="الحسابات المرتبطة"
          description="إذا كانت للطرف وسيلة تحصيل أو خزنة مرتبطة، تظهر هنا مع الرصيد الحالي."
        >
          <div className="grid gap-4">
            {linkedAccounts.map((account) => (
              <Link
                key={account.id}
                href={`/accounts/${account.id}`}
                className="rounded-[24px] border border-white/8 bg-white/4 p-5 transition hover:border-[rgba(85,198,213,0.22)] hover:bg-white/6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-black text-white">{account.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{account.type} — {formatCurrencyLabel(account.baseCurrency)}</p>
                  </div>
                  <Badge label={account.status} tone={statusToneMap[account.status]} />
                </div>
                <p className="mt-4 text-xl font-black">{formatMoney(account.balanceEgp, "جنيه مصري")}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  الصافي المتاح: {formatMoney(account.netAvailableEgp, "جنيه مصري")}
                </p>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="الحركات المرتبطة بالطرف"
        description="ما استلمه لصالح المركز، وما دفعه من جيبه، وما تم رده أو توريده."
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
  );
}
