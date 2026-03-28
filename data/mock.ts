import type { IconName } from "@/components/ui";

export type CurrencyCode = "EGP" | "AED" | "SAR";

export type CourseStatus =
  | "مخطط"
  | "مفتوحة للحجز"
  | "تحت التجميع"
  | "اكتمل الحد الأدنى"
  | "انعقدت"
  | "مؤجلة"
  | "ألغيت";

export type PaymentStatus =
  | "غير مدفوع"
  | "مدفوع جزئيًا"
  | "مدفوع كاملًا"
  | "مستحق له استرداد"
  | "مسترد جزئيًا"
  | "مسترد كليًا"
  | "محول إلى دورة أخرى";

export type RegistrationStatus =
  | "مبدئي"
  | "مؤكد"
  | "بانتظار اكتمال السداد"
  | "بانتظار انعقاد الدورة"
  | "نشط"
  | "منسحب"
  | "ملغي"
  | "محول"
  | "مكتمل";

export type CommissionStatus =
  | "محسوبة مبدئيًا"
  | "غير مستحقة بعد"
  | "مستحقة"
  | "مصروفة"
  | "ملغاة";

export type CollectionStatus =
  | "مؤكدة"
  | "ملغاة"
  | "مستردة جزئيًا"
  | "مستردة كليًا";

export interface Course {
  id: string;
  code: string;
  name: string;
  standardPrice: number;
  currency: CurrencyCode;
  minParticipants: number;
  expectedStart: string;
  expectedEnd: string;
  status: CourseStatus;
  registrations: number;
  fullyPaid: number;
  collectedEgp: number;
  notes: string;
}

export interface SalesRep {
  id: string;
  code: string;
  name: string;
  phone: string;
  status: "نشط" | "غير نشط";
  defaultCommissionRate: number;
  registrations: number;
  salesEgp: number;
  expectedCommissionEgp: number;
  eligibleCommissionEgp: number;
  paidCommissionEgp: number;
  cancelledCommissionEgp: number;
  notes: string;
}

export interface Party {
  id: string;
  code: string;
  name: string;
  adminRole: string;
  isPartner: boolean;
  isFunder: boolean;
  receivesMoney: boolean;
  paysExpenses: boolean;
  ownsCollectionAccount: boolean;
  hasRunningBalance: boolean;
  linkedAccountIds: string[];
  accountingNotes: string;
  status: "نشط" | "غير نشط";
  fundsHeldEgp: number;
  personalSpendEgp: number;
  settledEgp: number;
  outstandingEgp: number;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: "بنك" | "محفظة" | "تحويل فوري" | "منصة دفع" | "خزنة";
  ownerPartyId: string;
  isPersonal: boolean;
  baseCurrency: CurrencyCode;
  acceptsCollections: boolean;
  canSpend: boolean;
  canTransferToCash: boolean;
  status: "نشط" | "غير نشط";
  notes: string;
  balanceOriginal: number;
  balanceEgp: number;
  totalCollectedEgp: number;
  feesEgp: number;
  transferredToCashEgp: number;
  netAvailableEgp: number;
}

export interface Registration {
  id: string;
  code: string;
  date: string;
  customerName: string;
  phone: string;
  country: string;
  city: string;
  source: string;
  courseId: string;
  salesRepId: string;
  standardPrice: number;
  soldPrice: number;
  soldPriceEgp: number;
  discount: number;
  currency: CurrencyCode;
  commissionRate: number;
  expectedCommission: number;
  expectedCommissionEgp: number;
  eligibleCommissionEgp: number;
  paidCommissionEgp: number;
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  commissionStatus: CommissionStatus;
  totalPaid: number;
  totalPaidEgp: number;
  remaining: number;
  remainingEgp: number;
  notes: string;
}

export interface Collection {
  id: string;
  registrationId: string;
  date: string;
  paymentType: string;
  amountOriginal: number;
  currency: CurrencyCode;
  exchangeRate: number;
  amountEgp: number;
  accountId: string;
  collectorPartyId: string;
  grossBeforeFees: number;
  status: CollectionStatus;
  notes: string;
}

export interface Fee {
  id: string;
  date: string;
  accountId: string;
  operationType: "تحصيل" | "تحويل" | "سحب" | "تسوية";
  referenceId: string;
  feeType: string;
  amountOriginal: number;
  currency: CurrencyCode;
  exchangeRate: number;
  amountEgp: number;
  notes: string;
}

export interface Refund {
  id: string;
  registrationId: string;
  customerName: string;
  courseId: string;
  date: string;
  refundType: "جزئي" | "كلي";
  amountOriginal: number;
  currency: CurrencyCode;
  exchangeRate: number;
  amountEgp: number;
  accountId: string;
  processedByPartyId: string;
  reason: string;
  notes: string;
}

export interface RegistrationTransfer {
  id: string;
  originalRegistrationId: string;
  newRegistrationId: string;
  originalCourseId: string;
  newCourseId: string;
  date: string;
  amountOriginal: number;
  currency: CurrencyCode;
  exchangeRate: number;
  amountEgp: number;
  reason: string;
  notes: string;
}

export interface InternalTransfer {
  id: string;
  date: string;
  fromAccountId: string;
  toAccountId: string;
  amountOriginal: number;
  currency: CurrencyCode;
  exchangeRate: number;
  amountEgp: number;
  relatedFeesEgp: number;
  netDeliveredEgp: number;
  receiverPartyId: string;
  notes: string;
}

export interface Expense {
  id: string;
  date: string;
  mainClass: "تأسيس" | "أصل" | "تشغيل" | "رسوم تحصيل";
  subClass: string;
  description: string;
  vendor: string;
  amountOriginal: number;
  currency: CurrencyCode;
  exchangeRate: number;
  amountEgp: number;
  paidByPartyId: string;
  paidFromAccountId: string;
  settled: boolean;
  notes: string;
}

export const courseStatusOptions: CourseStatus[] = [
  "مخطط",
  "مفتوحة للحجز",
  "تحت التجميع",
  "اكتمل الحد الأدنى",
  "انعقدت",
  "مؤجلة",
  "ألغيت"
];

export const paymentStatusOptions: PaymentStatus[] = [
  "غير مدفوع",
  "مدفوع جزئيًا",
  "مدفوع كاملًا",
  "مستحق له استرداد",
  "مسترد جزئيًا",
  "مسترد كليًا",
  "محول إلى دورة أخرى"
];

export const registrationStatusOptions: RegistrationStatus[] = [
  "مبدئي",
  "مؤكد",
  "بانتظار اكتمال السداد",
  "بانتظار انعقاد الدورة",
  "نشط",
  "منسحب",
  "ملغي",
  "محول",
  "مكتمل"
];

export const commissionStatusOptions: CommissionStatus[] = [
  "محسوبة مبدئيًا",
  "غير مستحقة بعد",
  "مستحقة",
  "مصروفة",
  "ملغاة"
];

export const collectionStatusOptions: CollectionStatus[] = [
  "مؤكدة",
  "ملغاة",
  "مستردة جزئيًا",
  "مستردة كليًا"
];

export const feeTypeOptions = [
  "رسوم سترايب",
  "رسوم فودافون كاش",
  "رسوم إنستاباي",
  "رسوم تحويل بنكي",
  "رسوم سحب",
  "فرق عملة",
  "أخرى"
];

