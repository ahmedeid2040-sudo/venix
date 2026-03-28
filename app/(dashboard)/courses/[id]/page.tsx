import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collections,
  courseRegistrations,
  courses,
  refunds,
  statusToneMap
} from "@/data/mock";
import { formatCurrencyLabel, formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  Badge,
  Button,
  DataTable,
  KeyValueGrid,
  PageHeader,
  SectionCard,
  StatCard
} from "@/components/ui";

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((item) => item.id === id);

  if (!course) {
    notFound();
  }

  const registrations = courseRegistrations(course.id);
  const relatedCollections = collections.filter((item) =>
    registrations.some((registration) => registration.id === item.registrationId)
  );
  const relatedRefunds = refunds.filter((item) => item.courseId === course.id);
  const minProgress = Math.round((course.registrations / course.minParticipants) * 100);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={course.code}
        title={course.name}
        description={course.notes}
        actions={
          <>
            <Badge label={course.status} tone={statusToneMap[course.status]} />
            <Button href="/courses" variant="secondary">
              العودة إلى الدورات
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="التسجيلات"
          value={formatNumber(course.registrations)}
          helper="إجمالي المسجلين على الدورة"
          icon="registrations"
          tone="info"
        />
        <StatCard
          label="مسددون بالكامل"
          value={formatNumber(course.fullyPaid)}
          helper="ينعكس على الجاهزية المالية"
          icon="collections"
          tone="success"
        />
        <StatCard
          label="إجمالي المتحصلات"
          value={formatMoney(course.collectedEgp, "جنيه مصري")}
          helper="بعملة التقرير الرئيسية"
          icon="wallet"
          tone="gold"
        />
        <StatCard
          label="الاستردادات المرتبطة"
          value={formatMoney(relatedRefunds.reduce((sum, item) => sum + item.amountEgp, 0), "جنيه مصري")}
          helper="تعكس الإلغاء أو الانسحاب"
          icon="refunds"
          tone="danger"
        />
        <StatCard
          label="التقدم إلى الحد الأدنى"
          value={`${formatNumber(minProgress)}%`}
          helper={`${formatNumber(course.registrations)} من ${formatNumber(course.minParticipants)} متدربين`}
          icon="trend"
          tone={minProgress >= 100 ? "success" : minProgress >= 70 ? "gold" : "warning"}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="بيانات الدورة"
          description="الخصائص الأساسية التي يعتمد عليها التسعير والتشغيل وحالة الانعقاد."
        >
          <KeyValueGrid
            items={[
              { label: "كود الدورة", value: course.code },
              { label: "السعر القياسي", value: formatMoney(course.standardPrice, course.currency) },
              { label: "العملة الأساسية", value: formatCurrencyLabel(course.currency) },
              { label: "الحد الأدنى للانعقاد", value: `${formatNumber(course.minParticipants)} متدربين` },
              { label: "البداية المتوقعة", value: formatDate(course.expectedStart) },
              { label: "النهاية المتوقعة", value: formatDate(course.expectedEnd) },
              { label: "الحالة", value: <Badge label={course.status} tone={statusToneMap[course.status]} /> },
              { label: "إجراءات مفضلة", value: "تغيير حالة / أرشفة / عرض التسجيلات" }
            ]}
          />
        </SectionCard>

        <SectionCard
          title="سجل التسجيلات المرتبطة"
          description="كل تسجيل يمثل الأصل الذي ترتبط به التحصيلات والاستردادات والعمولات."
        >
          <DataTable
            columns={["التسجيل", "العميل", "المدفوع", "المتبقي", "حالة السداد", "العمولة"]}
            rows={registrations.map((registration) => [
              <Link key="reg" href={`/registrations/${registration.id}`} className="font-black text-white">
                {registration.code}
              </Link>,
              <div key="customer" className="space-y-1">
                <p className="font-black text-white">{registration.customerName}</p>
                <p className="text-xs text-[var(--text-muted)]">{registration.phone}</p>
              </div>,
              <div key="paid" className="space-y-1">
                <p className="font-black text-white">{formatMoney(registration.totalPaidEgp, "جنيه مصري")}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatMoney(registration.totalPaid, registration.currency)}
                </p>
              </div>,
              <span key="remaining" className="font-black text-[var(--warning)]">
                {formatMoney(registration.remainingEgp, "جنيه مصري")}
              </span>,
              <div key="status" className="space-y-2">
                <Badge label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />
                <Badge label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} />
              </div>,
              <div key="commission" className="space-y-2">
                <p className="font-black text-white">{formatMoney(registration.expectedCommissionEgp, "جنيه مصري")}</p>
                <Badge label={registration.commissionStatus} tone={statusToneMap[registration.commissionStatus]} />
              </div>
            ])}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="أحدث التحصيلات المرتبطة بالدورة"
          description="مفيدة لمراجعة تواريخ التحصيل ووسائل الاستلام الفعلية."
        >
          <DataTable
            compact
            columns={["الحركة", "التسجيل", "التاريخ", "القيمة", "الحالة"]}
            rows={relatedCollections.slice(0, 6).map((item) => {
              const registration = registrations.find((registration) => registration.id === item.registrationId);
              return [
                <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
                registration?.code ?? item.registrationId,
                formatDate(item.date),
                <div key="amount" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatMoney(item.amountEgp, "جنيه مصري")}</p>
                </div>,
                <Badge key="status" label={item.status} tone={statusToneMap[item.status]} />
              ];
            })}
          />
        </SectionCard>

        <SectionCard
          title="تغييرات الحالة المقترحة"
          description="النظام يفضّل تغيير الحالة بدل حذف السجل للحفاظ على أثر الأعمال."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {["مفتوحة للحجز", "تحت التجميع", "اكتمل الحد الأدنى", "انعقدت", "مؤجلة", "ألغيت"].map(
              (status) => (
                <div key={status} className="rounded-[24px] border border-white/8 bg-white/4 p-4">
                  <Badge label={status} tone={statusToneMap[status]} />
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    استخدم هذا التحويل عندما يتغير وضع التشغيل الحقيقي للدورة أو حالة انعقادها.
                  </p>
                </div>
              )
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
