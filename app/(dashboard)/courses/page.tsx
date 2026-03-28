import Link from "next/link";
import { accounts, courseRegistrations, courses, paymentStatusOptions, statusToneMap } from "@/data/mock";
import { formatDate, formatMoney, formatNumber } from "@/lib/utils";
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

export default function CoursesPage() {
  const openCount = courses.filter((course) => course.status === "مفتوحة للحجز").length;
  const assemblingCount = courses.filter((course) => course.status === "تحت التجميع").length;
  const minimumReached = courses.filter((course) => course.status === "اكتمل الحد الأدنى").length;
  const heldCount = courses.filter((course) => course.status === "انعقدت").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="هيكل الدورات"
        title="شاشة الدورات"
        description="تعريف الدورات وربطها بالتسجيلات والتحصيلات والاستردادات مع حالات تشغيلية واضحة تترجم احتياج الإدارة والمحاسب."
        actions={
          <>
            <Button href="/reports" variant="secondary" icon="reports">
              تقرير الدورات
            </Button>
            <Button href="#create-form" icon="plus">
              إضافة دورة
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="الدورات المفتوحة"
          value={formatNumber(openCount)}
          helper="جاهزة لاستقبال حجوزات جديدة"
          icon="courses"
          tone="info"
        />
        <StatCard
          label="تحت التجميع"
          value={formatNumber(assemblingCount)}
          helper="تحتاج متابعة للوصول إلى الحد الأدنى"
          icon="trend"
          tone="warning"
        />
        <StatCard
          label="اكتمل الحد الأدنى"
          value={formatNumber(minimumReached)}
          helper="جاهزة للترتيب التشغيلي النهائي"
          icon="spark"
          tone="gold"
        />
        <StatCard
          label="دورات انعقدت"
          value={formatNumber(heldCount)}
          helper="مرتبطة باستحقاق عمولات مكتملة"
          icon="calendar"
          tone="success"
        />
      </section>

      <SectionCard
        title="قائمة الدورات"
        description="كل تنفيذ جديد لنفس محتوى الدورة يعتبر سجلًا مستقلًا داخل النظام مع حالته وتحصيلاته الخاصة."
      >
        <DataTable
          columns={[
            "كود الدورة",
            "اسم الدورة",
            "الحالة",
            "البداية",
            "السعر القياسي",
            "التسجيلات",
            "مسددون كاملًا",
            "إجمالي المتحصلات",
            "إجراءات"
          ]}
          rows={courses.map((course) => {
            const registrations = courseRegistrations(course.id);
            return [
              <span key="code" className="font-black text-white">{course.code}</span>,
              <div key="name" className="space-y-1">
                <p className="font-black text-white">{course.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{course.notes}</p>
              </div>,
              <Badge key="status" label={course.status} tone={statusToneMap[course.status]} />,
              formatDate(course.expectedStart),
              <div key="price" className="space-y-1">
                <p className="font-black text-white">{formatMoney(course.standardPrice, course.currency)}</p>
                <p className="text-xs text-[var(--text-muted)]">العملة الأساسية</p>
              </div>,
              <span key="regs" className="font-black text-white">{formatNumber(course.registrations)}</span>,
              <span key="fully" className="font-black text-white">{formatNumber(course.fullyPaid)}</span>,
              <span key="collected" className="font-black text-white">{formatMoney(course.collectedEgp, "جنيه مصري")}</span>,
              <div key="actions" className="flex flex-wrap gap-2">
                <Button href={`/courses/${course.id}`} variant="secondary" size="sm" icon="external">
                  التفاصيل
                </Button>
              </div>
            ];
          })}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="حالات الدورة المعتمدة"
          description="الحالة هنا ليست شكلية؛ بل تؤثر على التقارير، المتابعة، واستحقاق العمولة عند اكتمال شروطها."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["مخطط", "قبل فتح الحجز والحملات الرسمية."],
              ["مفتوحة للحجز", "التسجيلات تبدأ لكن لم يتحقق الحد الأدنى بعد."],
              ["تحت التجميع", "حجوزات قائمة مع متابعة مكثفة للوصول للحد الأدنى."],
              ["اكتمل الحد الأدنى", "جاهزة للتأكيد التشغيلي النهائي."],
              ["انعقدت", "تؤثر مباشرة على استحقاق العمولات إذا اكتمل السداد."],
              ["مؤجلة", "قد ينتج عنها تحويلات تسجيل بدل الاسترداد الكامل."]
            ].map(([status, description]) => (
              <div key={status} className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                <Badge label={status} tone={statusToneMap[status]} />
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="نموذج إضافة / تعديل دورة"
          description="مصمم ليلائم قواعد المرحلة الأولى مع أرشفة بدل الحذف المباشر."
          action={<Badge label="واجهة إضافة وتعديل" tone="gold" />}
          className="anchor-section"
        >
          <div id="create-form" className="grid gap-4 md:grid-cols-2">
            <Field label="كود الدورة" placeholder="دور-٢٤٠٧" />
            <Field label="اسم الدورة" placeholder="مثال: تسويق طبي — يونيو 2026" />
            <Field label="السعر القياسي" type="number" placeholder="2000" />
            <SelectField label="العملة الأساسية" options={["درهم إماراتي", "ريال سعودي", "جنيه مصري"]} defaultValue="درهم إماراتي" />
            <Field label="الحد الأدنى للانعقاد" type="number" placeholder="12" />
            <Field label="تاريخ البداية المتوقع" type="date" />
            <Field label="تاريخ النهاية المتوقع" type="date" />
            <SelectField
              label="حالة الدورة"
              options={["مخطط", "مفتوحة للحجز", "تحت التجميع", "اكتمل الحد الأدنى", "انعقدت", "مؤجلة", "ألغيت"]}
              defaultValue="مفتوحة للحجز"
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="ملاحظات"
                placeholder="أي ملاحظات تشغيلية أو أسباب تأجيل / إلغاء أو توجيهات خاصة بالتسجيلات."
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button icon="plus">حفظ الدورة</Button>
              <Button variant="secondary">حفظ كمسودة</Button>
              <Button variant="ghost">أرشفة بدل الحذف</Button>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="ملاحظات ضبط مهمة"
        description="التحقق من منطق الدورة قبل اعتمادها داخل النظام."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <InfoNote
            title="الحد الأدنى رقم حاكم"
            description="يجب أن يكون الحد الأدنى رقمًا صحيحًا موجبًا لأن النظام يستخدمه في المؤشرات والمتابعة."
          />
          <InfoNote
            icon="cash"
            title="الدورة لا تُحذف بعد وجود تسجيلات"
            description="يتم الأرشفة أو التغيير إلى حالة ألغيت بدل فقدان الأثر التاريخي."
          />
          <InfoNote
            icon="trend"
            title="التحصيلات مرتبطة بالدورة عبر التسجيل"
            description="لا يتم ربط الدفعات مباشرة بالدورة بدون وجود تسجيل عميل أساسي."
          />
        </div>
      </SectionCard>
    </div>
  );
}