export const refundReasonOptions = [
  "انسحاب عميل",
  "عدم انعقاد الدورة",
  "خطأ في التحصيل",
  "تسوية خاصة"
];

export const transferReasonOptions = [
  "تأجيل العميل",
  "إلغاء الدورة الأصلية",
  "نقل بطلب العميل",
  "قرار إداري"
];

export const courses: Course[] = [
  {
    "id": "course-spahi-apr-2026",
    "code": "CRS-2401",
    "name": "سباهي أسنان — أبريل 2026",
    "standardPrice": 2000,
    "currency": "AED",
    "minParticipants": 14,
    "expectedStart": "2026-04-12",
    "expectedEnd": "2026-04-22",
    "status": "مفتوحة للحجز",
    "registrations": 18,
    "fullyPaid": 11,
    "collectedEgp": 246300,
    "notes": "أعلى دورة من حيث سرعة التحصيل عبر Stripe والحساب السعودي."
  },
  {
    "id": "course-marketing-may-2026",
    "code": "CRS-2402",
    "name": "التسويق الطبي — مايو 2026",
    "standardPrice": 2400,
    "currency": "AED",
    "minParticipants": 12,
    "expectedStart": "2026-05-06",
    "expectedEnd": "2026-05-20",
    "status": "تحت التجميع",
    "registrations": 9,
    "fullyPaid": 3,
    "collectedEgp": 142500,
    "notes": "الدورة تحتاج 3 تسجيلات مؤكدة إضافية للوصول إلى الحد الأدنى."
  },
  {
    "id": "course-arch-jun-2026",
    "code": "CRS-2403",
    "name": "التصميم المعماري — يونيو 2026",
    "standardPrice": 2600,
    "currency": "AED",
    "minParticipants": 10,
    "expectedStart": "2026-06-02",
    "expectedEnd": "2026-06-18",
    "status": "مخطط",
    "registrations": 4,
    "fullyPaid": 1,
    "collectedEgp": 38800,
    "notes": "قيد البناء التسويقي ولم تبدأ حملات التحصيل المكثفة بعد."
  },
  {
    "id": "course-security-mar-2026",
    "code": "CRS-2404",
    "name": "أمن المنشآت — مارس 2026",
    "standardPrice": 2000,
    "currency": "AED",
    "minParticipants": 16,
    "expectedStart": "2026-03-10",
    "expectedEnd": "2026-03-24",
    "status": "انعقدت",
    "registrations": 21,
    "fullyPaid": 18,
    "collectedEgp": 358200,
    "notes": "الدورة المرجعية الحالية في التقارير التنفيذية واحتساب العمولات المستحقة."
  },
  {
    "id": "course-horses-mar-2026",
    "code": "CRS-2405",
    "name": "إدارة الخيول — مارس 2026",
    "standardPrice": 1900,
    "currency": "AED",
    "minParticipants": 11,
    "expectedStart": "2026-03-05",
    "expectedEnd": "2026-03-16",
    "status": "مؤجلة",
    "registrations": 7,
    "fullyPaid": 4,
    "collectedEgp": 120500,
    "notes": "بعض التسجيلات تم تحويلها إلى دورات أخرى بدلًا من الاسترداد الكامل."
  },
  {
    "id": "course-healthcare-ops-apr-2026",
    "code": "CRS-2406",
    "name": "إدارة التشغيل الطبي — أبريل 2026",
    "standardPrice": 2300,
    "currency": "AED",
    "minParticipants": 9,
    "expectedStart": "2026-04-28",
    "expectedEnd": "2026-05-09",
    "status": "اكتمل الحد الأدنى",
    "registrations": 10,
    "fullyPaid": 6,
    "collectedEgp": 199100,
    "notes": "جاهزة للانتقال إلى حالة انعقدت بعد تأكيد المدرب والجدول."
  }
];

export const salesReps: SalesRep[] = [
  {
    "id": "rep-layan",
    "code": "SR-01",
    "name": "ليان حسني",
    "phone": "01012004561",
    "status": "نشط",
    "defaultCommissionRate": 3.0,
    "registrations": 11,
    "salesEgp": 356400,
    "expectedCommissionEgp": 10692,
    "eligibleCommissionEgp": 4320,
    "paidCommissionEgp": 2700,
    "cancelledCommissionEgp": 810,
    "notes": "متخصصة في دورات سباهي أسنان والتسجيلات الخليجية."
  },
  {
    "id": "rep-yousef",
    "code": "SR-02",
    "name": "يوسف عادل",
    "phone": "01088231124",
    "status": "نشط",
    "defaultCommissionRate": 2.75,
    "registrations": 9,
    "salesEgp": 281900,
    "expectedCommissionEgp": 7752,
    "eligibleCommissionEgp": 3480,
    "paidCommissionEgp": 1920,
    "cancelledCommissionEgp": 0,
    "notes": "أفضل أداء في المتابعة حتى السداد الكامل."
  },
  {
    "id": "rep-mariam",
    "code": "SR-03",
    "name": "مريم طارق",
    "phone": "01144672290",
    "status": "نشط",
    "defaultCommissionRate": 3.25,
    "registrations": 7,
    "salesEgp": 225700,
    "expectedCommissionEgp": 7335,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "cancelledCommissionEgp": 525,
    "notes": "تركز على ملفات تحت التجميع والتحويلات بين الدورات."
  },
  {
    "id": "rep-karim",
    "code": "SR-04",
    "name": "كريم ناصر",
    "phone": "01223094418",
    "status": "غير نشط",
    "defaultCommissionRate": 2.5,
    "registrations": 4,
    "salesEgp": 90400,
    "expectedCommissionEgp": 2260,
    "eligibleCommissionEgp": 1260,
    "paidCommissionEgp": 1260,
    "cancelledCommissionEgp": 0,
    "notes": "تم الإيقاف بعد إغلاق حملات الربع الأول مع الاحتفاظ بسجل العمولات."
  }
];

