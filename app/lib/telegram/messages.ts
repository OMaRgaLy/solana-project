import { esc } from "./api";

export type Lang = "ru" | "kk" | "en";
export const LANGS: Lang[] = ["ru", "kk", "en"];
export const isLang = (s: string): s is Lang => (LANGS as string[]).includes(s);

/** Telegram's own language code → bot language (a user can override it with /lang). */
export const langOf = (code?: string): Lang => (code === "ru" || code === "kk" ? code : "en");

// Every language must provide every key: a missing translation is a compile error.
export type Messages = {
  welcome: string;
  watching: (title: string) => string;
  notFound: string;
  loginOk: string;
  askTitle: string;
  askAmount: string;
  badAmount: string;
  askClient: string;
  ready: string;
  open: string;
  walletUsage: string;
  walletBad: string;
  walletOk: (addr: string, count: number) => string;
  needWallet: string;
  noInvoices: string;
  paid: (title: string, amount: string, you: string, link: string) => string;
  openAct: string;
  tax: (gross: string, kzt: string, tax: string) => string;
  rate: (usd: string, kzt: string) => string;
  rateFail: string;
  langSet: string;
  langUsage: string;
  btn: { demo: string; create: string; mine: string; tax: string; rate: string; wallet: string; site: string; menu: string };
  demoCreating: string;
  demoReady: (title: string, amount: string) => string;
  demoPayBtn: string;
  demoWebBtn: string;
  demoActBtn: string;
  demoPaying: string;
  demoNoFunds: string;
  demoNotFound: string;
  demoAlready: string;
  demoFailed: string;
  demoWait: string;
  demoUnavailable: string;
  demoDefaultTitle: string;
  commands: { command: string; description: string }[];
};

const link = "/lang ru · kk · en";

