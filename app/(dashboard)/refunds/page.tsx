import {
  accounts,
  courses,
  refundReasonOptions,
  refunds,
  registrations
} from "@/data/mock";
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
import { AttachmentUploader } from "@/components/attachment-uploader";

export default function RefundsPage() {
  const totalRefunds = refunds.reduce((sum, item) => sum + item.amountEgp, 0);
  const fullRefunds = refunds.filter((item) => item.refundType === "كلي").length;
  const partialRefunds = refunds.filter((item) => item.refundType === "جزئي").length;

  const reasonDistribution = refundReasonOptions
    .map((reason) => ({
      label: reason,
      total: refunds.filter((refund) => refund.reason === reason).reduce((sum, refund) => sum + refund.amountEgp, 0)
    }))
    .filter((item) => item.total > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="ضبط الاستردادات"
        title="شاشة الاستردادات"
        description="أي مبلغ يتم رده للعميل يسجل كاسترداد مرتبط بالتسجيل الأصلي والتحصيلات المرتبطة به، وليس كمصروف عادي."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير الاستردادات
            </Button>
            <Button href="#create-form" icon="plus">
              تسجيل استرداد
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="إجمالي الاستردادات" value={formatMoney(totalRefunds, "جنيه مصري")} helper="المبالغ المعادة للعملاء" icon="refunds" tone="danger" />
        <StatCard label="استردادات كاملة" value={formatNumber(fullRefunds)} helper="مرتبطة بإلغاء أو عدم انعقاد" icon="spark" tone="warning" />
        <StatCard label="استردادات جزئية" value={formatNumber(partialRefunds)} helper="تسويات أو انسحابات جزئية" icon="trend" tone="info" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SectionCard
          title="جدول الاستردادات"
          description="يُظهر التسجيل الأصلي والدورة ووسيلة الرد والشخص الذي نفذ الحركة."
        >
          <DataTable
            columns={["الاسترداد", "التسجيل", "العميل", "الدورة", "التاريخ", "القيمة", "وسيلة الرد", "السبب", "النوع"]}
            rows={refunds.map((refund) => {
              const registration = registrations.find((item) => item.id === refund.registrationId);
              const course = courses.find((item) => item.id === refund.courseId);
              const account = accounts.find((item) => item.id === refund.accountId);
              return [
                <span key="id" className="font-black text-white">{refund.id.toUpperCase()}</span>,
                registration?.code ?? refund.registrationId,
                refund.customerName,
                course?.name ?? refund.courseId,
                formatDate(refund.date),
                <div key="amount" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(refund.amountOriginal, refund.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatMoney(refund.amountEgp, "جنيه مصري")}</p>
                </div>,
                account?.name ?? refund.accountId,
                refund.reason,
                <Badge key="type" label={refund.refundType} tone={refund.refundType === "كلي" ? "danger" : "warning"} />
              ];
            })}
          />
        </SectionCard>

        <SectionCard
          title="توزيع الأسباب"
          description="يساعد على فهم ما إذا كانت الاستردادات ناتجة عن تشغيليّات أو عن تجربة عميل."
        >
          <BarList
            items={reasonDistribution.map((item) => ({
              label: item.label,
              value: formatMoney(item.total, "جنيه مصري"),
              percent: (item.total / Math.max(totalRefunds, 1)) * 100,
              tone: item.label.includes("عدم") ? "danger" : item.label.includes("انسحاب") ? "gold" : "cyan"
            }))}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="نموذج إنشاء استرداد"
        description="يتأكد من عدم تجاوز إجمالي الاسترداد لصافي المدفوع على التسجيل."
        className="anchor-section"
      >
        <div id="create-form" className="grid gap-4 md:grid-cols-2">
          <SelectField label="رقم التسجيل" options={registrations.map((registration) => registration.code)} />
          <Field label="اسم العميل" placeholder="يتم جلبه تلقائيًا بعد اختيار التسجيل" />
          <SelectField label="الدورة" options={courses.map((course) => course.name)} />
          <Field label="التاريخ" type="date" />
          <SelectField label="نوع الاسترداد" options={["جزئي", "كلي"]} defaultValue="جزئي" />
          <Field label="المبلغ المسترد" type="number" placeholder="200" />
          <SelectField label="العملة" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="درهم إماراتي" />
          <Field label="سعر الصرف" type="number" placeholder="13.3" />
          <Field label="المعادل بالجنيه" type="number" placeholder="2660" />
          <SelectField label="وسيلة الرد" options={accounts.map((account) => account.name)} />
          <SelectField label="من قام بالرد" options={["حمادة", "أمل", "سارة", "أحمد", "المحاسب"]} />
          <SelectField label="سبب الاسترداد" options={refundReasonOptions} defaultValue="انسحاب عميل" />
          <div className="md:col-span-2">
            <TextAreaField label="ملاحظات" placeholder="اكتب سببًا توضيحيًا أو نتيجة موافقة الإدارة على الاسترداد." />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button icon="plus">حفظ الاسترداد</Button>
            <Button variant="secondary">حفظ وطباعة الإشعار</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="المرفقات الداعمة"
        description="يمكن رفع إيصالات وصور تحويل ومستندات داعمة وربطها بالسجل بعد الحفظ أو أثناء المراجعة."
      >
        <AttachmentUploader />
      </SectionCard>
    </div>
  );
}