export const parties: Party[] = [
  {
    "id": "party-hamada",
    "code": "PRT-01",
    "name": "حمادة",
    "adminRole": "شريك ممول",
    "isPartner": true,
    "isFunder": true,
    "receivesMoney": true,
    "paysExpenses": true,
    "ownsCollectionAccount": true,
    "hasRunningBalance": true,
    "linkedAccountIds": [
      "acc-saudi-bank"
    ],
    "accountingNotes": "الممول الرئيسي للمركز وصاحب الحساب السعودي المستخدم في التحصيل والتحويلات الدولية.",
    "status": "نشط",
    "fundsHeldEgp": 40560,
    "personalSpendEgp": 112300,
    "settledEgp": 76400,
    "outstandingEgp": 35900
  },
  {
    "id": "party-amal",
    "code": "PRT-02",
    "name": "أمل",
    "adminRole": "شريك + مدير عام",
    "isPartner": true,
    "isFunder": false,
    "receivesMoney": true,
    "paysExpenses": true,
    "ownsCollectionAccount": true,
    "hasRunningBalance": true,
    "linkedAccountIds": [
      "acc-vodafone-cash"
    ],
    "accountingNotes": "تستقبل تحصيلات محلية على فودافون كاش وتدعم بعض المصروفات التشغيلية السريعة.",
    "status": "نشط",
    "fundsHeldEgp": 22450,
    "personalSpendEgp": 7450,
    "settledEgp": 5200,
    "outstandingEgp": 2250
  },
  {
    "id": "party-sarah",
    "code": "PRT-03",
    "name": "سارة",
    "adminRole": "شريك + مدير تنفيذي",
    "isPartner": true,
    "isFunder": false,
    "receivesMoney": true,
    "paysExpenses": true,
    "ownsCollectionAccount": true,
    "hasRunningBalance": true,
    "linkedAccountIds": [
      "acc-instapay"
    ],
    "accountingNotes": "صاحبة حساب إنستاباي المرتبط بتحصيلات محلية وتحويلات سريعة إلى الخزنة.",
    "status": "نشط",
    "fundsHeldEgp": 15200,
    "personalSpendEgp": 4380,
    "settledEgp": 2980,
    "outstandingEgp": 1400
  },
  {
    "id": "party-ahmed",
    "code": "PRT-04",
    "name": "أحمد",
    "adminRole": "مسؤول الحملات + منفذ تقني",
    "isPartner": false,
    "isFunder": false,
    "receivesMoney": true,
    "paysExpenses": true,
    "ownsCollectionAccount": true,
    "hasRunningBalance": true,
    "linkedAccountIds": [
      "acc-stripe"
    ],
    "accountingNotes": "مسؤول Stripe والحملات الإعلانية وقد يسجل له مصروفات تشغيلية أو رسوم بوابة الدفع.",
    "status": "نشط",
    "fundsHeldEgp": 64738,
    "personalSpendEgp": 11840,
    "settledEgp": 8300,
    "outstandingEgp": 3540
  },
  {
    "id": "party-accountant",
    "code": "PRT-05",
    "name": "المحاسب",
    "adminRole": "مسؤول مالي",
    "isPartner": false,
    "isFunder": false,
    "receivesMoney": false,
    "paysExpenses": false,
    "ownsCollectionAccount": true,
    "hasRunningBalance": false,
    "linkedAccountIds": [
      "acc-cashbox"
    ],
    "accountingNotes": "نقطة التجميع النهائية للبيانات والأرصدة وحركات الخزنة.",
    "status": "نشط",
    "fundsHeldEgp": 124560,
    "personalSpendEgp": 0,
    "settledEgp": 0,
    "outstandingEgp": 0
  }
];

export const accounts: Account[] = [
  {
    "id": "acc-saudi-bank",
    "code": "ACC-01",
    "name": "الحساب السعودي — حمادة",
    "type": "بنك",
    "ownerPartyId": "party-hamada",
    "isPersonal": true,
    "baseCurrency": "SAR",
    "acceptsCollections": true,
    "canSpend": false,
    "canTransferToCash": true,
    "status": "نشط",
    "notes": "يستخدم للتحصيلات الخليجية والتحويلات الواردة من العملاء في السعودية.",
    "balanceOriginal": 3100,
    "balanceEgp": 40560,
    "totalCollectedEgp": 62100,
    "feesEgp": 457,
    "transferredToCashEgp": 28776,
    "netAvailableEgp": 40103
  },
  {
    "id": "acc-vodafone-cash",
    "code": "ACC-02",
    "name": "فودافون كاش — أمل",
    "type": "محفظة",
    "ownerPartyId": "party-amal",
    "isPersonal": true,
    "baseCurrency": "EGP",
    "acceptsCollections": true,
    "canSpend": true,
    "canTransferToCash": true,
    "status": "نشط",
    "notes": "قناة تحصيل محلية سريعة للدفع الجزئي والتحصيلات المصرية.",
    "balanceOriginal": 22450,
    "balanceEgp": 22450,
    "totalCollectedEgp": 41200,
    "feesEgp": 18,
    "transferredToCashEgp": 17982,
    "netAvailableEgp": 22450
  },
  {
    "id": "acc-instapay",
    "code": "ACC-03",
    "name": "إنستاباي — سارة",
    "type": "تحويل فوري",
    "ownerPartyId": "party-sarah",
    "isPersonal": true,
    "baseCurrency": "EGP",
    "acceptsCollections": true,
    "canSpend": true,
    "canTransferToCash": true,
    "status": "نشط",
    "notes": "يستخدم للتحصيلات المحلية السريعة والردود الجزئية البسيطة.",
    "balanceOriginal": 15200,
    "balanceEgp": 15200,
    "totalCollectedEgp": 18240,
    "feesEgp": 0,
    "transferredToCashEgp": 11600,
    "netAvailableEgp": 15200
  },
  {
    "id": "acc-stripe",
    "code": "ACC-04",
    "name": "سترايب — أحمد",
    "type": "منصة دفع",
    "ownerPartyId": "party-ahmed",
    "isPersonal": false,
    "baseCurrency": "AED",
    "acceptsCollections": true,
    "canSpend": false,
    "canTransferToCash": true,
    "status": "نشط",
    "notes": "بوابة الدفع الإلكترونية الأساسية للتحصيلات الدولية متعددة البطاقات.",
    "balanceOriginal": 4860,
    "balanceEgp": 64738,
    "totalCollectedEgp": 116482,
    "feesEgp": 3042,
    "transferredToCashEgp": 47486,
    "netAvailableEgp": 61540
  },
  {
    "id": "acc-cashbox",
    "code": "ACC-05",
    "name": "خزنة المركز",
    "type": "خزنة",
    "ownerPartyId": "party-accountant",
    "isPersonal": false,
    "baseCurrency": "EGP",
    "acceptsCollections": false,
    "canSpend": true,
    "canTransferToCash": false,
    "status": "نشط",
    "notes": "تمثل النقدية الفعلية داخل المركز ولا تتغير إلا بالحركات التي دخلت أو خرجت فعليًا.",
    "balanceOriginal": 124560,
    "balanceEgp": 124560,
    "totalCollectedEgp": 105844,
    "feesEgp": 0,
    "transferredToCashEgp": 0,
    "netAvailableEgp": 124560
  }
];

