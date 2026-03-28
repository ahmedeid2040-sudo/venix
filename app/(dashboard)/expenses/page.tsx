import { accounts, expenses, parties } from "@/data/mock";
import { formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  BarList,
  Button,
  DataTable,
  Field,
  PageHeader,
  SectionCard,
  SelectField,
  StatCard,
  TextAreaField
} from "@/components/ui";
import { AttachmentUploader } from "@/components/attachment-uploader";

export default function ExpensesPage() {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amountEgp, 0);
  const establishment = expenses
    .filter((item) => item.mainClass === "تأسيس")
    .reduce((sum, item) => sum + item.amountEgp, 0);
  const assets = expenses
    .filter((item) => item.mainClass === "أصل")
    .reduce((sum, item) => sum + item.amountEgp, 0);
  const operations = expenses
    .filter((item) => item.mainClass === "تشغيل")
    .reduce((sum, item) => sum + item.amountEgp, 0);

  const byClass = ["تأسيس", "أصل", "تشغيل", "رسوم تحصيل"].map((item) => ({
    label: item,
    total: expenses.filter((expense) => expense.mainClass === item).reduce((sum, expense) => sum + expense.amountEgp, 0)
  }));

  const byPayer = parties
    .map((party) => ({
      label: party.name,
      total: expenses.filter((expense) => expense.paidByPartyId === party.id).reduce((sum, expense) => sum + expense.amountEgp, 0)
    }))
    .filter((item) => item.total > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="متابعة المصروفات"
        title="شاشة المصروفات"
        description="تغطي مصروفات التأسيس والأصول والتشغيل ورسوم التحصيل، مع ربط المصروف بالدافع والوسيلة المستخدمة وحالة التسوية."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير المصروفات
            </Button>
            <Button href="#create-form" icon="plus">
              تسجيل مصروف
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي المصروفات" value={formatMoney(totalExpenses, "جنيه مصري")} helper="وفق البيانات التشغيلية الحالية" icon="expenses" tone="gold" />
        <StatCard label="مصروفات تأسيس" value={formatMoney(establishment, "جنيه مصري")} helper="تجهيز المركز قبل التشغيل" icon="spark" tone="warning" />
        <StatCard label="أصول وتجهيزات" value={formatMoney(assets, "جنيه مصري")} helper="موجودات طويلة الأجل" icon="accounts" tone="info" />
        <StatCard label="تشغيل" value={formatMoney(operations, "جنيه مصري")} helper="إعلانات واشتراكات وإنترنت وتشغيل يومي" icon="wallet" tone="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <SectionCard
          title="التوزيع حسب التصنيف"
          description="يساعد على التفريق بين ما يدخل في التأسيس وما يعتبر أصلًا أو تشغيلًا."
        >
          <BarList
            items={byClass.map((item) => ({
              label: item.label,
              value: formatMoney(item.total, "جنيه مصري"),
              percent: (item.total / Math.max(totalExpenses, 1)) * 100,
              tone:
                item.label === "تأسيس"
                  ? "gold"
                  : item.label === "أصل"
                    ? "cyan"
                    : item.label === "تشغيل"
                      ? "success"
                      : "danger"
            }))}
          />
        </SectionCard>

        <SectionCard
          title="سجل المصروفات"
          description="معروض حسب التصنيف الرئيسي والفرعي والدافع وحالة التسوية."
        >
          <DataTable
            columns={["الحركة", "التاريخ", "التصنيف الرئيسي", "التصنيف الفرعي", "البيان", "المورد", "القيمة", "الدافع", "الوسيلة", "تمت التسوية؟"]}
            rows={expenses.map((expense) => {
              const payer = parties.find((party) => party.id === expense.paidByPartyId);
              const account = accounts.find((account) => account.id === expense.paidFromAccountId);

              return [
                <span key="id" className="font-black text-white">{expense.id.toUpperCase()}</span>,
                formatDate(expense.date),
                expense.mainClass,
                expense.subClass,
                expense.description,
                expense.vendor,
                <div key="amount" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(expense.amountOriginal, expense.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatMoney(expense.amountEgp, "جنيه مصري")}</p>
                </div>,
                payer?.name ?? expense.paidByPartyId,
                account?.name ?? expense.paidFromAccountId,
                <span key="settled" className={expense.settled ? "font-black text-[var(--success)]" : "font-black text-[var(--warning)]"}>
                  {expense.settled ? "نعم" : "لا"}
                </span>
              ];
            })}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <SectionCard
          title="حسب الطرف الدافع"
          description="يفيد في تتبع ما دفعه كل طرف من جيبه لصالح المركز وما إذا تمت تسويته."
        >
          <BarList
            items={byPayer.map((item) => ({
              label: item.label,
              value: formatMoney(item.total, "جنيه مصري"),
              percent: (item.total / Math.max(totalExpenses, 1)) * 100,
              tone: item.label === "حمادة" ? "gold" : item.label === "أحمد" ? "cyan" : "success"
            }))}
          />
        </SectionCard>

        <SectionCard
          title="نموذج إضافة / تعديل مصروف"
          description="يشمل التأسيس والأصول والتشغيل ورسوم التحصيل."
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <Field label="رقم العملية" placeholder="مص-٢٤٠٩" />
            <Field label="التاريخ" type="date" />
            <SelectField label="التصنيف الرئيسي" options={["تأسيس", "أصل", "تشغيل", "رسوم تحصيل"]} defaultValue="تشغيل" />
            <Field label="التصنيف الفرعي" placeholder="تسويق وإعلانات / أجهزة ومعدات / ضيافة" />
            <Field label="البيان" placeholder="وصف المصروف" />
            <Field label="المورد / الجهة" placeholder="اسم المورد أو الخدمة" />
            <Field label="المبلغ الأصلي" type="number" placeholder="4200" />
            <SelectField label="العملة" options={["جنيه مصري", "درهم إماراتي", "ريال سعودي"]} defaultValue="جنيه مصري" />
            <Field label="سعر الصرف" type="number" placeholder="1" />
            <Field label="المعادل بالجنيه" type="number" placeholder="4200" />
            <SelectField label="من الذي دفع؟" options={parties.map((party) => party.name)} />
            <SelectField label="تم الدفع من أي وسيلة؟" options={accounts.map((account) => account.name)} />
            <SelectField label="هل تم تسويته؟" options={["نعم", "لا"]} defaultValue="لا" />
            <div className="md:col-span-2">
              <TextAreaField label="ملاحظات" placeholder="اذكر إذا كان المصروف مرتبطًا بالتأسيس أو يحتاج تسوية لاحقة مع أحد الأطراف." />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ المصروف</Button>
              <Button variant="secondary">حفظ ومراجعة التسوية</Button>
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