import { notFound } from "next/navigation";
import Link from "next/link";
import {
  courses,
  getSalesRep,
  registrationCollections,
  registrationRefunds,
  registrations,
  registrationTransferHistory,
  salesReps,
  statusToneMap
} from "@/data/mock";
import { formatCurrencyLabel, formatDate, formatMoney, formatPercent } from "@/lib/utils";
import {
  Badge,
  Button,
  DataTable,
  KeyValueGrid,
  PageHeader,
  SectionCard,
  StatCard
} from "@/components/ui";

export default async function RegistrationDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registration = registrations.find((item) => item.id === id);

  if (!registration) {
    notFound();
  }

  const course = courses.find((item) => item.id === registration.courseId);
  const rep = salesReps.find((item) => item.id === registration.salesRepId);
  const collections = registrationCollections(registration.id);
  const refunds = registrationRefunds(registration.id);
  const transfers = registrationTransferHistory(registration.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={registration.code}
        title={registration.customerName}
        description={`تسجيل مرتبط بدورة ${course?.name ?? registration.courseId} — تم حفظ سعر البيع الفعلي والعمولة وقت إنشاء الصفقة.`}
        actions={
          <>
            <Badge label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />
            <Badge label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} />
            <Button href="/registrations" variant="secondary">
              العودة إلى التسجيلات
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {["نظرة عامة", "التحصيلات", "الاستردادات", "سجل التحويل", "العمولة", "الملاحظات"].map(
            (tab, index) => {
              const ids = ["overview", "collections", "refunds", "transfers", "commission", "notes"];
              return (
                <Link
                  key={tab}
                  href={`#${ids[index]}`}
                  className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/4 px-4 text-sm font-bold text-[var(--text-secondary)] transition hover:border-[rgba(85,198,213,0.22)] hover:bg-white/6 hover:text-white"
                >
                  {tab}
                </Link>
              );
            }
          )}
        </div>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="سعر البيع الفعلي" value={formatMoney(registration.soldPrice, registration.currency)} helper={formatMoney(registration.soldPriceEgp, "جنيه مصري")} icon="wallet" tone="gold" />
        <StatCard label="إجمالي المدفوع" value={formatMoney(registration.totalPaid, registration.currency)} helper={formatMoney(registration.totalPaidEgp, "جنيه مصري")} icon="collections" tone="success" />
        <StatCard label="المتبقي" value={formatMoney(registration.remainingEgp, "جنيه مصري")} helper={registration.remaining === 0 ? "لا يوجد رصيد متبقٍ" : formatMoney(registration.remaining, registration.currency)} icon="trend" tone={registration.remainingEgp > 0 ? "warning" : "success"} />
        <StatCard label="العمولة المتوقعة" value={formatMoney(registration.expectedCommissionEgp, "جنيه مصري")} helper={`${formatPercent(registration.commissionRate)} من سعر البيع`} icon="team" tone="info" />
        <StatCard label="العمولة المستحقة" value={formatMoney(registration.eligibleCommissionEgp, "جنيه مصري")} helper={registration.commissionStatus} icon="spark" tone={registration.eligibleCommissionEgp > 0 ? "gold" : "neutral"} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <SectionCard
          title="نظرة عامة"
          description="البيانات الأساسية للعميل والتسجيل والتسعير."
          className="anchor-section"
        >
          <div id="overview" className="space-y-5">
            <KeyValueGrid
              items={[
                { label: "رقم التسجيل", value: registration.code },
                { label: "تاريخ التسجيل", value: formatDate(registration.date) },
                { label: "اسم العميل", value: registration.customerName },
                { label: "الهاتف", value: registration.phone },
                { label: "الدولة / المدينة", value: `${registration.country} — ${registration.city}` },
                { label: "مصدر العميل", value: registration.source },
                { label: "الدورة", value: course?.name ?? registration.courseId },
                { label: "موظف المبيعات", value: rep?.name ?? registration.salesRepId }
              ]}
            />
            <KeyValueGrid
              items={[
                { label: "السعر القياسي", value: formatMoney(registration.standardPrice, registration.currency) },
                { label: "سعر البيع الفعلي", value: formatMoney(registration.soldPrice, registration.currency) },
                { label: "الخصم", value: formatMoney(registration.discount, registration.currency) },
                { label: "العملة", value: formatCurrencyLabel(registration.currency) },
                { label: "حالة السداد", value: <Badge label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} /> },
                { label: "حالة التسجيل", value: <Badge label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} /> },
                { label: "إجمالي المدفوع", value: formatMoney(registration.totalPaidEgp, "جنيه مصري") },
                { label: "إجمالي المتبقي", value: formatMoney(registration.remainingEgp, "جنيه مصري") }
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="التحصيلات"
          description="كل دفعة مرتبطة بالتسجيل كسجل مستقل، ولا يتم تعديل الدفعات القديمة."
          className="anchor-section"
        >
          <div id="collections">
            <DataTable
              columns={["الحركة", "التاريخ", "نوع الدفعة", "القيمة الأصلية", "المعادل بالجنيه", "الحالة", "ملاحظات"]}
              rows={collections.map((item) => [
                <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
                formatDate(item.date),
                item.paymentType,
                <div key="amount" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">سعر الصرف: {item.exchangeRate}</p>
                </div>,
                <span key="egp" className="font-black text-white">{formatMoney(item.amountEgp, "جنيه مصري")}</span>,
                <Badge key="status" label={item.status} tone={statusToneMap[item.status]} />,
                item.notes
              ])}
            />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <SectionCard
          title="الاستردادات"
          description="أي مبلغ تم رده للعميل يسجل كاسترداد مرتبط بالتسجيل الأصلي وليس كمصروف."
          className="anchor-section"
        >
          <div id="refunds">
            {refunds.length ? (
              <DataTable
                compact
                columns={["الاسترداد", "التاريخ", "النوع", "القيمة", "السبب", "ملاحظات"]}
                rows={refunds.map((item) => [
                  <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
                  formatDate(item.date),
                  <Badge key="type" label={item.refundType} tone={item.refundType === "كلي" ? "danger" : "warning"} />,
                  <div key="amount" className="space-y-1">
                    <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatMoney(item.amountEgp, "جنيه مصري")}</p>
                  </div>,
                  item.reason,
                  item.notes
                ])}
              />
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/12 bg-white/3 px-5 py-8 text-center text-sm text-[var(--text-secondary)]">
                لا توجد استردادات مرتبطة بهذا التسجيل حتى الآن.
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="سجل التحويل"
          description="يدعم النظام تحويل التسجيل من دورة إلى أخرى مع الحفاظ على أثر الرصيد والمدفوعات السابقة."
          className="anchor-section"
        >
          <div id="transfers">
            {transfers.length ? (
              <DataTable
                compact
                columns={["الحركة", "من", "إلى", "الرصيد المحول", "السبب", "التاريخ"]}
                rows={transfers.map((item) => {
                  const fromCourse = courses.find((course) => course.id === item.originalCourseId);
                  const toCourse = courses.find((course) => course.id === item.newCourseId);

                  return [
                    <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
                    fromCourse?.name ?? item.originalCourseId,
                    toCourse?.name ?? item.newCourseId,
                    <div key="amount" className="space-y-1">
                      <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatMoney(item.amountEgp, "جنيه مصري")}</p>
                    </div>,
                    item.reason,
                    formatDate(item.date)
                  ];
                })}
              />
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/12 bg-white/3 px-5 py-8 text-center text-sm text-[var(--text-secondary)]">
                لا يوجد تاريخ تحويل مرتبط بهذا التسجيل.
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="العمولة"
          description="يوضح الفرق بين المتوقعة / المستحقة / المصروفة داخل نفس التسجيل."
          className="anchor-section"
        >
          <div id="commission" className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">العمولة المتوقعة</p>
              <p className="mt-2 text-xl font-black">{formatMoney(registration.expectedCommissionEgp, "جنيه مصري")}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                تم احتسابها عند تسجيل الصفقة بنسبة {formatPercent(registration.commissionRate)} من سعر البيع الفعلي.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(200,168,106,0.18)] bg-[var(--brand-gold-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">العمولة المستحقة</p>
              <p className="mt-2 text-xl font-black">{formatMoney(registration.eligibleCommissionEgp, "جنيه مصري")}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                تتحول إلى مستحقة فقط بعد تحقق الشرطين: اكتمال السداد وانعقاد الدورة.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(52,211,153,0.2)] bg-[var(--success-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--success)]">العمولة المصروفة</p>
              <p className="mt-2 text-xl font-black">{formatMoney(registration.paidCommissionEgp, "جنيه مصري")}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                يظهر فقط إذا تم صرف العمولة فعليًا بعد المراجعة النهائية.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">الحالة الحالية</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={registration.commissionStatus} tone={statusToneMap[registration.commissionStatus]} />
                <Badge label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />
                <Badge label={course?.status ?? "مخطط"} tone={statusToneMap[course?.status ?? "مخطط"]} />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="الملاحظات"
          description="الملاحظات التنفيذية والتجارية المرتبطة بالصفقة."
          className="anchor-section"
        >
          <div id="notes" className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-sm leading-8 text-[var(--text-secondary)]">{registration.notes}</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