export const registrations: Registration[] = [
  {
    "id": "reg-2401",
    "code": "REG-2401",
    "date": "2026-03-09",
    "customerName": "سارة خالد",
    "phone": "0502211445",
    "country": "الإمارات",
    "city": "دبي",
    "source": "حملة بحث جوجل",
    "courseId": "course-spahi-apr-2026",
    "salesRepId": "rep-layan",
    "standardPrice": 2000,
    "soldPrice": 1800,
    "soldPriceEgp": 24012,
    "discount": 200,
    "currency": "AED",
    "commissionRate": 3.0,
    "expectedCommission": 54,
    "expectedCommissionEgp": 720,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "مدفوع كاملًا",
    "registrationStatus": "بانتظار انعقاد الدورة",
    "commissionStatus": "غير مستحقة بعد",
    "totalPaid": 1800,
    "totalPaidEgp": 23867,
    "remaining": 0,
    "remainingEgp": 0,
    "notes": "أغلقت الصفقة بخصم معتمد من الإدارة؛ العميل دفع على وسيلتين مختلفتين."
  },
  {
    "id": "reg-2402",
    "code": "REG-2402",
    "date": "2026-03-12",
    "customerName": "محمد نور",
    "phone": "01034455678",
    "country": "مصر",
    "city": "القاهرة",
    "source": "واتساب الإعلانات",
    "courseId": "course-marketing-may-2026",
    "salesRepId": "rep-yousef",
    "standardPrice": 2400,
    "soldPrice": 2300,
    "soldPriceEgp": 30659,
    "discount": 100,
    "currency": "AED",
    "commissionRate": 2.75,
    "expectedCommission": 63.25,
    "expectedCommissionEgp": 842,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "مدفوع جزئيًا",
    "registrationStatus": "بانتظار اكتمال السداد",
    "commissionStatus": "غير مستحقة بعد",
    "totalPaid": 900,
    "totalPaidEgp": 12015,
    "remaining": 1400,
    "remainingEgp": 18644,
    "notes": "يحتاج متابعة تحصيل خلال 5 أيام قبل تثبيت المقعد."
  },
  {
    "id": "reg-2403",
    "code": "REG-2403",
    "date": "2026-02-18",
    "customerName": "ريم أحمد",
    "phone": "0561132098",
    "country": "السعودية",
    "city": "جدة",
    "source": "إحالة عميل سابق",
    "courseId": "course-security-mar-2026",
    "salesRepId": "rep-yousef",
    "standardPrice": 2000,
    "soldPrice": 2000,
    "soldPriceEgp": 26700,
    "discount": 0,
    "currency": "AED",
    "commissionRate": 3.0,
    "expectedCommission": 60,
    "expectedCommissionEgp": 801,
    "eligibleCommissionEgp": 801,
    "paidCommissionEgp": 0,
    "paymentStatus": "مدفوع كاملًا",
    "registrationStatus": "مكتمل",
    "commissionStatus": "مستحقة",
    "totalPaid": 2000,
    "totalPaidEgp": 26700,
    "remaining": 0,
    "remainingEgp": 0,
    "notes": "الدورة انعقدت والسداد اكتمل؛ تم ترحيل العمولة إلى كشف الاستحقاق."
  },
  {
    "id": "reg-2404",
    "code": "REG-2404",
    "date": "2026-02-20",
    "customerName": "خالد الشريف",
    "phone": "0557712390",
    "country": "الإمارات",
    "city": "أبوظبي",
    "source": "حملة Meta Lead Ads",
    "courseId": "course-horses-mar-2026",
    "salesRepId": "rep-mariam",
    "standardPrice": 1900,
    "soldPrice": 1900,
    "soldPriceEgp": 25270,
    "discount": 0,
    "currency": "AED",
    "commissionRate": 3.0,
    "expectedCommission": 57,
    "expectedCommissionEgp": 758,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "مسترد كليًا",
    "registrationStatus": "ملغي",
    "commissionStatus": "ملغاة",
    "totalPaid": 1900,
    "totalPaidEgp": 25270,
    "remaining": 0,
    "remainingEgp": 0,
    "notes": "استرداد كامل بسبب عدم انعقاد الدورة الأصلية."
  },
  {
    "id": "reg-2405",
    "code": "REG-2405",
    "date": "2026-03-18",
    "customerName": "نورهان صلاح",
    "phone": "01098765431",
    "country": "مصر",
    "city": "الجيزة",
    "source": "فيسبوك مباشر",
    "courseId": "course-spahi-apr-2026",
    "salesRepId": "rep-layan",
    "standardPrice": 2000,
    "soldPrice": 1700,
    "soldPriceEgp": 22661,
    "discount": 300,
    "currency": "AED",
    "commissionRate": 2.5,
    "expectedCommission": 42.5,
    "expectedCommissionEgp": 566,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "مسترد جزئيًا",
    "registrationStatus": "مؤكد",
    "commissionStatus": "غير مستحقة بعد",
    "totalPaid": 700,
    "totalPaidEgp": 9310,
    "remaining": 1000,
    "remainingEgp": 13351,
    "notes": "تم رد جزء من المقدم مع إبقاء التسجيل نشطًا لحين تأكيد الحضور."
  },
  {
    "id": "reg-2406",
    "code": "REG-2406",
    "date": "2026-02-16",
    "customerName": "فهد الجابري",
    "phone": "0535566778",
    "country": "السعودية",
    "city": "الرياض",
    "source": "توصية شريك",
    "courseId": "course-security-mar-2026",
    "salesRepId": "rep-karim",
    "standardPrice": 2000,
    "soldPrice": 2000,
    "soldPriceEgp": 25800,
    "discount": 0,
    "currency": "SAR",
    "commissionRate": 2.5,
    "expectedCommission": 50,
    "expectedCommissionEgp": 645,
    "eligibleCommissionEgp": 645,
    "paidCommissionEgp": 645,
    "paymentStatus": "مدفوع كاملًا",
    "registrationStatus": "مكتمل",
    "commissionStatus": "مصروفة",
    "totalPaid": 2000,
    "totalPaidEgp": 25800,
    "remaining": 0,
    "remainingEgp": 0,
    "notes": "سدد كاملًا عبر الحساب السعودي وتم صرف العمولة بعد انعقاد الدورة."
  },
  {
    "id": "reg-2407",
    "code": "REG-2407",
    "date": "2026-03-20",
    "customerName": "داليا ممدوح",
    "phone": "01077711229",
    "country": "مصر",
    "city": "الإسكندرية",
    "source": "حملة إعادة الاستهداف",
    "courseId": "course-healthcare-ops-apr-2026",
    "salesRepId": "rep-mariam",
    "standardPrice": 2300,
    "soldPrice": 2200,
    "soldPriceEgp": 29348,
    "discount": 100,
    "currency": "AED",
    "commissionRate": 3.25,
    "expectedCommission": 71.5,
    "expectedCommissionEgp": 953,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "مدفوع كاملًا",
    "registrationStatus": "بانتظار انعقاد الدورة",
    "commissionStatus": "غير مستحقة بعد",
    "totalPaid": 2200,
    "totalPaidEgp": 29348,
    "remaining": 0,
    "remainingEgp": 0,
    "notes": "التسجيل مكتمل ماليًا لكن الدورة لم تنعقد بعد."
  },
  {
    "id": "reg-2408",
    "code": "REG-2408",
    "date": "2026-03-01",
    "customerName": "منة الشاذلي",
    "phone": "0507766001",
    "country": "الإمارات",
    "city": "الشارقة",
    "source": "Inbound WhatsApp",
    "courseId": "course-horses-mar-2026",
    "salesRepId": "rep-layan",
    "standardPrice": 1900,
    "soldPrice": 1400,
    "soldPriceEgp": 18676,
    "discount": 500,
    "currency": "AED",
    "commissionRate": 2.5,
    "expectedCommission": 35,
    "expectedCommissionEgp": 467,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "محول إلى دورة أخرى",
    "registrationStatus": "محول",
    "commissionStatus": "غير مستحقة بعد",
    "totalPaid": 1400,
    "totalPaidEgp": 18676,
    "remaining": 0,
    "remainingEgp": 0,
    "notes": "تم تحويل الرصيد بالكامل إلى دورة بديلة بعد تأجيل الدورة الأصلية."
  },
  {
    "id": "reg-2409",
    "code": "REG-2409",
    "date": "2026-03-21",
    "customerName": "منة الشاذلي",
    "phone": "0507766001",
    "country": "الإمارات",
    "city": "الشارقة",
    "source": "تحويل من تسجيل سابق",
    "courseId": "course-marketing-may-2026",
    "salesRepId": "rep-layan",
    "standardPrice": 2400,
    "soldPrice": 1800,
    "soldPriceEgp": 24066,
    "discount": 600,
    "currency": "AED",
    "commissionRate": 2.5,
    "expectedCommission": 45,
    "expectedCommissionEgp": 602,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "مدفوع جزئيًا",
    "registrationStatus": "مؤكد",
    "commissionStatus": "غير مستحقة بعد",
    "totalPaid": 1400,
    "totalPaidEgp": 18676,
    "remaining": 400,
    "remainingEgp": 5390,
    "notes": "الرصيد المحول غطى الجزء الأكبر من قيمة التسجيل الجديد."
  },
  {
    "id": "reg-2410",
    "code": "REG-2410",
    "date": "2026-03-24",
    "customerName": "إيمان صبحي",
    "phone": "01122004499",
    "country": "مصر",
    "city": "المنصورة",
    "source": "Referral partner",
    "courseId": "course-spahi-apr-2026",
    "salesRepId": "rep-yousef",
    "standardPrice": 2000,
    "soldPrice": 1950,
    "soldPriceEgp": 26013,
    "discount": 50,
    "currency": "AED",
    "commissionRate": 2.75,
    "expectedCommission": 53.63,
    "expectedCommissionEgp": 715,
    "eligibleCommissionEgp": 0,
    "paidCommissionEgp": 0,
    "paymentStatus": "غير مدفوع",
    "registrationStatus": "مبدئي",
    "commissionStatus": "محسوبة مبدئيًا",
    "totalPaid": 0,
    "totalPaidEgp": 0,
    "remaining": 1950,
    "remainingEgp": 26013,
    "notes": "تم إنشاء التسجيل بانتظار أول دفعة خلال 48 ساعة."
  }
];