export const T: Record<Lang, Messages> = {
  ru: {
    welcome: "🏹 <b>SteppeInvoice</b>\nСчёт в SOL, который сам делится между вами и напарником. К нему — акт работ и уведомление, когда клиент заплатит.\n\nС чего начать: нажмите «Попробовать в тестовой сети». Бот пройдёт весь путь за вас, ничего устанавливать не нужно.",
    watching: (t) => `🔔 Слежу за счётом «${esc(t)}». Напишу сразу, как его оплатят.`,
    notFound: "Счёт не найден.",
    loginOk: "✅ Вход подтверждён. Вернитесь на сайт — он откроется сам.",
    askTitle: "За что оплата? (название услуги)",
    askAmount: "Сумма в SOL? (например 1.5)",
    badAmount: "Не похоже на сумму. Пример: 1.5",
    askClient: "Название компании или заказчика, кто платит?",
    ready: "✅ Черновик готов. Откройте ссылку, подключите кошелёк и подпишите создание — ссылка на оплату и QR появятся автоматически.",
    open: "Создать счёт в 1 клик",
    walletUsage: "Использование: /wallet &lt;адрес Solana&gt; или /wallet demo",
    walletBad: "Это не адрес Solana.",
    walletOk: (a, n) => `✅ Кошелёк ${a} привязан. Счетов в сети: ${n}. Уведомлю об оплате каждого.`,
    needWallet: "Сначала привяжите кошелёк: /wallet &lt;адрес&gt; (или /wallet demo для теста)",
    noInvoices: "Счетов пока нет. /new — создать первый.",
    paid: (title, amt, you, l) => `🎉 <b>Оплачено!</b>\n«${esc(title)}» — ${amt} SOL\nВам: ${you} SOL\n<a href="${l}">Транзакция в Solscan</a>`,
    openAct: "Акт выполненных работ",
    tax: (g, k, t) => `🧮 Оплачено всего: <b>${g} SOL</b> ≈ ${k} ₸\nОриентировочный налог 4% (упрощённая декларация, РК): <b>${t} ₸</b>\n<i>Оценка, не консультация. Сверяйтесь с бухгалтером.</i>`,
    rate: (usd, kzt) => `SOL ≈ $${usd} ≈ ${kzt} ₸`,
    rateFail: "Курс сейчас недоступен.",
    langSet: "Язык: русский",
    langUsage: "Выберите язык: /lang ru, /lang kk или /lang en",
    btn: { demo: "Попробовать в тестовой сети", create: "Создать счёт", mine: "Мои счета", tax: "Налоги", rate: "Курс SOL", wallet: "Демо-кошелёк", site: "Открыть сайт", menu: "Меню" },
    demoCreating: "Создаю демо-счёт в тестовой сети…",
    demoReady: (t, a) => `🧪 <b>Демо-счёт готов</b>\n«${esc(t)}» — ${a} SOL\nСплит: 84% вам, 15% напарнику, 1% сервису.\n\nНажмите «Оплатить как демо-клиент»: бот проведёт оплату в тестовой сети, и сюда придёт уведомление с актом.`,
    demoPayBtn: "Оплатить как демо-клиент",
    demoWebBtn: "Страница оплаты на сайте",
    demoActBtn: "Акт выполненных работ",
    demoPaying: "Оплачиваю…",
    demoNoFunds: "У демо-клиента закончились тестовые SOL. Пополните его на faucet.solana.com (адрес на странице «Демо» сайта).",
    demoNotFound: "Счёт не найден.",
    demoAlready: "Этот счёт уже оплачен.",
    demoFailed: "Не получилось провести оплату. Попробуйте ещё раз через минуту.",
    demoWait: "Подождите несколько секунд перед следующим демо-счётом.",
    demoUnavailable: "Демо доступно только в тестовой сети.",
    demoDefaultTitle: "Демо: дизайн мобильного приложения",
    commands: [
      { command: "menu", description: "Главное меню" },
      { command: "demo", description: "Демо: весь путь в тестовой сети" },
      { command: "new", description: "Создать счёт" },
      { command: "wallet", description: "Привязать кошелёк" },
      { command: "my", description: "Мои счета" },
      { command: "tax", description: "Налог с оплаченных счетов" },
      { command: "rate", description: "Курс SOL" },
      { command: "lang", description: "Язык" },
    ],
  },
  kk: {
    welcome: "🏹 <b>SteppeInvoice</b>\nSOL-дағы шот өзі сізбен серіктесіңіз арасында бөлінеді. Оған жұмыс акті мен клиент төлегенде хабарлама қосылады.\n\nҚайдан бастау: «Сынақ желісінде байқау» түймесін басыңыз. Бот бүкіл жолды сіз үшін өтеді, ештеңе орнату қажет емес.",
    watching: (t) => `🔔 «${esc(t)}» шотын бақылап отырмын. Төленген бойда хабарлаймын.`,
    notFound: "Шот табылмады.",
    loginOk: "✅ Кіру расталды. Сайтқа оралыңыз — ол өзі ашылады.",
    askTitle: "Не үшін төлем? (қызмет атауы)",
    askAmount: "SOL-дағы сома? (мысалы 1.5)",
    badAmount: "Сома сияқты емес. Мысалы: 1.5",
    askClient: "Төлеуші компания немесе тапсырыс беруші атауы?",
    ready: "✅ Жоба дайын. Сілтемені ашып, әмиянды қосыңыз да, құруға қол қойыңыз — төлем сілтемесі мен QR автоматты түрде пайда болады.",
    open: "Шотты 1 кликпен құру",
    walletUsage: "Қолдану: /wallet &lt;Solana мекенжайы&gt; немесе /wallet demo",
    walletBad: "Бұл Solana мекенжайы емес.",
    walletOk: (a, n) => `✅ ${a} әмияны байланды. Желідегі шоттар: ${n}. Әрқайсысы төленгенде хабарлаймын.`,
    needWallet: "Алдымен әмиянды байлаңыз: /wallet &lt;мекенжай&gt; (тест үшін /wallet demo)",
    noInvoices: "Әзірге шоттар жоқ. /new — алғашқысын құру.",
    paid: (title, amt, you, l) => `🎉 <b>Төленді!</b>\n«${esc(title)}» — ${amt} SOL\nСізге: ${you} SOL\n<a href="${l}">Solscan-дағы транзакция</a>`,
    openAct: "Орындалған жұмыстар акті",
    tax: (g, k, t) => `🧮 Барлығы төленді: <b>${g} SOL</b> ≈ ${k} ₸\nБолжамды салық 4% (оңайлатылған декларация, ҚР): <b>${t} ₸</b>\n<i>Бұл баға, кеңес емес. Бухгалтермен тексеріңіз.</i>`,
    rate: (usd, kzt) => `SOL ≈ $${usd} ≈ ${kzt} ₸`,
    rateFail: "Бағам қазір қолжетімсіз.",
    langSet: "Тіл: қазақша",
    langUsage: "Тілді таңдаңыз: /lang ru, /lang kk немесе /lang en",
    btn: { demo: "Сынақ желісінде байқау", create: "Шот құру", mine: "Менің шоттарым", tax: "Салықтар", rate: "SOL бағамы", wallet: "Демо-әмиян", site: "Сайтты ашу", menu: "Мәзір" },
    demoCreating: "Сынақ желісінде демо-шот жасап жатырмын…",
    demoReady: (t, a) => `🧪 <b>Демо-шот дайын</b>\n«${esc(t)}» — ${a} SOL\nБөлу: 84% сізге, 15% серіктеске, 1% сервиске.\n\n«Демо-клиент ретінде төлеу» түймесін басыңыз: бот сынақ желісінде төлемді жүргізеді, мұнда акті бар хабарлама келеді.`,
    demoPayBtn: "Демо-клиент ретінде төлеу",
    demoWebBtn: "Сайттағы төлем беті",
    demoActBtn: "Орындалған жұмыстар акті",
    demoPaying: "Төлеп жатырмын…",
    demoNoFunds: "Демо-клиенттің сынақ SOL-ы бітті. faucet.solana.com арқылы толтырыңыз (мекенжай сайттың «Демо» бетінде).",
    demoNotFound: "Шот табылмады.",
    demoAlready: "Бұл шот әлдеқашан төленген.",
    demoFailed: "Төлемді жүргізу мүмкін болмады. Бір минуттан кейін қайталаңыз.",
    demoWait: "Келесі демо-шотқа дейін бірнеше секунд күтіңіз.",
    demoUnavailable: "Демо тек сынақ желісінде қолжетімді.",
    demoDefaultTitle: "Демо: мобильді қосымша дизайны",
    commands: [
      { command: "menu", description: "Негізгі мәзір" },
      { command: "demo", description: "Демо: бүкіл жол сынақ желісінде" },
      { command: "new", description: "Шот құру" },
      { command: "wallet", description: "Әмиянды байлау" },
      { command: "my", description: "Менің шоттарым" },
      { command: "tax", description: "Төленген шоттардан салық" },
      { command: "rate", description: "SOL бағамы" },
      { command: "lang", description: "Тіл" },
    ],
  },
  en: {
    welcome: "🏹 <b>SteppeInvoice</b>\nAn SOL invoice that splits itself between you and your collaborator, with an act of work and an alert when the client pays.\n\nWhere to start: press “Try it on the test network”. The bot walks the whole flow for you, nothing to install.",
    watching: (t) => `🔔 Watching "${esc(t)}". I'll message you the moment it's paid.`,
    notFound: "Invoice not found.",
    loginOk: "✅ Login confirmed. Go back to the site — it will open on its own.",
    askTitle: "What is the payment for? (service title)",
    askAmount: "Amount in SOL? (e.g. 1.5)",
    badAmount: "That doesn't look like an amount. Example: 1.5",
    askClient: "Which client or company is paying?",
    ready: "✅ Draft ready. Open the link, connect your wallet and sign — the payment link and QR appear automatically.",
    open: "Create invoice in 1 click",
    walletUsage: "Usage: /wallet &lt;Solana address&gt; or /wallet demo",
    walletBad: "That's not a Solana address.",
    walletOk: (a, n) => `✅ Wallet ${a} linked. On-chain invoices: ${n}. I'll alert you when each is paid.`,
    needWallet: "Link a wallet first: /wallet &lt;address&gt; (or /wallet demo to try it)",
    noInvoices: "No invoices yet. /new to create the first one.",
    paid: (title, amt, you, l) => `🎉 <b>Paid!</b>\n"${esc(title)}" — ${amt} SOL\nYou get: ${you} SOL\n<a href="${l}">Transaction on Solscan</a>`,
    openAct: "Act of completed work",
    tax: (g, k, t) => `🧮 Total paid: <b>${g} SOL</b> ≈ ${k} ₸\nEstimated 4% tax (KZ simplified declaration): <b>${t} ₸</b>\n<i>Estimate only, not tax advice.</i>`,
    rate: (usd, kzt) => `SOL ≈ $${usd} ≈ ${kzt} ₸`,
    rateFail: "Rate unavailable right now.",
    langSet: "Language: English",
    langUsage: "Choose a language: /lang ru, /lang kk or /lang en",
    btn: { demo: "Try it on the test network", create: "Create invoice", mine: "My invoices", tax: "Taxes", rate: "SOL rate", wallet: "Demo wallet", site: "Open the site", menu: "Menu" },
    demoCreating: "Creating a demo invoice on the test network…",
    demoReady: (t, a) => `🧪 <b>Demo invoice ready</b>\n"${esc(t)}" — ${a} SOL\nSplit: 84% to you, 15% to the collaborator, 1% service fee.\n\nPress "Pay as demo client": the bot makes the payment on the test network and a notification with the act arrives here.`,
    demoPayBtn: "Pay as demo client",
    demoWebBtn: "Payment page on the site",
    demoActBtn: "Act of completed work",
    demoPaying: "Paying…",
    demoNoFunds: "The demo client ran out of test SOL. Top it up at faucet.solana.com (the address is on the site's Demo page).",
    demoNotFound: "Invoice not found.",
    demoAlready: "This invoice is already paid.",
    demoFailed: "The payment did not go through. Try again in a minute.",
    demoWait: "Wait a few seconds before the next demo invoice.",
    demoUnavailable: "The demo is only available on the test network.",
    demoDefaultTitle: "Demo: mobile app design",
    commands: [
      { command: "menu", description: "Main menu" },
      { command: "demo", description: "Demo: the whole flow on the test network" },
      { command: "new", description: "Create an invoice" },
      { command: "wallet", description: "Link a wallet" },
      { command: "my", description: "My invoices" },
      { command: "tax", description: "Tax on paid invoices" },
      { command: "rate", description: "SOL rate" },
      { command: "lang", description: "Language" },
    ],
  },
};
