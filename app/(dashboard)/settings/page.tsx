import { commissionStatusOptions, courseStatusOptions, paymentStatusOptions, registrationStatusOptions } from "@/data/mock";
import { formatMoney } from "@/lib/utils";
import {
  Badge,
  Button,
  Field,
  PageHeader,
  SectionCard,
  SelectField,
  StatCard,
  TextAreaField
} from "@/components/ui";

const users = [
  {
    name: "المدير العام",
    role: "المدير",
    description: "له كل الصلاحيات على الدورات والتسجيلات والتحصيلات والاستردادات والتقارير والإعدادات."
  },
  {
    name: "المحاسب الرئيسي",
    role: "المحاسب",
    description: "يتابع التحصيلات والاستردادات والمصروفات والتحويلات والتقارير اليومية ورفع المرفقات."
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="سياسات النظام ونظام التصميم"
        title="الإعدادات"
        description="تجميع للسياسات المحاسبية الأساسية، الإعدادات التشغيلية، ضبط المستخدمين، ومعاينة نظام التصميم المستخدم في المشروع."
        actions={
          <>
            <Button variant="secondary" icon="download">
              تصدير الإعدادات
            </Button>
            <Button icon="plus">حفظ التعديلات</Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="عملة التقارير" value="جنيه مصري" helper="العملة الرئيسية المعتمدة" icon="wallet" tone="gold" />
        <StatCard label="سياسة الحذف" value="عبر الحالات فقط" helper="لا حذف للأثر التاريخي" icon="shield" tone="success" />
        <StatCard label="منطق العمولة" value="شرطان" helper="اكتمال السداد + انعقاد الدورة" icon="team" tone="warning" />
        <StatCard label="التشغيل" value="متعدد المستخدمين" helper="مدير + محاسب" icon="spark" tone="info" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="إعدادات مالية أساسية"
          description="معاينة لكيفية تمثيل السياسات الجوهرية داخل النظام."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="عملة التقارير الرئيسية" options={["جنيه مصري", "درهم إماراتي", "ريال سعودي"]} defaultValue="جنيه مصري" />
            <SelectField label="العملة الافتراضية للتسعير" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="درهم إماراتي" />
            <SelectField label="هل يتم حفظ العملة الأصلية؟" options={["نعم", "لا"]} defaultValue="نعم" />
            <SelectField label="هل يتم حفظ سعر الصرف؟" options={["نعم", "لا"]} defaultValue="نعم" />
            <Field label="تنسيق رقم التسجيل" defaultValue="تسج-####" />
            <Field label="تنسيق رقم التحصيل" defaultValue="تحص-####" />
            <div className="md:col-span-2">
              <TextAreaField
                label="ملاحظات السياسة"
                defaultValue="كل دفعة تُسجل كحركة مستقلة. أي استرداد يسجل كاسترداد مرتبط بالتسجيل. أي تحويل بين الوسائل يسجل كتحويل داخلي. العمولة لا تصبح مستحقة إلا بعد اكتمال السداد وانعقاد الدورة."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="سياسة العمولة"
          description="يعرض النظام الفرق بوضوح بين المتوقعة / المستحقة / المصروفة / الملغاة."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="متى تُحسب العمولة؟" options={["عند التسجيل", "عند التحصيل", "عند السداد الكامل"]} defaultValue="عند التسجيل" />
            <SelectField label="متى تصبح مستحقة؟" options={["بعد السداد الكامل فقط", "بعد السداد الكامل وانعقاد الدورة"]} defaultValue="بعد السداد الكامل وانعقاد الدورة" />
            <SelectField label="ماذا يحدث عند الاسترداد؟" options={["تلغى", "تظل معلقة", "تحتاج موافقة يدوية"]} defaultValue="تلغى" />
            <SelectField label="حفظ النسبة على مستوى الصفقة" options={["نعم", "لا"]} defaultValue="نعم" />
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {commissionStatusOptions.map((status) => (
                <Badge key={status} label={status} tone={status === "مصروفة" ? "success" : status === "مستحقة" ? "gold" : status === "ملغاة" ? "danger" : "warning"} />
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <SectionCard
          title="المستخدمون والصلاحيات"
          description="الإعداد الحالي يدعم حساب المدير وحساب المحاسب مع قابلية التوسع لاحقًا إذا احتاج المركز لذلك."
        >
          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user.role} className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-white">{user.name}</p>
                    <p className="mt-1 text-[12px] text-[var(--text-muted)]">{user.role}</p>
                  </div>
                  <Badge label={user.role} tone={user.role === "المدير" ? "gold" : "info"} />
                </div>
                <p className="mt-3 text-[13px] leading-7 text-[var(--text-secondary)]">{user.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="الطباعة والتصدير والمرفقات"
          description="جاهزية التشغيل تشمل طباعة التقارير على مقاس أ٤ وتصديرها إلى ملف إكسل ورفع المستندات الداعمة."
        >
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-[13px] font-black">طباعة على مقاس أ٤</p>
              <p className="mt-2 text-[13px] leading-7 text-[var(--text-secondary)]">
                شاشة التقارير مهيأة للطباعة المباشرة مع تنسيق مناسب للملف الورقي.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-[13px] font-black">تصدير إلى ملف إكسل</p>
              <p className="mt-2 text-[13px] leading-7 text-[var(--text-secondary)]">
                يمكن إخراج التقرير الحالي إلى ملف جداول لمراجعته أو مشاركته خارج النظام.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-[13px] font-black">رفع المرفقات</p>
              <p className="mt-2 text-[13px] leading-7 text-[var(--text-secondary)]">
                يمكن رفع الإيصالات وصور التحويلات والملفات الداعمة وربطها بالسجلات التشغيلية.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="حالات النظام"
        description="مرجع سريع للحالات المعتمدة داخل النماذج والجداول والتقارير."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-[13px] font-black">حالات الدورة</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {courseStatusOptions.map((status) => (
                <Badge key={status} label={status} tone={status === "انعقدت" ? "success" : status === "ألغيت" ? "danger" : status === "اكتمل الحد الأدنى" ? "gold" : "info"} />
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-[13px] font-black">حالات السداد</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {paymentStatusOptions.map((status) => (
                <Badge key={status} label={status} tone={status.includes("كامل") ? "success" : status.includes("مسترد") ? "danger" : status.includes("جزئي") ? "warning" : "neutral"} />
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-[13px] font-black">حالات التسجيل</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {registrationStatusOptions.map((status) => (
                <Badge key={status} label={status} tone={status === "مكتمل" ? "success" : status === "ملغي" ? "danger" : status === "محول" ? "gold" : "info"} />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="معاينة نظام التصميم"
        description="العناصر المستخدمة عبر المشروع لضمان الاتساق والقابلية للتوسع."
      >
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-[13px] font-black">لوحة الألوان</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["اللون الذهبي", "var(--brand-gold)", formatMoney(1, "جنيه مصري")],
                  ["اللون السماوي", "var(--brand-cyan)", "لون إبراز"],
                  ["نجاح", "var(--success)", "حالة"],
                  ["تنبيه", "var(--warning)", "حالة"],
                  ["خطر", "var(--danger)", "حالة"],
                  ["سطح اللوحات", "var(--surface-3)", "خلفية اللوحات"]
                ].map(([label, color, helper]) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="mb-3 h-12 rounded-2xl border border-white/8" style={{ background: color }} />
                    <p className="font-black">{label}</p>
                    <p className="text-[13px] text-[var(--text-secondary)]">{helper}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-[13px] font-black">أزرار وبادجات</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button icon="plus">إجراء رئيسي</Button>
                <Button variant="secondary">إجراء ثانوي</Button>
                <Button variant="soft">إجراء مساعد</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge label="نجاح" tone="success" />
                <Badge label="تنبيه" tone="warning" />
                <Badge label="خطر" tone="danger" />
                <Badge label="ذهبي" tone="gold" />
                <Badge label="معلومة" tone="info" />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
              <p className="text-[13px] font-black">جاهزية الإطلاق</p>
              <p className="mt-3 text-[13px] leading-7 text-[var(--text-secondary)]">
                الهوية البصرية أصبحت عربية بالكامل، والخط الموحد هو المراعي، والتقارير تدعم الطباعة على مقاس أ٤ والتصدير إلى ملف إكسل، مع بنية مصادقة متعددة المستخدمين ورفع مرفقات.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