export const collections: Collection[] = [
  {
    "id": "col-2401",
    "registrationId": "reg-2401",
    "date": "2026-03-10",
    "paymentType": "مقدم",
    "amountOriginal": 500,
    "currency": "SAR",
    "exchangeRate": 13.05,
    "amountEgp": 6525,
    "accountId": "acc-saudi-bank",
    "collectorPartyId": "party-hamada",
    "grossBeforeFees": 500,
    "status": "مؤكدة",
    "notes": "دفعة أولى لضمان المقعد."
  },
  {
    "id": "col-2402",
    "registrationId": "reg-2401",
    "date": "2026-03-15",
    "paymentType": "استكمال",
    "amountOriginal": 1300,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 17342,
    "accountId": "acc-stripe",
    "collectorPartyId": "party-ahmed",
    "grossBeforeFees": 1300,
    "status": "مؤكدة",
    "notes": "استكمال إلكتروني عبر Stripe."
  },
  {
    "id": "col-2403",
    "registrationId": "reg-2402",
    "date": "2026-03-12",
    "paymentType": "دفعة جزئية",
    "amountOriginal": 900,
    "currency": "AED",
    "exchangeRate": 13.35,
    "amountEgp": 12015,
    "accountId": "acc-stripe",
    "collectorPartyId": "party-ahmed",
    "grossBeforeFees": 900,
    "status": "مؤكدة",
    "notes": "تحصيل مبدئي قبل إرسال العقد."
  },
  {
    "id": "col-2404",
    "registrationId": "reg-2403",
    "date": "2026-02-20",
    "paymentType": "سداد كامل",
    "amountOriginal": 2000,
    "currency": "AED",
    "exchangeRate": 13.35,
    "amountEgp": 26700,
    "accountId": "acc-stripe",
    "collectorPartyId": "party-ahmed",
    "grossBeforeFees": 2000,
    "status": "مؤكدة",
    "notes": "سداد كامل لدورة أمن المنشآت."
  },
  {
    "id": "col-2405",
    "registrationId": "reg-2404",
    "date": "2026-02-22",
    "paymentType": "سداد كامل",
    "amountOriginal": 1900,
    "currency": "AED",
    "exchangeRate": 13.3,
    "amountEgp": 25270,
    "accountId": "acc-stripe",
    "collectorPartyId": "party-ahmed",
    "grossBeforeFees": 1900,
    "status": "مستردة كليًا",
    "notes": "العملية الأصلية المرتبطة بالاسترداد الكامل."
  },
  {
    "id": "col-2406",
    "registrationId": "reg-2405",
    "date": "2026-03-18",
    "paymentType": "مقدم",
    "amountOriginal": 700,
    "currency": "AED",
    "exchangeRate": 13.3,
    "amountEgp": 9310,
    "accountId": "acc-instapay",
    "collectorPartyId": "party-sarah",
    "grossBeforeFees": 700,
    "status": "مستردة جزئيًا",
    "notes": "تم رد جزء من المبلغ مع إبقاء التسجيل نشطًا."
  },
  {
    "id": "col-2407",
    "registrationId": "reg-2406",
    "date": "2026-02-18",
    "paymentType": "سداد كامل",
    "amountOriginal": 2000,
    "currency": "SAR",
    "exchangeRate": 12.9,
    "amountEgp": 25800,
    "accountId": "acc-saudi-bank",
    "collectorPartyId": "party-hamada",
    "grossBeforeFees": 2000,
    "status": "مؤكدة",
    "notes": "تحصيل كامل من عميل سعودي."
  },
  {
    "id": "col-2408",
    "registrationId": "reg-2407",
    "date": "2026-03-20",
    "paymentType": "سداد كامل",
    "amountOriginal": 2200,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 29348,
    "accountId": "acc-stripe",
    "collectorPartyId": "party-ahmed",
    "grossBeforeFees": 2200,
    "status": "مؤكدة",
    "notes": "تحصيل كامل لدورة إدارة التشغيل الطبي."
  },
  {
    "id": "col-2409",
    "registrationId": "reg-2408",
    "date": "2026-03-01",
    "paymentType": "سداد كامل",
    "amountOriginal": 1400,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 18676,
    "accountId": "acc-stripe",
    "collectorPartyId": "party-ahmed",
    "grossBeforeFees": 1400,
    "status": "مؤكدة",
    "notes": "تحصيل تم لاحقًا تحويله إلى تسجيل جديد."
  },
  {
    "id": "col-2410",
    "registrationId": "reg-2409",
    "date": "2026-03-21",
    "paymentType": "تحويل رصيد",
    "amountOriginal": 1400,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 18676,
    "accountId": "acc-cashbox",
    "collectorPartyId": "party-accountant",
    "grossBeforeFees": 1400,
    "status": "مؤكدة",
    "notes": "أثر مالي ناتج عن تحويل التسجيل."
  },
  {
    "id": "col-2411",
    "registrationId": "reg-2403",
    "date": "2026-02-23",
    "paymentType": "رسوم مواد",
    "amountOriginal": 1200,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 1200,
    "accountId": "acc-vodafone-cash",
    "collectorPartyId": "party-amal",
    "grossBeforeFees": 1200,
    "status": "مؤكدة",
    "notes": "رسوم إضافية موثقة على نفس التسجيل."
  },
  {
    "id": "col-2412",
    "registrationId": "reg-2405",
    "date": "2026-03-22",
    "paymentType": "دفعة جزئية",
    "amountOriginal": 3500,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 3500,
    "accountId": "acc-vodafone-cash",
    "collectorPartyId": "party-amal",
    "grossBeforeFees": 3500,
    "status": "مؤكدة",
    "notes": "دفعة محلية مكملة بعد خصم الاسترداد الجزئي."
  }
];

