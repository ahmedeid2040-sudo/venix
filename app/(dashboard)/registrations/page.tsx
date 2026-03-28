import Link from "next/link";
import {
  commissionStatusOptions,
  courses,
  paymentStatusOptions,
  registrations,
  registrationStatusOptions,
  salesReps,
  statusToneMap
} from "@/data/mock";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/utils";
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

export default function RegistrationsPage() {
  const fullyPaid = registrations.filter((item) => item.paymentStatus === "مدفوع كاملًا").length;
  const openRegistrations = registrations.filter(
    (item) => !["ملغي", "محول", "مكتمل"].includes(item.registrationStatus)
  ).length;
  const pendingBalance = registrations.reduce((sum, item) => sum + item.remainingEgp, 0);
  const awaitingCourse = registrations.filter((item) => item.registrationStatus === "بانتظار انعقاد الدورة").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="سجل التسجيلات الرئيسي"
        title="شاشة تسجيل العميل في دورة"
        description="كل عميل يجب أن يملك سجل تسجيل مستقل لكل اشتراك في دورة، وهذا السجل هو الأصل الذي ترتبط به التحصيلات والاستردادات والعمولات وتحويلات التسجيل."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير التسجيلات
            </Button>
            <Button href="#create-form" icon="plus">
              إنشاء تسجيل جديد
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="تسجيلات مفتوحة" value={formatNumber(openRegistrations)} helper="تحتاج متابعة مالية أو تنفيذية" icon="registrations" tone="info" />
        <StatCard label="مسددون بالكامل" value={formatNumber(fullyPaid)} helper="لا يعني بالضرورة استحقاق العمولة" icon="collections" tone="success" />
        <StatCard label="إجمالي المتبقيات" value={formatMoney(pendingBalance, "جنيه مصري")} helper="المبلغ غير المحصل حتى الآن" icon="wallet" tone="warning" />
        <StatCard label="بانتظار انعقاد الدورة" value={formatNumber(awaitingCourse)} helper="السداد مكتمل لكن التنفيذ لم يبدأ" icon="calendar" tone="gold" />
      </section>

      <FilterBar
        filters={[
          { label: "كل التسجيلات", active: true },
          { label: "مدفوع جزئيًا" },
          { label: "مدفوع كاملًا" },
          { label: "مسترد" },
          { label: "محول" },
          { label: "مبدئي" }
        ]}
      >
        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
            حسب الدورة
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
            حسب موظف المبيعات
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
            حسب العملة
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
            حسب حالة السداد
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-secondary)]">
            من تاريخ / إلى تاريخ
          </div>
        </div>
      </FilterBar>

      <SectionCard
        title="قائمة التسجيلات"
        description="الجدول يحافظ على المنطق المحوري للنظام: التسجيل هو الأصل، وكل ما بعده يرتبط به."
      >
        <DataTable
          columns={[
            "التسجيل",
            "العميل",
            "الدورة",
            "موظف المبيعات",
            "سعر البيع",
            "إجمالي المدفوع",
            "المتبقي",
            "حالة السداد",
            "حالة التسجيل",
            "العمولة",
            "إجراءات"
          ]}
          rows={registrations.map((registration) => {
            const course = courses.find((item) => item.id === registration.courseId);
            const salesRep = salesReps.find((item) => item.id === registration.salesRepId);

            return [
              <Link key="code" href={`/registrations/${registration.id}`} className="space-y-1">
                <p className="font-black text-white">{registration.code}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatDate(registration.date)}</p>
              </Link>,
              <div key="customer" className="space-y-1">
                <p className="font-black text-white">{registration.customerName}</p>
                <p className="text-xs text-[var(--text-muted)]">{registration.phone}</p>
              </div>,
              course?.name ?? registration.courseId,
              salesRep?.name ?? registration.salesRepId,
              <div key="sold" className="space-y-1">
                <p className="font-black text-white">{formatMoney(registration.soldPrice, registration.currency)}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatMoney(registration.soldPriceEgp, "جنيه مصري")}</p>
              </div>,
              <div key="paid" className="space-y-1">
                <p className="font-black text-white">{formatMoney(registration.totalPaid, registration.currency)}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatMoney(registration.totalPaidEgp, "جنيه مصري")}</p>
              </div>,
              <span key="remaining" className="font-black text-[var(--warning)]">
                {formatMoney(registration.remainingEgp, "جنيه مصري")}
              </span>,
              <Badge key="payment" label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />,
              <Badge key="status" label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} />,
              <div key="commission" className="space-y-2">
                <p className="font-black text-white">{formatMoney(registration.expectedCommissionEgp, "جنيه مصري")}</p>
                <Badge label={registration.commissionStatus} tone={statusToneMap[registration.commissionStatus]} />
              </div>,
              <Button key="details" href={`/registrations/${registration.id}`} variant="secondary" size="sm" icon="external">
                التفاصيل
              </Button>
            ];
          })}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SectionCard
          title="نموذج إنشاء / تعديل تسجيل"
          description="يسجل السعر الفعلي، الخصم، موظف المبيعات، ونسبة العمولة الخاصة بالصفقة نفسها."
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <Field label="رقم التسجيل" placeholder="تسج-٢٤١١" />
            <Field label="تاريخ التسجيل" type="date" />
            <Field label="اسم العميل" placeholder="مثال: رانيا أيمن" />
            <Field label="رقم الهاتف" placeholder="05xxxxxxxx" />
            <Field label="الدولة" placeholder="الإمارات / السعودية / مصر" />
            <Field label="المدينة" placeholder="دبي / جدة / القاهرة" />
            <SelectField label="الدورة" options={courses.map((course) => course.name)} />
            <SelectField label="موظف المبيعات" options={salesReps.map((rep) => rep.name)} />
            <Field label="السعر القياسي" type="number" placeholder="2000" />
            <Field label="سعر البيع الفعلي" type="number" placeholder="1800" />
            <Field label="قيمة الخصم" type="number" placeholder="200" />
            <SelectField label="العملة" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="درهم إماراتي" />
            <Field label="نسبة العمولة لهذه الصفقة" type="number" placeholder="3" />
            <Field label="قيمة العمولة المتوقعة" type="number" placeholder="54" />
            <SelectField label="حالة السداد" options={paymentStatusOptions} defaultValue="غير مدفوع" />
            <SelectField label="حالة التسجيل" options={registrationStatusOptions} defaultValue="مبدئي" />
            <div className="md:col-span-2">
              <TextAreaField
                label="ملاحظات"
                placeholder="سبب الخصم، مصدر العميل، توجيهات متابعة، أو أي اعتبارات خاصة بالصفقة."
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ التسجيل</Button>
              <Button variant="secondary">حفظ كمسودة</Button>
              <Button variant="ghost">تحويل إلى دورة أخرى لاحقًا</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="حالات التسجيل المعتمدة"
          description="الفصل بين الحالة المالية والحالة التنفيذية يمنع الالتباس داخل الفريق المالي والإداري."
        >
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-sm font-black">حالات السداد</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {paymentStatusOptions.map((status) => (
                  <Badge key={status} label={status} tone={statusToneMap[status]} />
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-sm font-black">حالات التسجيل التنفيذية</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {registrationStatusOptions.map((status) => (
                  <Badge key={status} label={status} tone={statusToneMap[status]} />
                ))}
              </div>
            </div>
            <InfoNote
              title="قاعدة العمولة"
              description="عند إنشاء التسجيل تُحسب العمولة المتوقعة فقط. لا تنتقل إلى مستحقة قبل اكتمال السداد وانعقاد الدورة."
            />
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