import type { Language } from "./translations";

export type DashText = {
  title: string; subtitle: string;
  loginTitle: string; loginDesc: string; loginBtn: string; loginWaiting: string; loginUnavailable: string; logout: string; hello: string; localOnly: string;
  kpiIncome: string; kpiTaxDue: string; kpiPaid: string; kpiLeft: string; kpiProjection: string; kpiProjectionHint: string;
  settings: string; regime: string; regimeSe: string; regimeIp: string; regimeSeHint: string; regimeIpHint: string;
  born: string; declared: string; declaredHint: string; alreadyPaid: string; alreadyPaidHint: string; onchain: string; onchainHint: string; connectWallet: string;
  income: string; addIncome: string; date: string; amount: string; currency: string; note: string; notePh: string; add: string; empty: string; source: string; manual: string; chain: string; remove: string;
  monthly: string; months: string[];
  breakdown: string; tax: string; seBundle: string; opv: string; opvr: string; so: string; vosms: string; total: string; effective: string;
  compare: string; compareHint: string; cheaper: string;
  deadlines: string; dl: { contrib: string; form910: string; pay910: string; se_pay: string };
  warnSe: string; warnIp: string; seActivities: string;
  disclaimerTitle: string; disclaimer: string; sources: string; asOf: string; rateNote: string;
};