export const fees: Fee[] = [
  {
    "id": "fee-2401",
    "date": "2026-03-15",
    "accountId": "acc-stripe",
    "operationType": "تحصيل",
    "referenceId": "col-2402",
    "feeType": "رسوم سترايب",
    "amountOriginal": 82,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 1094,
    "notes": "اقتطاع Stripe على عملية الاستكمال."
  },
  {
    "id": "fee-2402",
    "date": "2026-03-18",
    "accountId": "acc-stripe",
    "operationType": "تحصيل",
    "referenceId": "col-2403",
    "feeType": "رسوم سترايب",
    "amountOriginal": 54,
    "currency": "AED",
    "exchangeRate": 13.35,
    "amountEgp": 721,
    "notes": "رسوم التحصيل على الدفعة الجزئية."
  },
  {
    "id": "fee-2403",
    "date": "2026-03-11",
    "accountId": "acc-saudi-bank",
    "operationType": "تحويل",
    "referenceId": "it-2401",
    "feeType": "رسوم تحويل بنكي",
    "amountOriginal": 35,
    "currency": "SAR",
    "exchangeRate": 13.05,
    "amountEgp": 457,
    "notes": "رسوم التحويل من الحساب السعودي إلى الخزنة."
  },
  {
    "id": "fee-2404",
    "date": "2026-03-24",
    "accountId": "acc-vodafone-cash",
    "operationType": "تحويل",
    "referenceId": "it-2403",
    "feeType": "رسوم فودافون كاش",
    "amountOriginal": 18,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 18,
    "notes": "رسوم سحب وتحويل محفظة."
  },
  {
    "id": "fee-2405",
    "date": "2026-03-20",
    "accountId": "acc-stripe",
    "operationType": "تحصيل",
    "referenceId": "col-2408",
    "feeType": "رسوم سترايب",
    "amountOriginal": 92,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 1227,
    "notes": "رسوم التحصيل على السداد الكامل."
  },
  {
    "id": "fee-2406",
    "date": "2026-03-18",
    "accountId": "acc-stripe",
    "operationType": "تحويل",
    "referenceId": "it-2402",
    "feeType": "فرق عملة",
    "amountOriginal": 430,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 430,
    "notes": "فروق تحويل عند توريد رصيد Stripe إلى الخزنة."
  }
];

export const refunds: Refund[] = [
  {
    "id": "ref-2401",
    "registrationId": "reg-2404",
    "customerName": "خالد الشريف",
    "courseId": "course-horses-mar-2026",
    "date": "2026-03-08",
    "refundType": "كلي",
    "amountOriginal": 1900,
    "currency": "AED",
    "exchangeRate": 13.3,
    "amountEgp": 25270,
    "accountId": "acc-stripe",
    "processedByPartyId": "party-ahmed",
    "reason": "عدم انعقاد الدورة",
    "notes": "استرداد كامل قبل إعادة إطلاق الدورة."
  },
  {
    "id": "ref-2402",
    "registrationId": "reg-2405",
    "customerName": "نورهان صلاح",
    "courseId": "course-spahi-apr-2026",
    "date": "2026-03-20",
    "refundType": "جزئي",
    "amountOriginal": 200,
    "currency": "AED",
    "exchangeRate": 13.3,
    "amountEgp": 2660,
    "accountId": "acc-instapay",
    "processedByPartyId": "party-sarah",
    "reason": "انسحاب عميل",
    "notes": "تم رد جزء من المقدم بعد موافقة الإدارة."
  },
  {
    "id": "ref-2403",
    "registrationId": "reg-2402",
    "customerName": "محمد نور",
    "courseId": "course-marketing-may-2026",
    "date": "2026-03-26",
    "refundType": "جزئي",
    "amountOriginal": 500,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 500,
    "accountId": "acc-vodafone-cash",
    "processedByPartyId": "party-amal",
    "reason": "تسوية خاصة",
    "notes": "تسوية محلية على فرق جدولة مع الاحتفاظ بالتسجيل."
  }
];

export const registrationTransfers: RegistrationTransfer[] = [
  {
    "id": "rt-2401",
    "originalRegistrationId": "reg-2408",
    "newRegistrationId": "reg-2409",
    "originalCourseId": "course-horses-mar-2026",
    "newCourseId": "course-marketing-may-2026",
    "date": "2026-03-21",
    "amountOriginal": 1400,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 18676,
    "reason": "إلغاء الدورة الأصلية",
    "notes": "تم نقل كامل الرصيد المدفوع إلى دورة بديلة مع الاحتفاظ بأثر التسجيل الأصلي."
  },
  {
    "id": "rt-2402",
    "originalRegistrationId": "reg-2405",
    "newRegistrationId": "reg-2407",
    "originalCourseId": "course-spahi-apr-2026",
    "newCourseId": "course-healthcare-ops-apr-2026",
    "date": "2026-03-27",
    "amountOriginal": 300,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 4002,
    "reason": "تأجيل العميل",
    "notes": "تحويل جزئي لحجز مقعد بديل بعد طلب العميل."
  }
];

export const internalTransfers: InternalTransfer[] = [
  {
    "id": "it-2401",
    "date": "2026-03-11",
    "fromAccountId": "acc-saudi-bank",
    "toAccountId": "acc-cashbox",
    "amountOriginal": 2200,
    "currency": "SAR",
    "exchangeRate": 13.08,
    "amountEgp": 28776,
    "relatedFeesEgp": 457,
    "netDeliveredEgp": 28319,
    "receiverPartyId": "party-accountant",
    "notes": "توريد جزئي من الرصيد السعودي إلى خزنة المركز."
  },
  {
    "id": "it-2402",
    "date": "2026-03-18",
    "fromAccountId": "acc-stripe",
    "toAccountId": "acc-cashbox",
    "amountOriginal": 3600,
    "currency": "AED",
    "exchangeRate": 13.31,
    "amountEgp": 47916,
    "relatedFeesEgp": 430,
    "netDeliveredEgp": 47486,
    "receiverPartyId": "party-accountant",
    "notes": "توريد صافي رصيد Stripe بعد خصم فرق التحويل."
  },
  {
    "id": "it-2403",
    "date": "2026-03-24",
    "fromAccountId": "acc-vodafone-cash",
    "toAccountId": "acc-cashbox",
    "amountOriginal": 18000,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 18000,
    "relatedFeesEgp": 18,
    "netDeliveredEgp": 17982,
    "receiverPartyId": "party-accountant",
    "notes": "توريد محلي من فودافون كاش."
  },
  {
    "id": "it-2404",
    "date": "2026-03-25",
    "fromAccountId": "acc-instapay",
    "toAccountId": "acc-cashbox",
    "amountOriginal": 11600,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 11600,
    "relatedFeesEgp": 0,
    "netDeliveredEgp": 11600,
    "receiverPartyId": "party-accountant",
    "notes": "تحويل داخلي إلى الخزنة من إنستاباي."
  },
  {
    "id": "it-2405",
    "date": "2026-03-27",
    "fromAccountId": "acc-cashbox",
    "toAccountId": "acc-instapay",
    "amountOriginal": 2500,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 2500,
    "relatedFeesEgp": 0,
    "netDeliveredEgp": 2500,
    "receiverPartyId": "party-sarah",
    "notes": "سلفة تشغيلية لإدارة استرداد سريع."
  }
];

