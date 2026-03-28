import { registrations, salesReps, statusToneMap } from "@/data/mock";
import { formatMoney, formatNumber, formatPercent } from "@/lib/utils";
import {
  Badge,
  Button,
  DataTable,
  InfoNote,
  PageHeader,
  SectionCard,
  SelectField,
  StatCard,
  Field,
  TextAreaField
} from "@/components/ui";

export default function SalesTeamPage() {
  const activeReps = salesReps.filter((rep) => rep.status === "نشط").length;
  const expected = salesReps.reduce((sum, rep) => sum + rep.expectedCommissionEgp, 0);
  const eligible = salesReps.reduce((sum, rep) => sum + rep.eligibleCommissionEgp, 0);
  const paid = salesReps.reduce((sum, rep) => sum + rep.paidCommissionEgp, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="هيكل عمولات المبيعات"
        title="شاشة موظفي المبيعات"
        description="تعريف موظفي المبيعات وربطهم بالتسجيلات والعمولات مع فصل واضح بين العمولة المتوقعة والمستحقة والمصروفة."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير العمولات
            </Button>
            <Button href="#create-form" icon="plus">
              إضافة موظف مبيعات
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الموظفون النشطون" value={formatNumber(activeReps)} helper="جاهزون لاستقبال صفقات جديدة" icon="team" tone="info" />
        <StatCard label="عمولات متوقعة" value={formatMoney(expected, "جنيه مصري")} helper="محسوبة على التسجيلات الحالية" icon="trend" tone="gold" />
        <StatCard label="عمولات مستحقة" value={formatMoney(eligible, "جنيه مصري")} helper="بعد السداد الكامل وانعقاد الدورة" icon="spark" tone="success" />
        <StatCard label="عمولات مصروفة" value={formatMoney(paid, "جنيه مصري")} helper="تم ترحيلها وصرفها فعليًا" icon="cash" tone="warning" />
      </section>

      <SectionCard
        title="قائمة موظفي المبيعات"
        description="تظهر الصورة الكاملة لمساهمة كل موظف من حيث التسجيلات والمبيعات والعمولات."
      >
        <DataTable
          columns={["الموظف", "الحالة", "نسبة افتراضية", "التسجيلات", "قيمة المبيعات", "المتوقعة", "المستحقة", "المصروفة", "إجراءات"]}
          rows={salesReps.map((rep) => [
            <div key="name" className="space-y-1">
              <p className="font-black text-white">{rep.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{rep.phone}</p>
            </div>,
            <Badge key="status" label={rep.status} tone={statusToneMap[rep.status]} />,
            formatPercent(rep.defaultCommissionRate),
            <span key="registrations" className="font-black text-white">{formatNumber(rep.registrations)}</span>,
            <span key="sales" className="font-black text-white">{formatMoney(rep.salesEgp, "جنيه مصري")}</span>,
            <span key="expected" className="font-black text-white">{formatMoney(rep.expectedCommissionEgp, "جنيه مصري")}</span>,
            <span key="eligible" className="font-black text-[var(--brand-gold)]">{formatMoney(rep.eligibleCommissionEgp, "جنيه مصري")}</span>,
            <span key="paid" className="font-black text-[var(--success)]">{formatMoney(rep.paidCommissionEgp, "جنيه مصري")}</span>,
            <Button key="details" href={`/sales-team/${rep.id}`} variant="secondary" size="sm" icon="external">
              التفاصيل
            </Button>
          ])}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="سياسة العمولة في المرحلة الحالية"
          description="المهم هنا ليس فقط قيمة النسبة، بل التوقيت الصحيح لتحويلها من متوقعة إلى مستحقة."
        >
          <div className="grid gap-4">
            <InfoNote
              title="الشرط الأول"
              description="العمولة لا تنتقل إلى مستحقة إلا بعد اكتمال سداد العميل كامل المبلغ المتفق عليه."
            />
            <InfoNote
              icon="calendar"
              title="الشرط الثاني"
              description="حتى إذا اكتمل السداد، تبقى العمولة غير مستحقة إذا لم تنعقد الدورة بالفعل."
            />
            <InfoNote
              icon="refunds"
              title="الإلغاء أو الاسترداد"
              description="إذا أُلغي التسجيل أو تم رد المبلغ، يتم إلغاء العمولة أو منع صرفها على الحالة."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="نموذج إضافة / تعديل موظف مبيعات"
          description="يُحفظ معدل العمولة الافتراضي كقيمة مساعدة، بينما النسبة النهائية تثبت داخل كل تسجيل."
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <Field label="كود الموظف" placeholder="مند-٠٥" />
            <Field label="اسم الموظف" placeholder="مثال: ندى ياسر" />
            <Field label="رقم الهاتف" placeholder="010xxxxxxxx" />
            <Field label="نسبة العمولة الافتراضية" type="number" placeholder="3" />
            <SelectField label="الحالة" options={["نشط", "غير نشط"]} defaultValue="نشط" />
            <div className="md:col-span-2">
              <TextAreaField
                label="ملاحظات"
                placeholder="يمكن توضيح نوع الدورات التي يركز عليها الموظف أو أي تعليمات خاصة بالعمولات."
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ الموظف</Button>
              <Button variant="secondary">حفظ والتعيين لاحقًا</Button>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="آخر التسجيلات الموزعة على فريق المبيعات"
        description="لقطة سريعة للصفقات الحديثة وحالة عمولاتها."
      >
        <DataTable
          compact
          columns={["التسجيل", "العميل", "الموظف", "قيمة البيع", "حالة التسجيل", "حالة العمولة"]}
          rows={registrations.slice(0, 6).map((registration) => {
            const rep = salesReps.find((item) => item.id === registration.salesRepId);
            return [
              <span key="code" className="font-black text-white">{registration.code}</span>,
              registration.customerName,
              rep?.name ?? registration.salesRepId,
              <div key="sold" className="space-y-1">
                <p className="font-black text-white">{formatMoney(registration.soldPriceEgp, "جنيه مصري")}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatMoney(registration.soldPrice, registration.currency)}</p>
              </div>,
              <Badge key="reg-status" label={registration.registrationStatus} tone={statusToneMap[registration.registrationStatus]} />,
              <Badge key="commission-status" label={registration.commissionStatus} tone={statusToneMap[registration.commissionStatus]} />
            ];
          })}
        />
      </SectionCard>
    </div>
  );
}
