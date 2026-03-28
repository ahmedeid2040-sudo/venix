import {
  accounts,
  collections,
  courses,
  registrations,
  statusToneMap
} from "@/data/mock";
import { formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  Badge,
  Button,
  DataTable,
  Field,
  FilterBar,
  InfoNote,
  PageHeader,
  SectionCard,
  SelectField,
  StatCard,
  TextAreaField
} from "@/components/ui";
import { AttachmentUploader } from "@/components/attachment-uploader";

export default function CollectionsPage() {
  const totalCollected = collections.reduce((sum, item) => sum + item.amountEgp, 0);
  const confirmedCount = collections.filter((item) => item.status === "مؤكدة").length;
  const refundedCount = collections.filter((item) => item.status !== "مؤكدة").length;
  const multiCurrencyCount = collections.filter((item) => item.currency !== "EGP").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="دفتر التحصيلات"
        title="شاشة التحصيلات"
        description="تسجيل كل دفعة فعلية يدفعها العميل كحركة مستقلة مرتبطة بالتسجيل، مع حفظ العملة الأصلية وسعر الصرف ووسيلة التحصيل والطرف المستلم."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير المتحصلات
            </Button>
            <Button href="#create-form" icon="plus">
              تسجيل دفعة جديدة
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي المتحصلات" value={formatMoney(totalCollected, "جنيه مصري")} helper="على جميع وسائل التحصيل" icon="wallet" tone="gold" />
        <StatCard label="عمليات مؤكدة" value={formatNumber(confirmedCount)} helper="حركات فعّالة في الرصيد" icon="collections" tone="success" />
        <StatCard label="مرتبطة باسترداد" value={formatNumber(refundedCount)} helper="جزئي أو كلي" icon="refunds" tone="danger" />
        <StatCard label="عمليات متعددة العملات" value={formatNumber(multiCurrencyCount)} helper="تحتاج توثيق سعر الصرف" icon="trend" tone="info" />
      </section>

      <FilterBar
        filters={[
          { label: "كل التحصيلات", active: true },
          { label: "حسب الدورة" },
          { label: "حسب وسيلة التحصيل" },
          { label: "حسب الطرف المستلم" },
          { label: "حسب العملة" },
          { label: "حسب الحالة" }
        ]}
      >
        <div className="grid gap-3 md:grid-cols-5">
          {["الدورة", "وسيلة التحصيل", "الطرف المستلم", "العملة", "الفترة"].map((filter) => (
            <div key={filter} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
              {filter}
            </div>
          ))}
        </div>
      </FilterBar>

      <SectionCard
        title="جدول التحصيلات"
        description="كل دفعة جديدة تُسجل كحركة منفصلة ولا يتم تعديل الحركات القديمة، مما يحافظ على التاريخ المالي الحقيقي للعميل."
      >
        <DataTable
          columns={[
            "الحركة",
            "التسجيل",
            "العميل",
            "التاريخ",
            "نوع الدفعة",
            "المبلغ الأصلي",
            "سعر الصرف",
            "المعادل بالجنيه",
            "وسيلة التحصيل",
            "الطرف المستلم",
            "الحالة"
          ]}
          rows={collections.map((item) => {
            const registration = registrations.find((reg) => reg.id === item.registrationId);
            const account = accounts.find((account) => account.id === item.accountId);
            return [
              <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
              registration?.code ?? item.registrationId,
              <div key="customer" className="space-y-1">
                <p className="font-black text-white">{registration?.customerName}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {courses.find((course) => course.id === registration?.courseId)?.name ?? "—"}
                </p>
              </div>,
              formatDate(item.date),
              item.paymentType,
              <div key="orig" className="space-y-1">
                <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                <p className="text-xs text-[var(--text-muted)]">الإجمالي قبل الرسوم: {formatMoney(item.grossBeforeFees, item.currency)}</p>
              </div>,
              item.exchangeRate,
              <span key="egp" className="font-black text-white">{formatMoney(item.amountEgp, "جنيه مصري")}</span>,
              account?.name ?? item.accountId,
              account?.name.split("—")[1]?.trim() ?? "—",
              <Badge key="status" label={item.status} tone={statusToneMap[item.status]} />
            ];
          })}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="صافي الصورة النقدية"
          description="الهدف هنا توضيح الفرق بين ما دفعه العميل فعليًا وبين ما صار متاحًا بعد الرسوم."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">إجمالي التحصيل قبل الرسوم</p>
              <p className="mt-2 text-xl font-black">{formatMoney(totalCollected, "جنيه مصري")}</p>
            </div>
            <div className="rounded-[24px] border border-[rgba(251,191,36,0.2)] bg-[var(--warning-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--warning)]">الرسوم المرتبطة</p>
              <p className="mt-2 text-xl font-black">{formatMoney(3947, "جنيه مصري")}</p>
            </div>
            <div className="rounded-[24px] border border-[rgba(52,211,153,0.2)] bg-[var(--success-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--success)]">الصافي المتاح</p>
              <p className="mt-2 text-xl font-black">{formatMoney(totalCollected - 3947, "جنيه مصري")}</p>
            </div>
          </div>
          <div className="mt-4">
            <InfoNote
              title="قاعدة أساسية"
              description="أي مبلغ يدفعه العميل يُسجل أولًا كتحصيل على الوسيلة التي استلمته فعليًا، وأي نقل لاحق إلى الخزنة يسجل كتحويل داخلي منفصل."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="نموذج تسجيل دفعة جديدة"
          description="التصميم يفرض ربط الدفع برقم تسجيل، وتوثيق العملة وسعر الصرف والطرف المستلم."
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <SelectField label="رقم التسجيل" options={registrations.map((registration) => registration.code)} />
            <Field label="التاريخ" type="date" />
            <SelectField label="نوع الدفعة" options={["مقدم", "دفعة جزئية", "استكمال", "سداد كامل", "تحويل رصيد"]} />
            <Field label="المبلغ الأصلي" type="number" placeholder="500" />
            <SelectField label="العملة" options={["جنيه مصري", "درهم إماراتي", "ريال سعودي"]} defaultValue="درهم إماراتي" />
            <Field label="سعر الصرف" type="number" placeholder="13.35" />
            <Field label="القيمة المعادلة بالجنيه" type="number" placeholder="6675" />
            <SelectField label="وسيلة التحصيل" options={accounts.map((account) => account.name)} />
            <SelectField label="الطرف المستلم" options={["حمادة", "أمل", "سارة", "أحمد", "المحاسب"]} />
            <Field label="المبلغ المتوقع قبل الرسوم" type="number" placeholder="500" />
            <SelectField label="حالة الحركة" options={["مؤكدة", "ملغاة", "مستردة جزئيًا", "مستردة كليًا"]} defaultValue="مؤكدة" />
            <div className="md:col-span-2">
              <TextAreaField label="ملاحظات" placeholder="مثال: دفعة أولى، إثبات سداد مرفوع، أو ملاحظة على رسوم متوقعة." />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ الدفعة</Button>
              <Button variant="secondary">حفظ وإضافة رسوم لاحقًا</Button>
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