export const expenses: Expense[] = [
  {
    "id": "exp-2401",
    "date": "2026-01-04",
    "mainClass": "تأسيس",
    "subClass": "تشطيبات وتجهيز",
    "description": "أعمال تشطيب الواجهة ومنطقة الاستقبال",
    "vendor": "مؤسسة الجسور",
    "amountOriginal": 85000,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 85000,
    "paidByPartyId": "party-hamada",
    "paidFromAccountId": "acc-cashbox",
    "settled": false,
    "notes": "جزء أساسي من تكلفة التأسيس."
  },
  {
    "id": "exp-2402",
    "date": "2026-01-21",
    "mainClass": "أصل",
    "subClass": "أجهزة ومعدات",
    "description": "كاميرا محتوى + إضاءة أساسية",
    "vendor": "Media Hub",
    "amountOriginal": 6500,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 6500,
    "paidByPartyId": "party-hamada",
    "paidFromAccountId": "acc-cashbox",
    "settled": true,
    "notes": "أصل يستخدم في تصوير المحتوى التسويقي."
  },
  {
    "id": "exp-2403",
    "date": "2026-03-07",
    "mainClass": "تشغيل",
    "subClass": "تسويق وإعلانات",
    "description": "إعلانات Meta لدورة سباهي أسنان",
    "vendor": "Meta Ads",
    "amountOriginal": 4200,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 4200,
    "paidByPartyId": "party-ahmed",
    "paidFromAccountId": "acc-stripe",
    "settled": false,
    "notes": "مصروف تشغيلي مرتبط بالحملة الحالية."
  },
  {
    "id": "exp-2404",
    "date": "2026-03-14",
    "mainClass": "تشغيل",
    "subClass": "اشتراكات وبرامج",
    "description": "اشتراك أدوات التصميم السحابي",
    "vendor": "Canva / Adobe",
    "amountOriginal": 189,
    "currency": "AED",
    "exchangeRate": 13.35,
    "amountEgp": 2523,
    "paidByPartyId": "party-ahmed",
    "paidFromAccountId": "acc-stripe",
    "settled": true,
    "notes": "اشتراك شهري للفريق الإبداعي."
  },
  {
    "id": "exp-2405",
    "date": "2026-03-18",
    "mainClass": "رسوم تحصيل",
    "subClass": "سترايب",
    "description": "رسوم بوابة الدفع المجمعة للأسبوع الثالث",
    "vendor": "سترايب",
    "amountOriginal": 92,
    "currency": "AED",
    "exchangeRate": 13.34,
    "amountEgp": 1227,
    "paidByPartyId": "party-ahmed",
    "paidFromAccountId": "acc-stripe",
    "settled": true,
    "notes": "مسجلة أيضًا في شاشة رسوم التحصيل لأغراض التحليل."
  },
  {
    "id": "exp-2406",
    "date": "2026-03-20",
    "mainClass": "تشغيل",
    "subClass": "ضيافة",
    "description": "ضيافة اجتماع المبيعات الأسبوعي",
    "vendor": "المركز",
    "amountOriginal": 1250,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 1250,
    "paidByPartyId": "party-amal",
    "paidFromAccountId": "acc-vodafone-cash",
    "settled": false,
    "notes": "مصروف محلي سريع."
  },
  {
    "id": "exp-2407",
    "date": "2026-02-02",
    "mainClass": "أصل",
    "subClass": "أثاث وفرش",
    "description": "مكتب إدارة جديد وخزانة ملفات",
    "vendor": "Office Line",
    "amountOriginal": 9800,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 9800,
    "paidByPartyId": "party-hamada",
    "paidFromAccountId": "acc-cashbox",
    "settled": true,
    "notes": "أصل طويل الأجل داخل المركز."
  },
  {
    "id": "exp-2408",
    "date": "2026-03-23",
    "mainClass": "تشغيل",
    "subClass": "إنترنت واتصالات",
    "description": "إنترنت ومكالمات فريق التسجيل",
    "vendor": "Vodafone Business",
    "amountOriginal": 780,
    "currency": "EGP",
    "exchangeRate": 1,
    "amountEgp": 780,
    "paidByPartyId": "party-sarah",
    "paidFromAccountId": "acc-instapay",
    "settled": false,
    "notes": "مخصص للتواصل مع العملاء والمتابعات."
  }
];

export const monthlyCollectionsTrend = [
  { label: "أكتوبر", collected: 68000, fees: 2400, refunds: 3200 },
  { label: "نوفمبر", collected: 74200, fees: 2680, refunds: 4100 },
  { label: "ديسمبر", collected: 89100, fees: 3010, refunds: 3600 },
  { label: "يناير", collected: 126800, fees: 4450, refunds: 5800 },
  { label: "فبراير", collected: 148400, fees: 5120, refunds: 7600 },
  { label: "مارس", collected: 173100, fees: 6230, refunds: 28430 }
];

export const quickActions = [
  { label: "إضافة دورة", href: "/courses#create-form" },
  { label: "تسجيل عميل جديد", href: "/registrations#create-form" },
  { label: "تسجيل دفعة", href: "/collections#create-form" },
  { label: "تسجيل استرداد", href: "/refunds#create-form" },
  { label: "تسجيل مصروف", href: "/expenses#create-form" },
  { label: "توريد إلى الخزنة", href: "/cash-transfers#create-form" },
  { label: "إضافة رسوم تحصيل", href: "/collection-fees#create-form" }
];

export const navigation: {
  section: string;
  items: {
    label: string;
    href: string;
    icon: IconName;
  }[];
}[] = [
  {
    section: "الرؤية العامة",
    items: [
      { label: "نظرة عامة", href: "/overview", icon: "overview" }
    ]
  },
  {
    section: "الواردات والتحصيل",
    items: [
      { label: "الدورات", href: "/courses", icon: "courses" },
      { label: "فريق المبيعات", href: "/sales-team", icon: "team" },
      { label: "التسجيلات", href: "/registrations", icon: "registrations" },
      { label: "التحصيلات", href: "/collections", icon: "collections" },
      { label: "رسوم التحصيل", href: "/collection-fees", icon: "fees" },
      { label: "الاستردادات", href: "/refunds", icon: "refunds" },
      { label: "تحويلات التسجيل", href: "/registration-transfers", icon: "transfer" }
    ]
  },
  {
    section: "الحركة المالية الداخلية",
    items: [
      { label: "الخزنة والتحويلات الداخلية", href: "/cash-transfers", icon: "cash" },
      { label: "المصروفات", href: "/expenses", icon: "expenses" },
      { label: "وسائل التحصيل والحسابات", href: "/accounts", icon: "accounts" },
      { label: "الأطراف والأشخاص", href: "/parties", icon: "parties" }
    ]
  },
  {
    section: "الرقابة والتقارير",
    items: [
      { label: "التقارير", href: "/reports", icon: "reports" },
      { label: "الإعدادات", href: "/settings", icon: "settings" }
    ]
  }
];

