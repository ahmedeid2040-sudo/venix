import Link from "next/link";
import { parties, statusToneMap } from "@/data/mock";
import { formatMoney, formatNumber } from "@/lib/utils";
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

export default function PartiesPage() {
  const totalFundsHeld = parties.reduce((sum, item) => sum + item.fundsHeldEgp, 0);
  const totalPersonalSpend = parties.reduce((sum, item) => sum + item.personalSpendEgp, 0);
  const totalSettled = parties.reduce((sum, item) => sum + item.settledEgp, 0);
  const totalOutstanding = parties.reduce((sum, item) => sum + item.outstandingEgp, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="الأطراف والأرصدة المالية"
        title="شاشة الأطراف / الأشخاص"
        description="تجمع الأطراف المؤثرة ماليًا في المرحلة الأولى مثل حمادة وأمل وسارة وأحمد والمحاسب، مع الأدوار المحاسبية والحسابات المرتبطة والأرصدة الجاريّة."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير الأطراف
            </Button>
            <Button href="#create-form" icon="plus">
              إضافة طرف
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="أموال لدى الأطراف" value={formatMoney(totalFundsHeld, "جنيه مصري")} helper="ما زال خارج الخزنة" icon="wallet" tone="gold" />
        <StatCard label="دفع من الجيب" value={formatMoney(totalPersonalSpend, "جنيه مصري")} helper="مصروفات لصالح المركز" icon="expenses" tone="warning" />
        <StatCard label="تمت تسويته" value={formatMoney(totalSettled, "جنيه مصري")} helper="مبالغ تم إقفالها محاسبيًا" icon="spark" tone="success" />
        <StatCard label="متبقي للتسوية" value={formatMoney(totalOutstanding, "جنيه مصري")} helper="جاري شركاء / عهد" icon="trend" tone="danger" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <SectionCard
          title="قائمة الأطراف"
          description="يمكن للطرف أن يحمل أكثر من دور محاسبي في الوقت نفسه."
        >
          <DataTable
            columns={["الطرف", "الصفة الإدارية", "الأدوار المالية", "الحسابات المرتبطة", "ما لديه للمركز", "ما دفعه من جيبه", "المتبقي للتسوية", "الحالة", "إجراءات"]}
            rows={parties.map((party) => {
              const roleLabels = [
                party.isPartner ? "شريك" : null,
                party.isFunder ? "ممّول" : null,
                party.receivesMoney ? "مستلم أموال" : null,
                party.paysExpenses ? "دافع مصروفات" : null,
                party.ownsCollectionAccount ? "صاحب وسيلة تحصيل" : null,
                party.hasRunningBalance ? "له جاري / عهدة" : null
              ].filter(Boolean);

              return [
                <div key="name" className="space-y-1">
                  <p className="font-black text-white">{party.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{party.code}</p>
                </div>,
                party.adminRole,
                <div key="roles" className="flex flex-wrap gap-2">
                  {roleLabels.map((role) => (
                    <Badge key={role} label={role as string} tone="info" />
                  ))}
                </div>,
                <span key="accounts" className="text-sm text-[var(--text-secondary)]">{formatNumber(party.linkedAccountIds.length)} حسابات</span>,
                <span key="held" className="font-black text-white">{formatMoney(party.fundsHeldEgp, "جنيه مصري")}</span>,
                <span key="spend" className="font-black text-white">{formatMoney(party.personalSpendEgp, "جنيه مصري")}</span>,
                <span key="outstanding" className="font-black text-[var(--warning)]">{formatMoney(party.outstandingEgp, "جنيه مصري")}</span>,
                <Badge key="status" label={party.status} tone={statusToneMap[party.status]} />,
                <Button key="details" href={`/parties/${party.id}`} variant="secondary" size="sm" icon="external">
                  التفاصيل
                </Button>
              ];
            })}
          />
        </SectionCard>

        <SectionCard
          title="أدوار محاسبية ممكنة"
          description="تتكرر عبر الأطراف المختلفة، ولذلك صممت الواجهة لتقبل تعدد الأدوار لنفس الشخص."
        >
          <div className="grid gap-3">
            {[
              "شريك",
              "ممّول",
              "مستلم أموال",
              "دافع مصروفات",
              "صاحب وسيلة تحصيل",
              "صاحب عهدة",
              "له رصيد جاري مع المركز",
              "مستخدم داخلي للنظام"
            ].map((role) => (
              <div key={role} className="rounded-[24px] border border-white/8 bg-white/4 px-4 py-3">
                <span className="font-black text-white">{role}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="نموذج إضافة / تعديل طرف"
        description="مصمم للأطراف المؤثرة ماليًا، وليس كبديل عن شاشة الموظفين العامة."
        className="anchor-section"
      >
        <div id="create-form" className="grid gap-4 md:grid-cols-2">
          <Field label="رقم الطرف" placeholder="طرف-٠٦" />
          <Field label="الاسم" placeholder="مثال: شروق محمود" />
          <Field label="الصفة الإدارية" placeholder="مدير تشغيل / مورد / شريك..." />
          <SelectField label="هل هو شريك؟" options={["نعم", "لا"]} defaultValue="لا" />
          <SelectField label="هل هو ممول؟" options={["نعم", "لا"]} defaultValue="لا" />
          <SelectField label="هل يستلم أموالًا؟" options={["نعم", "لا"]} defaultValue="نعم" />
          <SelectField label="هل يدفع مصروفات لصالح المركز؟" options={["نعم", "لا"]} defaultValue="لا" />
          <SelectField label="هل يملك وسيلة تحصيل؟" options={["نعم", "لا"]} defaultValue="نعم" />
          <SelectField label="هل له عهدة أو جاري؟" options={["نعم", "لا"]} defaultValue="نعم" />
          <SelectField label="الحالة" options={["نشط", "غير نشط"]} defaultValue="نشط" />
          <div className="md:col-span-2">
            <TextAreaField label="ملاحظات محاسبية" placeholder="اذكر ما إذا كانت المبالغ تعتبر جاري مستحق، مساهمة رأسمالية، أو عهدة لصالح المركز." />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button icon="plus">حفظ الطرف</Button>
            <Button variant="secondary">حفظ وربط وسيلة تحصيل</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="ملاحظات مهمة"
        description="تساعد في ضبط الفهم المحاسبي للأطراف داخل المرحلة الأولى."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <InfoNote
            title="المركز كيان مستقل"
            description="أموال الأطراف الشخصية لا تخلط مع أموال المركز إلا من خلال حركة مسجلة بوضوح."
          />
          <InfoNote
            icon="cash"
            title="الأرصدة لدى الأطراف لا تعني خزنة"
            description="قد يملك الطرف أموالًا تخص المركز لكنها لم تدخل الخزنة بعد."
          />
          <InfoNote
            icon="spark"
            title="التسوية عنصر أساسي"
            description="يجب أن يظهر ما تم تسويته وما يزال قائمًا على كل طرف لسهولة المراجعة."
          />
        </div>
      </SectionCard>
    </div>
  );
}