export const dash: Record<Language, DashText> = {
  ru: {
    title: "Финансы и налоги", subtitle: "Доходы из блокчейна и ручные записи — в одном месте, с оценкой налогов РК на 2026 год.",
    loginTitle: "Войдите через Telegram", loginDesc: "Чтобы записи сохранялись и были доступны с любого устройства и в боте. Без пароля — одно нажатие Start.",
    loginBtn: "Войти через Telegram", loginWaiting: "Откройте бота и нажмите Start — страница обновится сама…", loginUnavailable: "Бот ещё не настроен на сервере.", logout: "Выйти", hello: "Привет", localOnly: "Без входа записи хранятся только в этом браузере.",
    kpiIncome: "Доход с начала года", kpiTaxDue: "Налоги и взносы (оценка)", kpiPaid: "Уже уплачено", kpiLeft: "Осталось доплатить", kpiProjection: "Прогноз на год", kpiProjectionHint: "если темп сохранится",
    settings: "Налоговый режим", regime: "Режим", regimeSe: "Самозанятый", regimeIp: "ИП на упрощёнке",
    regimeSeHint: "4% с дохода, без ИП. Лимит 300 МРП в месяц, только виды деятельности из списка.",
    regimeIpHint: "4% с дохода + ежемесячные взносы за себя. Лимит 600 000 МРП в год.",
    born: "Родился после 1975 года (платится ОПВР 3,5%)", declared: "Заявленный доход для взносов, ₸ в месяц", declaredHint: "Вы сами выбираете базу для ОПВ и СО, минимум 1 МЗП (85 000 ₸). По умолчанию — минимум.", alreadyPaid: "Уже уплачено в этом году, ₸", alreadyPaidHint: "Налоги и взносы, которые вы уже перечислили.",
    onchain: "Учитывать оплаты из SteppeInvoice", onchainHint: "Берём вашу долю из оплаченных счетов подключённого кошелька.", connectWallet: "Подключите кошелёк, чтобы подтянуть счета.",
    income: "Доходы", addIncome: "Добавить доход вне платформы", date: "Дата", amount: "Сумма", currency: "Валюта", note: "Комментарий", notePh: "Клиент, проект…", add: "Добавить", empty: "Пока нет записей.", source: "Источник", manual: "вручную", chain: "Solana", remove: "Удалить",
    monthly: "Доход по месяцам, ₸", months: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
    breakdown: "Из чего складывается", tax: "ИПН 4%", seBundle: "4% (ОПВ, ОПВР, СО, ОСМС по 1%)", opv: "ОПВ 10%", opvr: "ОПВР 3,5%", so: "СО 5%", vosms: "ВОСМС", total: "Итого", effective: "Эффективная ставка",
    compare: "Сравнение режимов", compareHint: "При ваших доходах за этот год", cheaper: "дешевле",
    deadlines: "Ближайшие сроки", dl: { contrib: "Взносы ИП за себя (до 25 числа)", form910: "Подать форму 910.00", pay910: "Оплатить ИПН по форме 910.00", se_pay: "Платежи самозанятого (до 25 числа)" },
    warnSe: "Доход за месяц превысил 300 МРП (1 297 500 ₸) — режим самозанятого может быть утрачен.", warnIp: "Годовой доход превысил 600 000 МРП — упрощёнка недоступна, нужен общеустановленный режим.",
    seActivities: "Режим самозанятого доступен только для видов деятельности из перечня (постановление №994). Проверьте, входит ли ваша.",
    disclaimerTitle: "Это оценка, а не налоговая консультация", disclaimer: "Расчёт основан на открытых данных на октябрь 2026. Доход в SOL пересчитан по текущему курсу, а не по курсу на дату получения. Статус криптодоходов, ставки маслихатов и перечни меняются — сверьтесь с КГД или бухгалтером.", sources: "Источники", asOf: "МРП 4 325 ₸ · МЗП 85 000 ₸ (2026)", rateNote: "Курс SOL",
  },
  en: {
    title: "Finance & taxes", subtitle: "On-chain income and manual entries in one place, with a Kazakhstan 2026 tax estimate.",
    loginTitle: "Sign in with Telegram", loginDesc: "So your records are saved, available on any device and in the bot. No password — one tap on Start.",
    loginBtn: "Sign in with Telegram", loginWaiting: "Open the bot and press Start — this page updates on its own…", loginUnavailable: "The bot is not configured on the server yet.", logout: "Sign out", hello: "Hi", localOnly: "Without signing in, records stay in this browser only.",
    kpiIncome: "Income year to date", kpiTaxDue: "Taxes & contributions (est.)", kpiPaid: "Already paid", kpiLeft: "Left to pay", kpiProjection: "Full-year projection", kpiProjectionHint: "if the pace holds",
    settings: "Tax regime", regime: "Regime", regimeSe: "Self-employed", regimeIp: "IP, simplified",
    regimeSeHint: "4% of income, no IP. Limit 300 MRP per month, listed activities only.",
    regimeIpHint: "4% of income + monthly contributions for yourself. Limit 600,000 MRP a year.",
    born: "Born after 1975 (ОПВР 3.5% applies)", declared: "Declared income for contributions, ₸ per month", declaredHint: "You choose the base for ОПВ and СО yourself, minimum 1 МЗП (85,000 ₸). Defaults to the minimum.", alreadyPaid: "Already paid this year, ₸", alreadyPaidHint: "Taxes and contributions you have already transferred.",
    onchain: "Include SteppeInvoice payments", onchainHint: "Uses your share of paid invoices for the connected wallet.", connectWallet: "Connect a wallet to pull in invoices.",
    income: "Income", addIncome: "Add income earned outside the platform", date: "Date", amount: "Amount", currency: "Currency", note: "Note", notePh: "Client, project…", add: "Add", empty: "No entries yet.", source: "Source", manual: "manual", chain: "Solana", remove: "Remove",
    monthly: "Income by month, ₸", months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    breakdown: "What it consists of", tax: "Income tax 4%", seBundle: "4% (pension, employer pension, social, health — 1% each)", opv: "ОПВ 10%", opvr: "ОПВР 3.5%", so: "СО 5%", vosms: "ВОСМС", total: "Total", effective: "Effective rate",
    compare: "Regime comparison", compareHint: "At this year's income", cheaper: "cheaper",
    deadlines: "Upcoming deadlines", dl: { contrib: "IP contributions for yourself (by the 25th)", form910: "File form 910.00", pay910: "Pay income tax for form 910.00", se_pay: "Self-employed payments (by the 25th)" },
    warnSe: "Monthly income exceeded 300 MRP (1,297,500 ₸) — self-employed status may be lost.", warnIp: "Annual income exceeded 600,000 MRP — the simplified regime is unavailable; the general regime applies.",
    seActivities: "The self-employed regime only covers activities on the approved list (resolution No. 994). Check that yours is on it.",
    disclaimerTitle: "An estimate, not tax advice", disclaimer: "Based on public data as of Oct 2026. SOL income is converted at the current rate, not the rate on the date received. The treatment of crypto income, maslikhat rates and activity lists change — check with the tax authority or an accountant.", sources: "Sources", asOf: "MRP 4,325 ₸ · MZP 85,000 ₸ (2026)", rateNote: "SOL rate",
  },
  kk: {
    title: "Қаржы және салықтар", subtitle: "Блокчейндегі табыс пен қолмен енгізілген жазбалар бір жерде, ҚР 2026 салығының бағасымен.",
    loginTitle: "Telegram арқылы кіріңіз", loginDesc: "Жазбалар сақталып, кез келген құрылғыда және ботта қолжетімді болуы үшін. Құпиясөзсіз — Start түймесін бір басу.",
    loginBtn: "Telegram арқылы кіру", loginWaiting: "Ботты ашып, Start басыңыз — бет өзі жаңарады…", loginUnavailable: "Бот серверде әлі бапталмаған.", logout: "Шығу", hello: "Сәлем", localOnly: "Кірмесеңіз, жазбалар тек осы браузерде сақталады.",
    kpiIncome: "Жыл басынан табыс", kpiTaxDue: "Салықтар мен жарналар (баға)", kpiPaid: "Төленді", kpiLeft: "Төлеу қалды", kpiProjection: "Жылдық болжам", kpiProjectionHint: "қарқын сақталса",
    settings: "Салық режимі", regime: "Режим", regimeSe: "Өзін-өзі жұмыспен қамтыған", regimeIp: "Оңайлатылған ЖК",
    regimeSeHint: "Табыстың 4%-ы, ЖК-сыз. Айына 300 АЕК шегі, тек тізімдегі қызмет түрлері.",
    regimeIpHint: "Табыстың 4%-ы + өзі үшін ай сайынғы жарналар. Жылына 600 000 АЕК шегі.",
    born: "1975 жылдан кейін туған (ОПВР 3,5% төленеді)", declared: "Жарналарға мәлімделген табыс, ₸ айына", declaredHint: "ОПВ мен ӘО базасын өзіңіз таңдайсыз, ең төмені 1 ЕМЖ (85 000 ₸). Әдепкі — ең төмені.", alreadyPaid: "Осы жылы төленді, ₸", alreadyPaidHint: "Сіз аударып қойған салықтар мен жарналар.",
    onchain: "SteppeInvoice төлемдерін есепке алу", onchainHint: "Қосылған әмиянның төленген шоттарынан сіздің үлесіңіз алынады.", connectWallet: "Шоттарды алу үшін әмиянды қосыңыз.",
    income: "Табыс", addIncome: "Платформадан тыс табыс қосу", date: "Күні", amount: "Сома", currency: "Валюта", note: "Түсініктеме", notePh: "Клиент, жоба…", add: "Қосу", empty: "Жазбалар жоқ.", source: "Көзі", manual: "қолмен", chain: "Solana", remove: "Жою",
    monthly: "Айлар бойынша табыс, ₸", months: ["қаң", "ақп", "нау", "сәу", "мам", "мау", "шіл", "там", "қыр", "қаз", "қар", "жел"],
    breakdown: "Неден құралады", tax: "ЖТС 4%", seBundle: "4% (ОПВ, ОПВР, ӘО, ОСМС — 1%-дан)", opv: "ОПВ 10%", opvr: "ОПВР 3,5%", so: "ӘО 5%", vosms: "МӘМС", total: "Барлығы", effective: "Тиімді мөлшерлеме",
    compare: "Режимдерді салыстыру", compareHint: "Осы жылғы табыс бойынша", cheaper: "арзан",
    deadlines: "Жақын мерзімдер", dl: { contrib: "ЖК өзі үшін жарналар (25-не дейін)", form910: "910.00 нысанын тапсыру", pay910: "910.00 бойынша ЖТС төлеу", se_pay: "Өзін-өзі жұмыспен қамтығандардың төлемдері (25-не дейін)" },
    warnSe: "Айлық табыс 300 АЕК-ден (1 297 500 ₸) асты — режим жоғалуы мүмкін.", warnIp: "Жылдық табыс 600 000 АЕК-тен асты — оңайлатылған режим қолжетімсіз.",
    seActivities: "Бұл режим тек бекітілген тізімдегі қызмет түрлеріне арналған (№994 қаулы). Сіздікі тізімде бар-жоғын тексеріңіз.",
    disclaimerTitle: "Бұл баға, салықтық кеңес емес", disclaimer: "2026 жылғы қазандағы ашық деректерге негізделген. SOL табысы алынған күнгі емес, ағымдағы бағам бойынша қайта есептелген. Криптотабыс мәртебесі, мәслихат мөлшерлемелері мен тізімдер өзгереді — КМК-мен немесе бухгалтермен тексеріңіз.", sources: "Дереккөздер", asOf: "АЕК 4 325 ₸ · ЕМЖ 85 000 ₸ (2026)", rateNote: "SOL бағамы",
  },
};
