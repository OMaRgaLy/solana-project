import type { Language } from "./translations";

export type Landing = {
  eyebrow: string;
  title1: string;
  title2: string;
  sub: string;
  cta: string;
  demo: string;
  demoOn: string;
  trust: string[];
  splitHead: string;
  splitNote: string;
  roles: { you: string; partner: string; fee: string };
  whyEyebrow: string;
  whyTitle: string;
  whyRows: { label: string; wallet: string; us: string }[];
  walletCol: string;
  usCol: string;
  featEyebrow: string;
  feats: { icon: string; title: string; desc: string }[];
  howTitle: string;
  steps: { title: string; desc: string }[];
  finalTitle: string;
  finalCta: string;
};

export const landing: Record<Language, Landing> = {
  ru: {
    eyebrow: "Solana · для фрилансеров и команд",
    title1: "Один счёт.",
    title2: "Все получают свою долю.",
    sub: "Отправьте заказчику красивую ссылку. Он платит в 1 клик — деньги мгновенно делятся между вами и коллегами, а вы получаете уведомление в Telegram и готовый акт работ.",
    cta: "Создать счёт",
    demo: "Попробовать на тестовых SOL",
    demoOn: "Демо-режим включён",
    trust: ["Некастодиально", "Сплит в одной транзакции", "Комиссия 1%"],
    splitHead: "Счёт на 1 SOL",
    splitNote: "Три перевода в одной транзакции. Если что-то не прошло — не списывается ничего.",
    roles: { you: "Вы", partner: "Напарник", fee: "Комиссия сервиса" },
    whyEyebrow: "Зачем это, если есть адрес кошелька?",
    whyTitle: "Адрес — это перевод. Счёт — это процесс.",
    walletCol: "Просто адрес",
    usCol: "SteppeInvoice",
    whyRows: [
      { label: "Деньги коллеге", wallet: "Делите вручную, платите комиссии дважды", us: "Делятся автоматически в момент оплаты" },
      { label: "Подтверждение оплаты", wallet: "Сидите и обновляете Solscan", us: "Уведомление в Telegram сразу" },
      { label: "Документ для заказчика", wallet: "Скриншот транзакции", us: "Акт работ с QR-печатью (RU/KZ/EN)" },
      { label: "Налоги", wallet: "Считаете сами по курсу на дату", us: "Сумма в ₸ и оценка налога 4%" },
      { label: "Вид для клиента", wallet: "Строка из 44 символов", us: "Карточка с названием, суммой и кнопкой" },
    ],
    featEyebrow: "Что внутри",
    feats: [
      { icon: "", title: "Авто-сплит", desc: "Доли исполнителя, напарника и комиссии распределяет смарт-контракт — без доверия и ручных переводов." },
      { icon: "", title: "Telegram-бот", desc: "Создавайте счета и получайте оплаты прямо в мессенджере: /new, /my, /tax." },
      { icon: "", title: "Акт работ", desc: "Печатный документ на трёх языках с QR на транзакцию в Solscan." },
      { icon: "", title: "Профиль и налоги", desc: "Доход по счетам, эквивалент в ₸ и ориентир по налогу 4%. Книга коллег — без перевводов." },
    ],
    howTitle: "Как это работает",
    steps: [
      { title: "Создайте счёт", desc: "Услуга, сумма, заказчик и (по желанию) кошелёк коллеги." },
      { title: "Отправьте ссылку", desc: "Telegram, WhatsApp или X. В превью — название и сумма." },
      { title: "Заказчик платит в 1 клик", desc: "Phantom, Solflare или Backpack. Сплит происходит сам." },
      { title: "Получите акт и уведомление", desc: "Печатайте документ с QR-проверкой транзакции." },
    ],
    finalTitle: "Попробуйте за минуту — тестовые SOL выдаём сами.",
    finalCta: "Начать в демо-режиме",
  },
  en: {
    eyebrow: "Solana · for freelancers and teams",
    title1: "One invoice.",
    title2: "Everyone gets their share.",
    sub: "Send your client a clean link. They pay in one click — funds split instantly between you and your collaborators, and you get a Telegram alert plus a ready act of work.",
    cta: "Create invoice",
    demo: "Try with test SOL",
    demoOn: "Demo mode is on",
    trust: ["Non-custodial", "Split in one transaction", "1% fee"],
    splitHead: "Invoice for 1 SOL",
    splitNote: "Three transfers in one transaction. If any fails, nothing is charged.",
    roles: { you: "You", partner: "Partner", fee: "Service fee" },
    whyEyebrow: "Why, if I can just share a wallet address?",
    whyTitle: "An address is a transfer. An invoice is a process.",
    walletCol: "Plain address",
    usCol: "SteppeInvoice",
    whyRows: [
      { label: "Paying a teammate", wallet: "Split by hand, pay fees twice", us: "Split automatically at payment time" },
      { label: "Knowing it's paid", wallet: "Refresh Solscan", us: "Instant Telegram alert" },
      { label: "Paperwork for the client", wallet: "A transaction screenshot", us: "Act of work with QR seal (RU/KZ/EN)" },
      { label: "Taxes", wallet: "Convert by date yourself", us: "KZT amount and 4% tax estimate" },
      { label: "What the client sees", wallet: "A 44-character string", us: "A card with title, amount and a button" },
    ],
    featEyebrow: "What's inside",
    feats: [
      { icon: "", title: "Auto-split", desc: "The smart contract distributes your, your partner's and the fee share — no trust, no manual transfers." },
      { icon: "", title: "Telegram bot", desc: "Create invoices and get paid alerts right in the messenger: /new, /my, /tax." },
      { icon: "", title: "Act of work", desc: "A printable three-language document with a Solscan QR of the transaction." },
      { icon: "", title: "Profile & taxes", desc: "Income per invoice, KZT equivalent and a 4% tax guide. A collaborator book, no retyping." },
    ],
    howTitle: "How it works",
    steps: [
      { title: "Create an invoice", desc: "Service, amount, client and optionally a collaborator wallet." },
      { title: "Share the link", desc: "Telegram, WhatsApp or X. The preview shows title and amount." },
      { title: "Client pays in 1 click", desc: "Phantom, Solflare or Backpack. The split happens on its own." },
      { title: "Get the act and the alert", desc: "Print the document with a QR to verify the transaction." },
    ],
    finalTitle: "Try it in a minute — we hand out the test SOL.",
    finalCta: "Start in demo mode",
  },
  kk: {
    eyebrow: "Solana · фрилансерлер мен командаларға",
    title1: "Бір шот.",
    title2: "Әркім өз үлесін алады.",
    sub: "Тапсырыс берушіге әдемі сілтеме жіберіңіз. Ол 1 кликпен төлейді — ақша сізбен және әріптестеріңізбен бірден бөлінеді, ал сіз Telegram-ға хабарлама мен дайын акт аласыз.",
    cta: "Шот құру",
    demo: "Тест SOL-мен байқап көру",
    demoOn: "Демо-режим қосулы",
    trust: ["Кастодиалсыз", "Бір транзакциядағы бөлу", "1% комиссия"],
    splitHead: "1 SOL шоты",
    splitNote: "Бір транзакциядағы үш аударым. Біреуі өтпесе — ештеңе есептен шығарылмайды.",
    roles: { you: "Сіз", partner: "Серіктес", fee: "Сервис комиссиясы" },
    whyEyebrow: "Әмиян мекенжайы бар болса, бұл не үшін?",
    whyTitle: "Мекенжай — аударым. Шот — процесс.",
    walletCol: "Жай мекенжай",
    usCol: "SteppeInvoice",
    whyRows: [
      { label: "Әріптеске ақша", wallet: "Қолмен бөлесіз, комиссияны екі рет төлейсіз", us: "Төлем сәтінде автоматты түрде бөлінеді" },
      { label: "Төлемді растау", wallet: "Solscan-ды жаңартып отырасыз", us: "Telegram-ға лезде хабарлама" },
      { label: "Клиентке құжат", wallet: "Транзакция скриншоты", us: "QR мөрі бар акт (RU/KZ/EN)" },
      { label: "Салықтар", wallet: "Курс бойынша өзіңіз есептейсіз", us: "₸ сомасы және 4% салық бағасы" },
      { label: "Клиент не көреді", wallet: "44 таңбалы жол", us: "Атауы, сомасы және батырмасы бар карточка" },
    ],
    featEyebrow: "Ішінде не бар",
    feats: [
      { icon: "", title: "Авто-бөлу", desc: "Орындаушы, серіктес және комиссия үлестерін смарт-контракт бөледі — сенімсіз, қолмен аудармасыз." },
      { icon: "", title: "Telegram-бот", desc: "Шоттарды құрып, төлемдерді мессенджерде алыңыз: /new, /my, /tax." },
      { icon: "", title: "Жұмыс акті", desc: "Solscan транзакциясына QR-ы бар үш тілдегі басып шығарылатын құжат." },
      { icon: "", title: "Профиль және салық", desc: "Шоттар бойынша табыс, ₸ баламасы және 4% салық бағдары. Әріптестер кітабы." },
    ],
    howTitle: "Бұл қалай жұмыс істейді",
    steps: [
      { title: "Шот құрыңыз", desc: "Қызмет, сома, тапсырыс беруші және қалауыңызша әріптес әмияны." },
      { title: "Сілтемені жіберіңіз", desc: "Telegram, WhatsApp немесе X. Превьюде атауы мен сомасы көрінеді." },
      { title: "Клиент 1 кликпен төлейді", desc: "Phantom, Solflare немесе Backpack. Бөлу өздігінен өтеді." },
      { title: "Акт пен хабарлама алыңыз", desc: "Транзакцияны тексеру QR-ы бар құжатты басып шығарыңыз." },
    ],
    finalTitle: "Бір минутта байқап көріңіз — тест SOL-ды өзіміз береміз.",
    finalCta: "Демо-режимде бастау",
  },
};
