import {
  accounts,
  collections,
  courses,
  dashboardAlerts,
  dashboardMetrics,
  fees,
  internalTransfers,
  monthlyCollectionsTrend,
  quickActions,
  refunds,
  registrations,
  salesReps,
  statusToneMap
} from "@/data/mock";
import { formatDate, formatMoney, formatNumber, sum } from "@/lib/utils";
import {
  Badge,
  BarList,
  Button,
  DataTable,
  EmptyState,
  FilterBar,
  PageHeader,
  QuickActionStrip,
  SectionCard,
  Sparkline,
  StatCard
} from "@/components/ui";
import Link from "next/link";

export default function OverviewPage() {
  const recentCollections = [...collections].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentRefunds = [...refunds].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const recentTransfers = [...internalTransfers].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const recentExpenses = [...fees].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const pendingRegistrations = registrations
    .filter((item) => item.remainingEgp > 0 || item.registrationStatus === "مبدئي")
    .slice(0, 6);

  const upcomingCourses = [...courses]
    .filter((item) => item.status !== "انعقدت" && item.status !== "ألغيت")
    .sort((a, b) => a.expectedStart.localeCompare(b.expectedStart))
    .slice(0, 5);

  const accountDistribution = accounts.map((account) => ({
    label: account.name,
    value: formatMoney(account.balanceEgp, "جنيه مصري"),
    percent: (account.balanceEgp / dashboardMetrics.totalCenterFundsEgp) * 100,
    tone:
      account.id === "acc-cashbox"
        ? "gold"
        : account.type === "منصة دفع"
          ? "cyan"
          : account.type === "بنك"
            ? "success"
            : "danger"
  })) as Array<{ label: string; value: string; percent: number; tone: "gold" | "cyan" | "success" | "danger" }>;

  const coursePerformance = [...courses]
    .sort((a, b) => b.collectedEgp - a.collectedEgp)
    .slice(0, 4);

  const pendingBalances = registrations
    .filter((item) => item.remainingEgp > 0)
    .sort((a, b) => b.remainingEgp - a.remainingEgp)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="لوحة المتابعة التنفيذية"
        title="لوحة التحكم الرئيسية"
        description="نظرة موحدة على أموال المركز، حالة الدورات، التدفقات النقدية، ورسوم التحصيل مع مؤشرات تساعد الإدارة والمحاسب على اتخاذ القرار بسرعة."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              فتح التقارير
            </Button>
            <Button href="/registrations#create-form" icon="plus">
              إنشاء تسجيل جديد
            </Button>
          </>
        }
      >
        <QuickActionStrip actions={quickActions} />
      </PageHeader>

      <FilterBar
        filters={[
          { label: "هذا الشهر", active: true },
          { label: "الربع الحالي" },
          { label: "الدورات المفتوحة" },
          { label: "المتحصلات" },
          { label: "المصروفات" },
          { label: "العمولات" }
        ]}
      >
        <div className="grid gap-3 md:grid-cols-4">
          {[
            "مراجعة التسجيلات غير المكتملة",
            "متابعة توريدات الخزنة",
            "فحص رسوم التحصيل",
            "استحقاق عمولات المبيعات"
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-[13px] text-[var(--text-secondary)]">
              {item}
            </div>
          ))}
        </div>
      </FilterBar>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="إجمالي أموال المركز"
          value={formatMoney(dashboardMetrics.totalCenterFundsEgp, "جنيه مصري")}
          helper="مجمعة بين الخزنة والحسابات"
          delta="يشمل ما لدى الأطراف ووسائل التحصيل"
          icon="wallet"
          tone="gold"
        />
        <StatCard
          label="رصيد الخزنة"
          value={formatMoney(dashboardMetrics.cashboxBalanceEgp, "جنيه مصري")}
          helper="الرصيد الفعلي داخل المركز"
          delta="لا يتغير إلا بالحركات الداخلة والخارجة فعليًا"
          icon="cash"
          tone="success"
        />
        <StatCard
          label="إجمالي المبيعات"
          value={formatMoney(dashboardMetrics.totalSalesEgp, "جنيه مصري")}
          helper="قيمة البيع الفعلي للتسجيلات"
          delta="المقياس المعتمد لاحتساب العمولة المتوقعة"
          icon="trend"
          tone="info"
        />
        <StatCard
          label="إجمالي الاستردادات"
          value={formatMoney(dashboardMetrics.totalRefundsEgp, "جنيه مصري")}
          helper="مرتبطة بالتسجيلات الأصلية"
          delta="لا تُسجل كمصروف عادي"
          icon="refunds"
          tone="danger"
        />
        <StatCard
          label="عمولات مستحقة"
          value={formatMoney(dashboardMetrics.eligibleCommissionsEgp, "جنيه مصري")}
          helper="بعد اكتمال السداد وانعقاد الدورة"
          delta={`${formatNumber(dashboardMetrics.fullyPaidRegistrations)} تسجيلات مدفوعة بالكامل`}
          icon="team"
          tone="gold"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="اتجاه المتحصلات والرسوم والاستردادات"
          description="يظهر اتجاه الأشهر الأخيرة كيف يتحرك إجمالي التحصيل قبل الرسوم مقابل الرسوم والاستردادات، مع تمييز الأثر على الصافي المتاح."
        >
          <div className="space-y-6">
            <Sparkline values={monthlyCollectionsTrend.map((item) => item.collected)} />
            <div className="grid gap-3 md:grid-cols-6">
              {monthlyCollectionsTrend.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-black text-white">
                    {formatMoney(item.collected, "جنيه مصري")}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
                    رسوم: {formatMoney(item.fees, "جنيه مصري")}
                    <br />
                    استردادات: {formatMoney(item.refunds, "جنيه مصري")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="توزيع الأرصدة على وسائل التحصيل"
          description="التمييز هنا مهم لأن الرصيد الموجود في الوسائل لا يعني بالضرورة أنه دخل الخزنة."
          action={<Badge label={`${accounts.length} حسابات فعالة`} tone="info" />}
        >
          <BarList items={accountDistribution} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="لقطة أداء الدورات"
          description="أكثر الدورات تأثيرًا على التحصيل في المرحلة الحالية، مع توضيح حالة كل دورة وعدد المسددين بالكامل."
        >
          <div className="grid gap-4">
            {coursePerformance.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="rounded-[24px] border border-white/8 bg-white/4 p-5 transition hover:border-[rgba(85,198,213,0.22)] hover:bg-white/6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-black">{course.name}</h3>
                      <Badge
                        label={course.status}
                        tone={statusToneMap[course.status]}
                      />
                    </div>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {course.notes}
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm text-[var(--text-secondary)] md:text-left">
                    <p>المتحصلات: <span className="font-black text-white">{formatMoney(course.collectedEgp, "جنيه مصري")}</span></p>
                    <p>التسجيلات: <span className="font-black text-white">{formatNumber(course.registrations)}</span></p>
                    <p>مسددون بالكامل: <span className="font-black text-white">{formatNumber(course.fullyPaid)}</span></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="تنبيهات تشغيلية مهمة"
          description="مؤشرات مركزة لتتبع الحالات التي تحتاج تدخّل من الإدارة أو المحاسب."
        >
          <div className="space-y-4">
            {dashboardAlerts.map((alert) => (
              <div key={alert.title} className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold)]">
                    <span className="text-lg font-black">!</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black">{alert.title}</h3>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-[24px] border border-[rgba(85,198,213,0.18)] bg-[var(--brand-cyan-soft)] p-5">
              <p className="text-sm font-black text-[var(--brand-cyan)]">حالة العمولات</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                العمولة لا تصبح مستحقة إلا عند تحقق شرطين معًا: اكتمال سداد العميل وانعقاد الدورة.
                لذلك تظهر بعض الصفقات كعمولة متوقعة فقط رغم اكتمال تحصيلها.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="آخر التحصيلات"
          description="سجل سريع لأحدث الدفعات المؤكدة أو المرتبطة باسترداد/تحويل."
          action={<Button href="/collections" variant="soft" size="sm" icon="external">عرض الكل</Button>}
        >
          <DataTable
            compact
            columns={["الحركة", "التسجيل", "التاريخ", "القيمة", "الوسيلة", "الحالة"]}
            rows={recentCollections.map((item) => {
              const registration = registrations.find((registration) => registration.id === item.registrationId);
              const account = accounts.find((account) => account.id === item.accountId);
              return [
                <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
                <div key="reg" className="space-y-1">
                  <p className="font-black text-white">{registration?.customerName}</p>
                  <p className="text-xs text-[var(--text-muted)]">{registration?.code}</p>
                </div>,
                formatDate(item.date),
                <div key="amount" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatMoney(item.amountEgp, "جنيه مصري")}</p>
                </div>,
                account?.name ?? item.accountId,
                <Badge key="status" label={item.status} tone={statusToneMap[item.status]} />
              ];
            })}
          />
        </SectionCard>

        <SectionCard
          title="آخر الاستردادات والتحويلات"
          description="منطقة المتابعة اليومية للحركات التي تؤثر على صافي المقبوضات أو حالة التسجيل."
        >
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <p className="mb-3 text-sm font-black">الاستردادات</p>
              <DataTable
                compact
                columns={["العميل", "الدورة", "القيمة", "السبب", "التاريخ"]}
                rows={recentRefunds.map((item) => {
                  const course = courses.find((course) => course.id === item.courseId);
                  return [
                    <span key="customer" className="font-black text-white">{item.customerName}</span>,
                    course?.name ?? item.courseId,
                    <div key="amount" className="space-y-1">
                      <p className="font-black text-white">{formatMoney(item.amountOriginal, item.currency)}</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatMoney(item.amountEgp, "جنيه مصري")}</p>
                    </div>,
                    item.reason,
                    formatDate(item.date)
                  ];
                })}
              />
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <p className="mb-3 text-sm font-black">التحويلات الداخلية</p>
              <DataTable
                compact
                columns={["الحركة", "من", "إلى", "الصافي المورد", "التاريخ"]}
                rows={recentTransfers.map((item) => {
                  const from = accounts.find((account) => account.id === item.fromAccountId);
                  const to = accounts.find((account) => account.id === item.toAccountId);
                  return [
                    <span key="id" className="font-black text-white">{item.id.toUpperCase()}</span>,
                    from?.name ?? item.fromAccountId,
                    to?.name ?? item.toAccountId,
                    <span key="net" className="font-black text-white">
                      {formatMoney(item.netDeliveredEgp, "جنيه مصري")}
                    </span>,
                    formatDate(item.date)
                  ];
                })}
              />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="تسجيلات تحتاج متابعة"
          description="أعلى الأرصدة المتبقية أو التسجيلات غير المدفوعة، مع التركيز على استكمال السداد قبل بدء الدورة."
        >
          {pendingRegistrations.length ? (
            <DataTable
              columns={["العميل", "الدورة", "فريق المبيعات", "المدفوع", "المتبقي", "الحالة"]}
              rows={pendingRegistrations.map((registration) => {
                const course = courses.find((course) => course.id === registration.courseId);
                const rep = salesReps.find((rep) => rep.id === registration.salesRepId);
                return [
                  <Link key="customer" href={`/registrations/${registration.id}`} className="space-y-1">
                    <p className="font-black text-white">{registration.customerName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{registration.code}</p>
                  </Link>,
                  course?.name ?? registration.courseId,
                  rep?.name ?? registration.salesRepId,
                  <div key="paid" className="space-y-1">
                    <p className="font-black text-white">{formatMoney(registration.totalPaidEgp, "جنيه مصري")}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatMoney(registration.totalPaid, registration.currency)}</p>
                  </div>,
                  <span key="remaining" className="font-black text-[var(--warning)]">
                    {formatMoney(registration.remainingEgp, "جنيه مصري")}
                  </span>,
                  <div key="status" className="space-y-2">
                    <Badge label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />
                    <Badge label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} />
                  </div>
                ];
              })}
            />
          ) : (
            <EmptyState
              title="لا توجد تسجيلات معلّقة"
              description="جميع التسجيلات الحالية إما مكتملة أو تم التعامل معها من خلال استرداد أو تحويل."
            />
          )}
        </SectionCard>

        <SectionCard
          title="دورات قريبة من الانطلاق"
          description="الدورات المفتوحة أو تحت التجميع مع نسبة التقدم إلى الحد الأدنى للانعقاد."
        >
          <BarList
            items={upcomingCourses.map((course) => ({
              label: course.name,
              value: `${formatNumber(course.registrations)} / ${formatNumber(course.minParticipants)} متدربين`,
              percent: (course.registrations / course.minParticipants) * 100,
              tone:
                course.status === "اكتمل الحد الأدنى"
                  ? "success"
                  : course.status === "مفتوحة للحجز"
                    ? "cyan"
                    : course.status === "تحت التجميع"
                      ? "gold"
                      : "danger"
            }))}
          />
        </SectionCard>
      </div>
    </div>
  );
}
