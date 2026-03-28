import { LoginForm } from "@/components/login-form";
import { AppLogo, Badge, Icon } from "@/components/ui";
import { brand } from "@/lib/brand";

const highlights = [
  "دخول آمن بدون أي عرض لأرصدة أو بيانات تشغيلية قبل التحقق من الهوية.",
  "صلاحيات منفصلة للمدير والمحاسب داخل بيئة عمل عربية واضحة.",
  "التقارير مهيأة للطباعة على مقاس أ٤ مع التصدير إلى ملف إكسل ورفع المرفقات."
];

export default function LoginPage() {
  return (
    <div className="min-h-screen px-5 py-8 md:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1360px] gap-6 xl:grid-cols-[1fr_minmax(0,430px)]">
        <div className="glass-card panel-sheen flex flex-col justify-between overflow-hidden p-6 md:p-8 lg:p-9">
          <div className="space-y-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <AppLogo />
              <Badge label="بوابة الدخول الآمنة" tone="gold" />
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,168,106,0.18)] bg-[var(--brand-gold-soft)] px-4 py-2 text-[11px] font-black text-[var(--brand-gold)]">
                <Icon name="shield" className="h-4 w-4" />
                <span>وصول مصرح به فقط</span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-[2rem] font-black leading-tight md:text-[2.45rem]">
                  {brand.centerName}
                </h1>
                <p className="max-w-2xl text-[14px] leading-8 text-[var(--text-secondary)]">
                  {brand.systemDescription}. تم تبسيط صفحة الدخول لتكون مباشرة وآمنة، بحيث يرى المستخدم
                  العنوان وحقول الدخول فقط دون أي بيانات مالية أو معلومات داخلية قبل تسجيل الدخول.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/4 px-4 py-4">
                  <div className="mt-1 grid h-9 w-9 place-items-center rounded-2xl bg-[var(--brand-cyan-soft)] text-[var(--brand-cyan)]">
                    <Icon name="spark" className="h-4 w-4" />
                  </div>
                  <p className="text-[13px] leading-7 text-[var(--text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-divider mt-8 flex flex-col gap-4 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-[13px] leading-7 text-[var(--text-secondary)]">
              الواجهة موجهة للإدارة والمحاسبة داخل مركز فينكس، وتراعي وضوح القراءة، وسهولة المتابعة،
              وعزل البيانات الحساسة عن الزوار غير المصرح لهم.
            </p>
            <p className="text-[13px] font-bold text-[var(--text-muted)]">{brand.footerCredit}</p>
          </div>
        </div>

        <div className="flex items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
