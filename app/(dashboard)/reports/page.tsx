import {
  accounts,
  collections,
  courses,
  dashboardMetrics,
  expenses,
  internalTransfers,
  parties,
  refunds,
  registrations,
  salesReps,
  statusToneMap
} from "@/data/mock";
import { formatMoney, formatNumber } from "@/lib/utils";
import { Badge, DataTable, FilterBar, PageHeader, SectionCard, StatCard } from "@/components/ui";
import { ReportActions } from "@/components/report-actions";

export default function ReportsPage() {
  const courseSummaryRows = courses.map((course) => [
    course.name,
    <Badge key="status" label={course.status} tone={statusToneMap[course.status]} />,
    formatNumber(course.registrations),
    formatNumber(course.fullyPaid),
    formatMoney(course.collectedEgp, "جنيه مصري"),
    formatMoney(
      refunds
        .filter((refund) => refund.courseId === course.id)
        .reduce((sum, refund) => sum + refund.amountEgp, 0),
      "جنيه مصري"
    )
  ]);

  const openRegistrations = registrations.filter((item) => item.remainingEgp > 0);
  const transferredRegistrations = registrations.filter((item) => item.registrationStatus === "محول");
  const refundedRegistrations = registrations.filter((item) => item.paymentStatus.includes("مسترد"));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مركز التقارير التنفيذية"
        title="شاشة التقارير"
        description="مجمّع تقارير احترافي يغطي الدورات، التسجيلات، العمولات، الخزنة، إجمالي أموال المركز، وسائل التحصيل، المصروفات، الاستردادات، والتحويلات الداخلية."
        actions={<ReportActions fileName="تقارير-مركز-فينكس" />}
      />

      <div data-report-root className="space-y-8 report-sheet rounded-[28px] p-0 print:rounded-none print:p-0">
        <FilterBar
          filters={[
            { label: "من تاريخ / إلى تاريخ", active: true },
            { label: "الدورة" },
            { label: "العميل" },
            { label: "موظف المبيعات" },
            { label: "وسيلة التحصيل" },
            { label: "العملة" },
            { label: "الطرف المستلم" },
            { label: "حالة التسجيل" },
            { label: "حالة الدورة" }
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="إجمالي أموال المركز" value={formatMoney(dashboardMetrics.totalCenterFundsEgp, "جنيه مصري")} helper="صورة كاملة لأموال المركز أينما كانت" icon="wallet" tone="gold" />
          <StatCard label="إجمالي المتحصلات" value={formatMoney(dashboardMetrics.totalCollectionsEgp, "جنيه مصري")} helper="كل التحصيلات المؤكدة" icon="collections" tone="info" />
          <StatCard label="إجمالي الاستردادات" value={formatMoney(dashboardMetrics.totalRefundsEgp, "جنيه مصري")} helper="مرتبطة بالتسجيلات الأصلية" icon="refunds" tone="danger" />
          <StatCard label="إجمالي رسوم التحصيل" value={formatMoney(dashboardMetrics.totalCollectionFeesEgp, "جنيه مصري")} helper="لتفسير صافي المتاح" icon="fees" tone="warning" />
          <StatCard label="عمولات مستحقة" value={formatMoney(dashboardMetrics.eligibleCommissionsEgp, "جنيه مصري")} helper="جاهزة للترحيل بعد تحقق الشروط" icon="team" tone="success" />
        </section>

        <div className="grid gap-6">
          <SectionCard title="تقارير الدورات" description="حالة كل دورة وعدد التسجيلات والمتحصلات والاستردادات.">
            <DataTable
              columns={["الدورة", "الحالة", "عدد التسجيلات", "مسددون كاملًا", "إجمالي المتحصلات", "إجمالي الاستردادات"]}
              rows={courseSummaryRows}
            />
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <SectionCard title="تقارير التسجيلات والعملاء" description="التسجيلات المفتوحة والعملاء الذين عليهم متبقيات أو تم تحويلهم أو استردادهم.">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                  <p className="text-[11px] font-black text-[var(--text-muted)]">التسجيلات المفتوحة</p>
                  <p className="mt-2 text-2xl font-black">{formatNumber(openRegistrations.length)}</p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                  <p className="text-[11px] font-black text-[var(--text-muted)]">عملاء مستردون</p>
                  <p className="mt-2 text-2xl font-black">{formatNumber(refundedRegistrations.length)}</p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                  <p className="text-[11px] font-black text-[var(--text-muted)]">محولون بين الدورات</p>
                  <p className="mt-2 text-2xl font-black">{formatNumber(transferredRegistrations.length)}</p>
                </div>
              </div>
              <div className="mt-5">
                <DataTable
                  compact
                  columns={["العميل", "الدورة", "المتبقي", "حالة السداد", "حالة التسجيل"]}
                  rows={openRegistrations.slice(0, 6).map((registration) => [
                    registration.customerName,
                    courses.find((course) => course.id === registration.courseId)?.name ?? registration.courseId,
                    <span key="remaining" className="font-black text-[var(--warning)]">{formatMoney(registration.remainingEgp, "جنيه مصري")}</span>,
                    <Badge key="payment" label={registration.paymentStatus} tone={statusToneMap[registration.paymentStatus]} />,
                    <Badge key="status" label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} />
                  ])}
                />
              </div>
            </SectionCard>

            <SectionCard title="تقرير عمولات موظفي المبيعات" description="يوضح الفارق بين العمولة المتوقعة والمستحقة والمصروفة والملغاة على مستوى كل موظف.">
              <DataTable
                compact
                columns={["الموظف", "التسجيلات", "المبيعات", "المتوقعة", "المستحقة", "المصروفة", "الملغاة"]}
                rows={salesReps.map((rep) => [
                  rep.name,
                  formatNumber(rep.registrations),
                  formatMoney(rep.salesEgp, "جنيه مصري"),
                  formatMoney(rep.expectedCommissionEgp, "جنيه مصري"),
                  formatMoney(rep.eligibleCommissionEgp, "جنيه مصري"),
                  formatMoney(rep.paidCommissionEgp, "جنيه مصري"),
                  formatMoney(rep.cancelledCommissionEgp, "جنيه مصري")
                ])}
              />
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <SectionCard title="تقرير الخزنة" description="الرصيد الافتتاحي والداخل والخارج والحالي مع كشف الحركة.">
              <div className="grid gap-4 md:grid-cols-4">
                <StatCard label="الرصيد الافتتاحي" value={formatMoney(52000, "جنيه مصري")} helper="رصيد بداية الفترة" icon="cash" tone="neutral" />
                <StatCard label="الداخل" value={formatMoney(internalTransfers.filter((item) => item.toAccountId === "acc-cashbox").reduce((sum, item) => sum + item.netDeliveredEgp, 0), "جنيه مصري")} helper="توريدات إلى الخزنة" icon="collections" tone="success" />
                <StatCard label="الخارج" value={formatMoney(expenses.filter((item) => item.paidFromAccountId === "acc-cashbox").reduce((sum, item) => sum + item.amountEgp, 0), "جنيه مصري")} helper="مصروفات خرجت من الخزنة" icon="expenses" tone="warning" />
                <StatCard label="الرصيد الحالي" value={formatMoney(accounts.find((account) => account.id === "acc-cashbox")?.balanceEgp ?? 0, "جنيه مصري")} helper="الرصيد الفعلي" icon="wallet" tone="gold" />
              </div>
            </SectionCard>

            <SectionCard title="تقرير إجمالي أموال المركز" description="يربط الخزنة بكل وسيلة تحصيل في صورة مجمعة وواضحة.">
              <DataTable
                compact
                columns={["الوسيلة", "الرصيد الحالي", "إجمالي التحصيلات", "إجمالي الرسوم", "ما تم تحويله", "عدد العمليات"]}
                rows={accounts.map((account) => [
                  account.name,
                  formatMoney(account.balanceEgp, "جنيه مصري"),
                  formatMoney(account.totalCollectedEgp, "جنيه مصري"),
                  formatMoney(account.feesEgp, "جنيه مصري"),
                  formatMoney(account.transferredToCashEgp, "جنيه مصري"),
                  formatNumber(
                    collections.filter((collection) => collection.accountId === account.id).length +
                      internalTransfers.filter((transfer) => transfer.fromAccountId === account.id || transfer.toAccountId === account.id).length
                  )
                ])}
              />
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
            <SectionCard title="تقرير المصروفات" description="حسب النوع والفترة والطرف الدافع والعملة.">
              <DataTable
                compact
                columns={["التصنيف", "الإجمالي", "عدد الحركات"]}
                rows={["تأسيس", "أصل", "تشغيل", "رسوم تحصيل"].map((item) => [
                  item,
                  formatMoney(
                    expenses.filter((expense) => expense.mainClass === item).reduce((sum, expense) => sum + expense.amountEgp, 0),
                    "جنيه مصري"
                  ),
                  formatNumber(expenses.filter((expense) => expense.mainClass === item).length)
                ])}
              />
            </SectionCard>

            <SectionCard title="تقرير الاستردادات والتحويلات الداخلية" description="من أين خرجت الأموال، ولأي سبب، وما الصافي المورّد بعد الرسوم.">
              <DataTable
                compact
                columns={["نوع التقرير", "الإجمالي", "عدد الحركات"]}
                rows={[
                  ["الاستردادات", formatMoney(refunds.reduce((sum, refund) => sum + refund.amountEgp, 0), "جنيه مصري"), formatNumber(refunds.length)],
                  ["التحويلات الداخلية", formatMoney(internalTransfers.reduce((sum, transfer) => sum + transfer.netDeliveredEgp, 0), "جنيه مصري"), formatNumber(internalTransfers.length)],
                  ["التحويلات إلى الخزنة", formatMoney(internalTransfers.filter((transfer) => transfer.toAccountId === "acc-cashbox").reduce((sum, transfer) => sum + transfer.netDeliveredEgp, 0), "جنيه مصري"), formatNumber(internalTransfers.filter((transfer) => transfer.toAccountId === "acc-cashbox").length)]
                ]}
              />
            </SectionCard>
          </div>

          <SectionCard title="تقرير الأرصدة لدى الأطراف" description="ما يوجد لدى كل طرف، وما تم توريده، وما ما زال يحتاج إلى تسوية.">
            <DataTable
              columns={["الطرف", "ما لديه للمركز", "ما دفعه من جيبه", "تمت تسويته", "المتبقي للتسوية", "الحسابات المرتبطة"]}
              rows={parties.map((party) => [
                party.name,
                formatMoney(party.fundsHeldEgp, "جنيه مصري"),
                formatMoney(party.personalSpendEgp, "جنيه مصري"),
                formatMoney(party.settledEgp, "جنيه مصري"),
                formatMoney(party.outstandingEgp, "جنيه مصري"),
                formatNumber(party.linkedAccountIds.length)
              ])}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
