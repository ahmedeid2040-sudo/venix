import {
  accounts,
  internalTransfers
} from "@/data/mock";
import { formatDate, formatMoney, formatNumber } from "@/lib/utils";
import {
  BarList,
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
import { AttachmentUploader } from "@/components/attachment-uploader";

export default function CashTransfersPage() {
  const intoCashbox = internalTransfers
    .filter((item) => item.toAccountId === "acc-cashbox")
    .reduce((sum, item) => sum + item.netDeliveredEgp, 0);
  const betweenAccounts = internalTransfers
    .filter((item) => item.toAccountId !== "acc-cashbox")
    .reduce((sum, item) => sum + item.netDeliveredEgp, 0);
  const relatedFees = internalTransfers.reduce((sum, item) => sum + item.relatedFeesEgp, 0);
  const netDelivered = internalTransfers.reduce((sum, item) => sum + item.netDeliveredEgp, 0);

  const sourceSummary = accounts
    .map((account) => ({
      label: account.name,
      value: formatMoney(
        internalTransfers
          .filter((item) => item.fromAccountId === account.id)
          .reduce((sum, item) => sum + item.netDeliveredEgp, 0),
        "جنيه مصري"
      ),
      percent:
        (internalTransfers
          .filter((item) => item.fromAccountId === account.id)
          .reduce((sum, item) => sum + item.netDeliveredEgp, 0) /
          Math.max(netDelivered, 1)) *
        100
    }))
    .filter((item) => item.value !== formatMoney(0, "جنيه مصري"));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مسار الخزنة والتحويلات الداخلية"
        title="شاشة التحويلات إلى الخزنة / التحويلات الداخلية"
        description="تسجيل نقل الأموال من وسيلة تحصيل إلى الخزنة أو بين وسيلتين مختلفتين، مع إظهار الرسوم والصافي المورّد فعليًا."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير التحويلات
            </Button>
            <Button href="#create-form" icon="plus">
              تسجيل تحويل جديد
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="توريد إلى الخزنة" value={formatMoney(intoCashbox, "جنيه مصري")} helper="ما دخل الخزنة فعليًا" icon="cash" tone="success" />
        <StatCard label="بين الحسابات" value={formatMoney(betweenAccounts, "جنيه مصري")} helper="تحويلات تشغيلية داخلية" icon="transfer" tone="info" />
        <StatCard label="رسوم مرتبطة" value={formatMoney(relatedFees, "جنيه مصري")} helper="يجب تسجيلها بوضوح" icon="fees" tone="warning" />
        <StatCard label="الصافي المورد" value={formatMoney(netDelivered, "جنيه مصري")} helper="بعد الرسوم والتحويل" icon="wallet" tone="gold" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="ملخص حسب الوسيلة المصدر"
          description="يوضح من أين تأتي الأموال التي وصلت إلى الخزنة أو تحركت بين الحسابات."
        >
          <BarList
            items={sourceSummary.map((item) => ({
              label: item.label,
              value: item.value,
              percent: item.percent,
              tone: item.label.includes("سترايب") ? "cyan" : item.label.includes("خزنة") ? "gold" : "success"
            }))}
          />
        </SectionCard>

        <SectionCard
          title="جدول التحويلات"
          description="عرض تفصيلي واضح من المصدر إلى الوجهة مع الصافي بعد الرسوم."
        >
          <DataTable
            columns={["الحركة", "التاريخ", "من وسيلة", "إلى وسيلة", "المبلغ الأصلي", "المعادل بالجنيه", "الرسوم", "الصافي المورد", "المستلم", "ملاحظات"]}
            rows={internalTransfers.map((transfer) => {
              const from = accounts.find((account) => account.id === transfer.fromAccountId);
              const to = accounts.find((account) => account.id === transfer.toAccountId);
              const receiver = accounts.find((account) => account.ownerPartyId === transfer.receiverPartyId);

              return [
                <span key="id" className="font-black text-white">{transfer.id.toUpperCase()}</span>,
                formatDate(transfer.date),
                from?.name ?? transfer.fromAccountId,
                to?.name ?? transfer.toAccountId,
                <div key="orig" className="space-y-1">
                  <p className="font-black text-white">{formatMoney(transfer.amountOriginal, transfer.currency)}</p>
                  <p className="text-xs text-[var(--text-muted)]">سعر الصرف: {transfer.exchangeRate}</p>
                </div>,
                <span key="egp" className="font-black text-white">{formatMoney(transfer.amountEgp, "جنيه مصري")}</span>,
                <span key="fees" className="font-black text-[var(--warning)]">{formatMoney(transfer.relatedFeesEgp, "جنيه مصري")}</span>,
                <span key="net" className="font-black text-[var(--success)]">{formatMoney(transfer.netDeliveredEgp, "جنيه مصري")}</span>,
                receiver?.name ?? "المحاسب",
                transfer.notes
              ];
            })}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="نموذج تحويل داخلي / توريد إلى الخزنة"
          description="يلزم تحديد المصدر والوجهة، مع منع استخدام نفس الوسيلة كمصدر ووجهة."
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <SelectField label="من وسيلة" options={accounts.map((account) => account.name)} />
            <SelectField label="إلى وسيلة" options={accounts.map((account) => account.name)} />
            <Field label="التاريخ" type="date" />
            <Field label="المبلغ الأصلي" type="number" placeholder="2200" />
            <SelectField label="العملة الأصلية" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="ريال سعودي" />
            <Field label="سعر الصرف" type="number" placeholder="13.08" />
            <Field label="المعادل بالجنيه" type="number" placeholder="28776" />
            <Field label="الرسوم المرتبطة" type="number" placeholder="457" />
            <Field label="الصافي المورّد فعليًا" type="number" placeholder="28319" />
            <SelectField label="المستلم" options={["المحاسب", "سارة", "أمل", "حمادة", "أحمد"]} defaultValue="المحاسب" />
            <div className="md:col-span-2">
              <TextAreaField label="ملاحظات" placeholder="مثال: توريد من الحساب السعودي إلى الخزنة بعد خصم رسوم التحويل البنكي." />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ التحويل</Button>
              <Button variant="secondary">حفظ وربط الرسوم</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="قواعد محاسبية مهمة"
          description="تضمن عدم تضخيم الإيرادات أو تشويه رصيد الخزنة."
        >
          <div className="grid gap-4">
            <InfoNote
              title="التحويل ليس إيرادًا جديدًا"
              description="إذا تم نقل مبلغ من وسيلة تحصيل إلى الخزنة، فيسجل كتحويل داخلي وليس كتحصيل جديد."
            />
            <InfoNote
              icon="wallet"
              title="الخزنة لا تتغير إلا فعليًا"
              description="لا يظهر أثر على الخزنة إلا إذا دخلها مبلغ أو خرج منها مبلغ بشكل فعلي."
            />
            <InfoNote
              icon="fees"
              title="الرسوم عنصر مستقل"
              description="أي رسوم تحويل أو سحب يجب أن تسجل في نفس السياق حتى يكون الصافي المورّد مفهومًا."
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