import { notFound } from "next/navigation";
import { registrations, salesRepRegistrations, salesReps, statusToneMap } from "@/data/mock";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/utils";
import {
  Badge,
  DataTable,
  KeyValueGrid,
  PageHeader,
  SectionCard,
  StatCard
} from "@/components/ui";

export default async function SalesRepDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rep = salesReps.find((item) => item.id === id);

  if (!rep) {
    notFound();
  }

  const relatedRegistrations = salesRepRegistrations(rep.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={rep.code}
        title={rep.name}
        description={rep.notes}
        actions={<Badge label={rep.status} tone={statusToneMap[rep.status]} />}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="عدد التسجيلات" value={formatNumber(rep.registrations)} helper="صفقات مرتبطة بالموظف" icon="registrations" tone="info" />
        <StatCard label="قيمة المبيعات" value={formatMoney(rep.salesEgp, "جنيه مصري")} helper="إجمالي البيع الفعلي" icon="wallet" tone="gold" />
        <StatCard label="عمولة متوقعة" value={formatMoney(rep.expectedCommissionEgp, "جنيه مصري")} helper="محسوبة على التسجيلات" icon="trend" tone="warning" />
        <StatCard label="عمولة مستحقة" value={formatMoney(rep.eligibleCommissionEgp, "جنيه مصري")} helper="جاهزة للترحيل" icon="spark" tone="success" />
        <StatCard label="عمولة مصروفة" value={formatMoney(rep.paidCommissionEgp, "جنيه مصري")} helper="تم صرفها فعليًا" icon="cash" tone="info" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="بيانات الموظف"
          description="الملف التعريفي والضبط الافتراضي للعمولة."
        >
          <KeyValueGrid
            items={[
              { label: "الكود", value: rep.code },
              { label: "الهاتف", value: rep.phone },
              { label: "الحالة", value: <Badge label={rep.status} tone={statusToneMap[rep.status]} /> },
              { label: "نسبة العمولة الافتراضية", value: formatPercent(rep.defaultCommissionRate) },
              { label: "عمولات ملغاة", value: formatMoney(rep.cancelledCommissionEgp, "جنيه مصري") },
              { label: "ملاحظات", value: rep.notes }
            ]}
          />
        </SectionCard>

        <SectionCard
          title="خط سير العمولة"
          description="الفصل بين المتوقعة / المستحقة / المصروفة ضروري لشفافية كشف العمولة."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">المتوقعة</p>
              <p className="mt-2 text-xl font-black">{formatMoney(rep.expectedCommissionEgp, "جنيه مصري")}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                محسوبة بمجرد إنشاء التسجيل وحفظ النسبة الفعلية وقت البيع.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(200,168,106,0.18)] bg-[var(--brand-gold-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">المستحقة</p>
              <p className="mt-2 text-xl font-black text-white">{formatMoney(rep.eligibleCommissionEgp, "جنيه مصري")}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                لا تتحقق إلا بعد السداد الكامل وانعقاد الدورة دون استرداد أو إلغاء.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(52,211,153,0.2)] bg-[var(--success-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--success)]">المصروفة</p>
              <p className="mt-2 text-xl font-black text-white">{formatMoney(rep.paidCommissionEgp, "جنيه مصري")}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                صُرفت بعد المراجعة واعتماد كشف العمولة النهائي.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="التسجيلات المرتبطة بالموظف"
        description="تفصيل الصفقات وحالة كل عمولة على مستوى التسجيل."
      >
        <DataTable
          columns={["التسجيل", "العميل", "قيمة البيع", "المدفوع", "حالة السداد", "حالة العمولة", "تاريخ التسجيل"]}
          rows={relatedRegistrations.map((registration) => [
            <span key="code" className="font-black text-white">{registration.code}</span>,
            <div key="customer" className="space-y-1">
              <p className="font-black text-white">{registration.customerName}</p>
              <p className="text-xs text-[var(--text-muted)]">{registration.phone}</p>
            </div>,
            <div key="sold" className="space-y-1">
              <p className="font-black text-white">{formatMoney(registration.soldPriceEgp, "جنيه مصري")}</p>
              <p className="text-xs text-[var(--text-muted)]">{formatMoney(registration.soldPrice, registration.currency)}</p>
            </div>,
            <span key="paid" className="font-black text-white">{formatMoney(registration.totalPaidEgp, "جنيه مصري")}</span>,
            <Badge key="payment" label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />,
            <Badge key="commission" label={registration.commissionStatus} tone={statusToneMap[registration.commissionStatus]} />,
            formatDate(registration.date)
          ])}
        />
      </SectionCard>
    </div>
  );
}
