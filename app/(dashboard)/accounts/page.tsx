import Link from "next/link";
import { accounts, statusToneMap } from "@/data/mock";
import { formatCurrencyLabel, formatMoney, formatNumber } from "@/lib/utils";
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

export default function AccountsPage() {
  const totalFunds = accounts.reduce((sum, account) => sum + account.balanceEgp, 0);
  const cashbox = accounts.find((account) => account.id === "acc-cashbox")?.balanceEgp ?? 0;
  const unsettledOutsideCashbox = accounts
    .filter((account) => account.id !== "acc-cashbox")
    .reduce((sum, account) => sum + account.balanceEgp, 0);
  const totalFees = accounts.reduce((sum, account) => sum + account.feesEgp, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="هيكل وسائل التحصيل"
        title="شاشة وسائل التحصيل والحسابات"
        description="تعريف كل وسيلة تحصيل أو حفظ أموال مرتبطة بالمركز، مع إبراز الفرق بين الرصيد الموجود عليها وبين ما دخل الخزنة فعليًا."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير وسائل التحصيل
            </Button>
            <Button href="#create-form" icon="plus">
              إضافة وسيلة تحصيل
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي أموال المركز" value={formatMoney(totalFunds, "جنيه مصري")} helper="الخزنة + كل الوسائل" icon="wallet" tone="gold" />
        <StatCard label="رصيد الخزنة" value={formatMoney(cashbox, "جنيه مصري")} helper="النقدية الفعلية داخل المركز" icon="cash" tone="success" />
        <StatCard label="خارج الخزنة" value={formatMoney(unsettledOutsideCashbox, "جنيه مصري")} helper="أموال تخص المركز لدى الوسائل والأطراف" icon="accounts" tone="info" />
        <StatCard label="رسوم مرتبطة" value={formatMoney(totalFees, "جنيه مصري")} helper="تؤثر على الصافي المتاح" icon="fees" tone="warning" />
      </section>

      <SectionCard
        title="بطاقات الرصيد"
        description="قراءة سريعة لأهم الحسابات ووسائل التحصيل."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/accounts/${account.id}`}
              className="rounded-[24px] border border-white/8 bg-white/4 p-5 transition hover:border-[rgba(85,198,213,0.22)] hover:bg-white/6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">{account.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{account.code}</p>
                  </div>
                  <Badge label={account.status} tone={statusToneMap[account.status]} />
                </div>
                <p className="text-2xl font-black">{formatMoney(account.balanceEgp, "جنيه مصري")}</p>
                <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  <p>الصافي المتاح: <span className="font-black text-white">{formatMoney(account.netAvailableEgp, "جنيه مصري")}</span></p>
                  <p>المحوّل إلى الخزنة: <span className="font-black text-white">{formatMoney(account.transferredToCashEgp, "جنيه مصري")}</span></p>
                  <p>الرسوم المرتبطة: <span className="font-black text-white">{formatMoney(account.feesEgp, "جنيه مصري")}</span></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="جدول الحسابات"
          description="يعرض النوع، صاحب الوسيلة، العملة الأساسية، الرصيد، والصافي المتاح."
        >
          <DataTable
            columns={["الحساب", "النوع", "صاحب الوسيلة", "شخصية أم للمركز", "العملة الأساسية", "يستقبل من العملاء؟", "يحوّل للخزنة؟", "الرصيد", "الصافي المتاح", "إجراءات"]}
            rows={accounts.map((account) => [
              <div key="name" className="space-y-1">
                <p className="font-black text-white">{account.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{account.code}</p>
              </div>,
              account.type,
              account.name.split("—")[1]?.trim() ?? "المركز",
              account.isPersonal ? "شخصية" : "مخصصة للمركز",
              formatCurrencyLabel(account.baseCurrency),
              account.acceptsCollections ? "نعم" : "لا",
              account.canTransferToCash ? "نعم" : "لا",
              <span key="balance" className="font-black text-white">{formatMoney(account.balanceEgp, "جنيه مصري")}</span>,
              <span key="net" className="font-black text-[var(--success)]">{formatMoney(account.netAvailableEgp, "جنيه مصري")}</span>,
              <Button key="details" href={`/accounts/${account.id}`} variant="secondary" size="sm" icon="external">
                التفاصيل
              </Button>
            ])}
          />
        </SectionCard>

        <SectionCard
          title="مبدأ محاسبي مهم"
          description="وجود أموال تخص المركز في وسيلة تحصيل لا يعني أنها داخل الخزنة."
        >
          <div className="grid gap-4">
            <InfoNote
              title="الرصيد على الوسيلة"
              description="يمثل ما استُلم عليها ناقص ما صُرف منها وناقص ما تم تحويله منها."
            />
            <InfoNote
              icon="cash"
              title="رصيد الخزنة"
              description="يتحدد فقط بالحركات التي دخلت الخزنة فعليًا أو خرجت منها فعليًا."
            />
            <InfoNote
              icon="wallet"
              title="إجمالي أموال المركز"
              description="هو مجموع الأرصدة على جميع الوسائل إضافة إلى الخزنة وأي أرصدة مثبتة أخرى."
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="نموذج إضافة / تعديل وسيلة تحصيل"
        description="يضمن توثيق العملة الأساسية وصاحب الوسيلة وطبيعتها الشخصية أو المؤسسية."
        className="anchor-section"
      >
        <div id="create-form" className="grid gap-4 md:grid-cols-2">
          <Field label="رقم الحساب / الوسيلة" placeholder="حسا-٠٦" />
          <Field label="اسم الحساب / الوسيلة" placeholder="مثال: بنك الإمارات الرقمي" />
          <SelectField label="النوع" options={["بنك", "محفظة", "تحويل فوري", "منصة دفع", "خزنة"]} defaultValue="بنك" />
          <SelectField label="صاحب الوسيلة" options={["حمادة", "أمل", "سارة", "أحمد", "المحاسب"]} />
          <SelectField label="شخصية أم مخصصة للمركز" options={["شخصية", "مخصصة للمركز"]} defaultValue="شخصية" />
          <SelectField label="العملة الأساسية" options={["جنيه مصري", "درهم إماراتي", "ريال سعودي"]} defaultValue="جنيه مصري" />
          <SelectField label="تستقبل من العملاء مباشرة؟" options={["نعم", "لا"]} defaultValue="نعم" />
          <SelectField label="يتم الصرف منها؟" options={["نعم", "لا"]} defaultValue="لا" />
          <SelectField label="يتم التحويل منها للخزنة؟" options={["نعم", "لا"]} defaultValue="نعم" />
          <SelectField label="الحالة" options={["نشط", "غير نشط"]} defaultValue="نشط" />
          <div className="md:col-span-2">
            <TextAreaField label="ملاحظات" placeholder="اذكر القيود التشغيلية أو ما إذا كانت الوسيلة تخضع لرسوم أو فروق تحويل مستمرة." />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button icon="plus">حفظ الوسيلة</Button>
            <Button variant="secondary">حفظ ومتابعة الرصيد</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
