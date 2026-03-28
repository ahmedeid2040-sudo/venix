import {
  courses,
  registrationTransfers,
  registrations
} from "@/data/mock";
import { formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  Badge,
  Button,
  DataTable,
  Field,
  InfoNote,
  PageHeader,
  SectionCard,
  SelectField,
  StatCard,
  TextAreaField
} from "@/components/ui";
import { AttachmentUploader } from "@/components/attachment-uploader";

export default function RegistrationTransfersPage() {
  const transferValue = registrationTransfers.reduce((sum, item) => sum + item.amountEgp, 0);
  const dueToDelay = registrationTransfers.filter((item) => item.reason === "تأجيل العميل").length;
  const dueToCancellation = registrationTransfers.filter((item) => item.reason === "إلغاء الدورة الأصلية").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مسار تحويل التسجيل"
        title="شاشة تحويل التسجيل"
        description="نقل العميل من دورة إلى أخرى دون فقدان الأثر المالي للتسجيل الأصلي، مع تتبع الرصيد المحول والسبب التنفيذي للتحويل."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير التحويلات
            </Button>
            <Button href="#create-form" icon="plus">
              إنشاء تحويل
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="إجمالي التحويلات" value={formatNumber(registrationTransfers.length)} helper="حركات تحويل موثقة" icon="transfer" tone="info" />
        <StatCard label="قيمة الرصيد المحول" value={formatMoney(transferValue, "جنيه مصري")} helper="انتقل بين تسجيلات دون استرداد كامل" icon="wallet" tone="gold" />
        <StatCard label="بسبب إلغاء/تأجيل" value={formatNumber(dueToDelay + dueToCancellation)} helper="مرتبطة بالقرار التشغيلي" icon="calendar" tone="warning" />
      </section>

      <SectionCard
        title="سجل تحويلات التسجيل"
        description="توضح الشاشة السجل الأصلي، السجل الجديد، الرصيد المنقول، والسبب الذي أدى إلى التحويل."
      >
        <DataTable
          columns={["الحركة", "التسجيل الأصلي", "الدورة الأصلية", "الدورة الجديدة", "التاريخ", "الرصيد المحول", "السبب", "ملاحظات"]}
          rows={registrationTransfers.map((transfer) => {
            const originalRegistration = registrations.find((item) => item.id === transfer.originalRegistrationId);
            const newRegistration = registrations.find((item) => item.id === transfer.newRegistrationId);
            const originalCourse = courses.find((item) => item.id === transfer.originalCourseId);
            const newCourse = courses.find((item) => item.id === transfer.newCourseId);

            return [
              <span key="id" className="font-black text-white">{transfer.id.toUpperCase()}</span>,
              <div key="orig-reg" className="space-y-1">
                <p className="font-black text-white">{originalRegistration?.code ?? transfer.originalRegistrationId}</p>
                <p className="text-xs text-[var(--text-muted)]">{originalRegistration?.customerName}</p>
              </div>,
              originalCourse?.name ?? transfer.originalCourseId,
              <div key="new-course" className="space-y-1">
                <p className="font-black text-white">{newCourse?.name ?? transfer.newCourseId}</p>
                <p className="text-xs text-[var(--text-muted)]">{newRegistration?.code ?? transfer.newRegistrationId}</p>
              </div>,
              formatDate(transfer.date),
              <div key="amount" className="space-y-1">
                <p className="font-black text-white">{formatMoney(transfer.amountOriginal, transfer.currency)}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatMoney(transfer.amountEgp, "جنيه مصري")}</p>
              </div>,
              <Badge key="reason" label={transfer.reason} tone={transfer.reason.includes("إلغاء") ? "danger" : "gold"} />,
              transfer.notes
            ];
          })}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="قواعد التحقق"
          description="مهم جدًا لأن التحويل لا يعني حذف السجل الأصلي أو إنشاء حركة غير موثقة."
        >
          <div className="grid gap-4">
            <InfoNote
              title="السجل الأصلي يبقى محفوظًا"
              description="لا يجوز حذف السجل الأصلي بعد التحويل، بل تتغير حالته إلى محول مع الاحتفاظ بسجل الرصيد السابق."
            />
            <InfoNote
              icon="spark"
              title="الرصيد المحول واضح"
              description="يُنقل كليًا أو جزئيًا حسب القرار، ويظهر في التسجيل الجديد كرصيد مرحّل."
            />
            <InfoNote
              icon="shield"
              title="سبب التحويل إلزامي"
              description="لتفسير ما إذا كان التحويل بطلب العميل، أو بسبب تأجيل أو إلغاء تشغيلي."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="نموذج تحويل تسجيل"
          description="واجهة واضحة جدًا توضح السجل الأصلي والجديد وقيمة الرصيد المنقول."
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <SelectField label="التسجيل الأصلي" options={registrations.map((registration) => registration.code)} />
            <SelectField label="الدورة الأصلية" options={courses.map((course) => course.name)} />
            <SelectField label="الدورة الجديدة" options={courses.map((course) => course.name)} />
            <Field label="تاريخ التحويل" type="date" />
            <Field label="قيمة الرصيد المحول" type="number" placeholder="1400" />
            <SelectField label="العملة" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="درهم إماراتي" />
            <Field label="سعر الصرف" type="number" placeholder="13.34" />
            <Field label="المعادل بالجنيه" type="number" placeholder="18676" />
            <SelectField label="سبب التحويل" options={["تأجيل العميل", "إلغاء الدورة الأصلية", "نقل بطلب العميل", "قرار إداري"]} defaultValue="تأجيل العميل" />
            <div className="md:col-span-2">
              <TextAreaField label="ملاحظات" placeholder="مثال: تم تحويل الرصيد بالكامل إلى دورة بديلة مع الاحتفاظ بالخصم الأصلي." />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ التحويل</Button>
              <Button variant="secondary">إنشاء التسجيل الجديد</Button>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="المرفقات الداعمة"
        description="يمكن رفع إيصالات وصور تحويل ومستندات داعمة وربطها بالسجل بعد الحفظ أو أثناء المراجعة."
      >
        <AttachmentUploader />
      </SectionCard>
    </div>
  );
}