export const statusToneMap: Record<string, "success" | "warning" | "danger" | "info" | "gold" | "neutral"> = {
  "مخطط": "neutral",
  "مفتوحة للحجز": "info",
  "تحت التجميع": "warning",
  "اكتمل الحد الأدنى": "gold",
  "انعقدت": "success",
  "مؤجلة": "warning",
  "ألغيت": "danger",
  "غير مدفوع": "neutral",
  "مدفوع جزئيًا": "warning",
  "مدفوع كاملًا": "success",
  "مستحق له استرداد": "danger",
  "مسترد جزئيًا": "warning",
  "مسترد كليًا": "danger",
  "محول إلى دورة أخرى": "gold",
  "مبدئي": "neutral",
  "مؤكد": "info",
  "بانتظار اكتمال السداد": "warning",
  "بانتظار انعقاد الدورة": "gold",
  "نشط": "success",
  "منسحب": "danger",
  "ملغي": "danger",
  "محول": "gold",
  "مكتمل": "success",
  "محسوبة مبدئيًا": "neutral",
  "غير مستحقة بعد": "warning",
  "مستحقة": "gold",
  "مصروفة": "success",
  "ملغاة": "danger",
  "مؤكدة": "success",
  "غير نشط": "neutral"
};

export const dashboardMetrics = {
  totalCenterFundsEgp: accounts.reduce((sum, item) => sum + item.balanceEgp, 0),
  cashboxBalanceEgp: accounts.find((item) => item.id === "acc-cashbox")?.balanceEgp ?? 0,
  totalSalesEgp: registrations.reduce((sum, item) => sum + item.soldPriceEgp, 0),
  totalCollectionsEgp: collections.reduce((sum, item) => sum + item.amountEgp, 0),
  totalRefundsEgp: refunds.reduce((sum, item) => sum + item.amountEgp, 0),
  totalCollectionFeesEgp: fees.reduce((sum, item) => sum + item.amountEgp, 0),
  openCourses: courses.filter((item) =>
    ["مفتوحة للحجز", "تحت التجميع", "اكتمل الحد الأدنى"].includes(item.status)
  ).length,
  heldCourses: courses.filter((item) => item.status === "انعقدت").length,
  fullyPaidRegistrations: registrations.filter((item) => item.paymentStatus === "مدفوع كاملًا").length,
  eligibleCommissionsEgp: registrations.reduce((sum, item) => sum + item.eligibleCommissionEgp, 0)
};

export function getCourse(courseId: string) {
  return courses.find((item) => item.id === courseId);
}

export function getSalesRep(repId: string) {
  return salesReps.find((item) => item.id === repId);
}

export function getParty(partyId: string) {
  return parties.find((item) => item.id === partyId);
}

export function getAccount(accountId: string) {
  return accounts.find((item) => item.id === accountId);
}

export function getRegistration(registrationId: string) {
  return registrations.find((item) => item.id === registrationId);
}

export function courseRegistrations(courseId: string) {
  return registrations.filter((item) => item.courseId === courseId);
}

export function salesRepRegistrations(repId: string) {
  return registrations.filter((item) => item.salesRepId === repId);
}

export function registrationCollections(registrationId: string) {
  return collections.filter((item) => item.registrationId === registrationId);
}

export function registrationRefunds(registrationId: string) {
  return refunds.filter((item) => item.registrationId === registrationId);
}

export function registrationTransferHistory(registrationId: string) {
  return registrationTransfers.filter(
    (item) =>
      item.originalRegistrationId === registrationId || item.newRegistrationId === registrationId
  );
}

export function accountCollections(accountId: string) {
  return collections.filter((item) => item.accountId === accountId);
}

export function accountFees(accountId: string) {
  return fees.filter((item) => item.accountId === accountId);
}

export function accountTransfers(accountId: string) {
  return internalTransfers.filter(
    (item) => item.fromAccountId === accountId || item.toAccountId === accountId
  );
}

export function accountMovements(accountId: string) {
  const collectionMovements = accountCollections(accountId).map((item) => ({
    id: item.id,
    type: "تحصيل",
    date: item.date,
    label: `تحصيل مرتبط بالتسجيل ${getRegistration(item.registrationId)?.code ?? item.registrationId}`,
    amountEgp: item.amountEgp,
    direction: "in",
    notes: item.notes
  }));

  const feeMovements = accountFees(accountId).map((item) => ({
    id: item.id,
    type: "رسوم",
    date: item.date,
    label: item.feeType,
    amountEgp: item.amountEgp,
    direction: "out",
    notes: item.notes
  }));

  const transferMovements = accountTransfers(accountId).map((item) => ({
    id: item.id,
    type: "تحويل داخلي",
    date: item.date,
    label:
      item.fromAccountId === accountId
        ? `تحويل صادر إلى ${getAccount(item.toAccountId)?.name ?? item.toAccountId}`
        : `تحويل وارد من ${getAccount(item.fromAccountId)?.name ?? item.fromAccountId}`,
    amountEgp: item.netDeliveredEgp,
    direction: item.fromAccountId === accountId ? "out" : "in",
    notes: item.notes
  }));

  return [...collectionMovements, ...feeMovements, ...transferMovements].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function partyMovements(partyId: string) {
  const inboundCollections = collections
    .filter((item) => item.collectorPartyId === partyId)
    .map((item) => ({
      id: item.id,
      date: item.date,
      type: "تحصيل",
      label: `استلام على ${getAccount(item.accountId)?.name ?? item.accountId}`,
      amountEgp: item.amountEgp,
      direction: "in",
      notes: item.notes
    }));

  const outboundExpenses = expenses
    .filter((item) => item.paidByPartyId === partyId)
    .map((item) => ({
      id: item.id,
      date: item.date,
      type: "مصروف",
      label: item.description,
      amountEgp: item.amountEgp,
      direction: "out",
      notes: item.notes
    }));

  const handledRefunds = refunds
    .filter((item) => item.processedByPartyId === partyId)
    .map((item) => ({
      id: item.id,
      date: item.date,
      type: "استرداد",
      label: `استرداد للعميل ${item.customerName}`,
      amountEgp: item.amountEgp,
      direction: "out",
      notes: item.notes
    }));

  const transferReceipts = internalTransfers
    .filter((item) => item.receiverPartyId === partyId)
    .map((item) => ({
      id: item.id,
      date: item.date,
      type: "تحويل داخلي",
      label: `استلام من ${getAccount(item.fromAccountId)?.name ?? item.fromAccountId}`,
      amountEgp: item.netDeliveredEgp,
      direction: "in",
      notes: item.notes
    }));

  return [...inboundCollections, ...outboundExpenses, ...handledRefunds, ...transferReceipts].sort(
    (a, b) => b.date.localeCompare(a.date)
  );
}

export const dashboardAlerts = [
  {
    title: "3 تسجيلات قريبة من الحد الأدنى",
    description: "دورتا التسويق الطبي وإدارة التشغيل الطبي بحاجة متابعة تحصيل أو تأكيد حضور خلال هذا الأسبوع."
  },
  {
    title: "عمولات جاهزة للترحيل",
    description: "هناك حالتان مستحقتان بالكامل بعد انعقاد دورة أمن المنشآت واكتمال السداد."
  },
  {
    title: "رصيد غير مورّد لدى Stripe",
    description: "يوجد صافي متاح قابل للتوريد أعلى من 61 ألف جنيه بعد خصم الرسوم."
  }
];
