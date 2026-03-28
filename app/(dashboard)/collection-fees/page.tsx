import { accounts, collections, feeTypeOptions, fees } from "@/data/mock";
import { formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  Badge,
  BarList,
  Button,
  DataTable,
  Field,
  PageHeader,
  SectionCard,
  SelectField,
  StatCard,
  TextAreaField
} from "@/components/ui";

export default function CollectionFeesPage() {
  const grossCollected = collections.reduce((sum, item) => sum + item.amountEgp, 0);
  const totalFees = fees.reduce((sum, item) => sum + item.amountEgp, 0);
  const netAvailable = grossCollected - totalFees;

  const byType = feeTypeOptions
    .map((type) => ({
      label: type,
      total: fees.filter((fee) => fee.feeType === type).reduce((sum, fee) => sum + fee.amountEgp, 0)
    }))
    .filter((item) => item.total > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="تحليل رسوم التحصيل"
        title="شاشة رسوم التحصيل"
        description="تُستخدم لتفسير الفرق بين إجمالي التحصيل قبل الرسوم وصافي المبلغ المتاح أو المورَّد إلى الخزنة، مع ربط الرسوم بالحركة الأصلية كلما أمكن."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير رسوم التحصيل
            </Button>
            <Button href="#create-form" icon="plus">
              إضافة رسوم
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="إجمالي التحصيل قبل الرسوم" value={formatMoney(grossCollected, "جنيه مصري")} helper="إجمالي ما دفعه العملاء قبل أي خصومات" icon="collections" tone="info" />
        <StatCard label="إجمالي الرسوم" value={formatMoney(totalFees, "جنيه مصري")} helper="رسوم التحصيل والتحويل وفروق العملة" icon="fees" tone="warning" />
        <StatCard label="الصافي المتاح" value={formatMoney(netAvailable, "جنيه مصري")} helper="المتاح فعليًا للتوريد أو الاستخدام" icon="wallet" tone="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <SectionCard
          title="توزيع الرسوم حسب النوع"
          description="لقطة تساعد الإدارة على معرفة أين يذهب جزء من التحصيل قبل أن يصبح متاحًا في الخزنة."
        >
          <BarList
            items={byType.map((item) => ({
              label: item.label,
              value: formatMoney(item.total, "جنيه مصري"),
              percent: (item.total / Math.max(totalFees, 1)) * 100,
              tone:
                item.label.includes("سترايب")
                  ? "cyan"
                  : item.label.includes("فرق")
                    ? "danger"
                    : "gold"
            }))}
          />
        </SectionCard>

        <SectionCard
          title="سجل رسوم التحصيل"
          description="كل رسوم موثقة بتاريخها ومرجعها والوسيلة المرتبطة بها."
        >
          <DataTable
            columns={["الحركة", "التاريخ", "الوسيلة", "العملية", "المرجع", "نوع الرسوم", "القيمة", "المعادل بالجنيه", "ملاحظات"]}
            rows={fees.map((fee) => {
              const account = accounts.find((account) => account.id === fee.accountId);
              return [
                <span key="id" className="font-black text-white">{fee.id.toUpperCase()}</span>,
                formatDate(fee.date),
                account?.name ?? fee.accountId,
                fee.operationType,
                fee.referenceId.toUpperCase(),
                <Badge key="type" label={fee.feeType} tone={fee.feeType.includes("فرق") ? "danger" : "warning"} />,
                <div key="orig" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(fee.amountOriginal, fee.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">سعر الصرف: {fee.exchangeRate}</p>
                </div>,
                <span key="egp" className="font-black text-white">{formatMoney(fee.amountEgp, "جنيه مصري")}</span>,
                fee.notes
              ];
            })}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="نموذج تسجيل رسوم جديدة"
        description="يمكن ربط الرسم بتحصيل أو تحويل أو سحب أو تسوية حسب مصدر الاقتطاع."
        className="anchor-section"
      >
        <div id="create-form" className="grid gap-4 md:grid-cols-2">
          <SelectField label="وسيلة التحصيل" options={accounts.map((account) => account.name)} />
          <SelectField label="العملية المرتبطة" options={["تحصيل", "تحويل", "سحب", "تسوية"]} defaultValue="تحصيل" />
          <Field label="المرجع المرتبط" placeholder="تحص-٢٤١٣ / حول-٢٤٠٦" />
          <SelectField label="نوع الرسوم" options={feeTypeOptions} defaultValue="رسوم سترايب" />
          <Field label="مبلغ الرسوم" type="number" placeholder="82" />
          <SelectField label="العملة" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="درهم إماراتي" />
          <Field label="سعر الصرف" type="number" placeholder="13.34" />
          <Field label="المعادل بالجنيه" type="number" placeholder="1094" />
          <div className="md:col-span-2">
            <TextAreaField label="ملاحظات" placeholder="توضيح سبب الرسم أو الفرق الناتج عن التحويل أو السحب." />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button icon="plus">حفظ الرسوم</Button>
            <Button variant="secondary">حفظ وربط بمرجع لاحقًا</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
