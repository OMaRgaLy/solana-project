import type { Language } from "./translations";

// Strings that used to be hardcoded in pages and components. Every language must provide every key:
// a missing translation is a compile error, so nothing can silently stay in one language.
export type Extra = {
  nav: { finance: string };
  common: { copied: string; copy: string; copyText: string; open: string; refresh: string; act: string; invoiceLink: string; cancel: string };
  log: { title: string; empty: string; copy: string; clear: string };
  blink: { you: string; tweet: string; bannerAlt: string; pay: string };
  share: {
    tgText: (title: string, amount: string) => string;
    xText: (title: string, amount: string) => string;
    paidNote: string;
    qrLoading: string;
    qrAlt: string;
    blinkDesc: (creator: number, collab: number, fee: number) => string;
  };
  create: {
    errTitleLong: string;
    errVaultAddr: string;
    noTreasury: string;
    reqName: string;
    reqNamePh: string;
    reqIin: string;
    reqSaved: string;
    iinWord: string;
    noProgram: string;
    noWallet: string;
    splitTitle: string;
    partYou: string;
    partFee: string;
    partCollab: string;
    youGet: (pct: number) => string;
    feeLine: (pct: number) => string;
    collabLine: (pct: number) => string;
    invoiceFallback: string;
    taskFallback: string;
    checkoutPreview: string;
    clientLine: (client: string) => string;
    templateDesign: string;
    templateDev: string;
    templateConsult: string;
    demoCollabName: string;
  };
  pay: { wallets: string; notFoundMeta: string; metaTitle: string; metaPaid: string; metaDesc: string; signNote: string };
  profile: {
    errCollabAddr: string;
    errCollabName: string;
    demoCollabNote: string;
    featuresTitle: string;
    feat1: string;
    feat2: string;
    feat3: string;
    taxNote: string;
    thInvoice: string;
    thAmount: string;
    thSplit: string;
    thStatus: string;
    thActions: string;
    paid: string;
    pending: string;
    cancelBtn: string;
    reqTitle: string;
    reqDesc: string;
    addrPlaceholder: string;
    collabHint: string;
    addDemo: string;
    savedTitle: (n: number) => string;
    share: (pct: number) => string;
  };
  wallet: {
    invalid: string; badge: string; viewSolscan: string; reading: string;
    stats: { paid: string; billed: string; net: string; saved: string };
    note: string; invoices: string; none: string;
    paidTag: string; openTag: string; receipt: string; checkout: string;
    cancelling: string; cancelReclaim: string; openCount: (n: number) => string;
  };
  demo: {
    title: string; intro: string; step1: string; step2: string; step3: string;
    connected: string; nobody: string; use: string; usedNow: string; receiveOnly: string;
    roles: Record<string, string>;
  };
};

export const extra: Record<Language, Extra> = {
  ru: {
    nav: { finance: "Финансы" },
    common: { copied: "✓ Скопировано", copy: "Копировать", copyText: "Копировать текст", open: "Открыть ↗", refresh: "Обновить", act: "Акт", invoiceLink: "Счёт →", cancel: "Отмена" },
    log: { title: "Журнал действий", empty: "Пока пусто. Здесь появится каждый шаг с кошельком и сетью.", copy: "копировать", clear: "очистить" },
    blink: { you: "Вы", tweet: "Счёт готов — оплата в 1 клик #Solana #Blinks", bannerAlt: "Баннер счёта", pay: "Оплатить счёт" },
    share: {
      tgText: (t, a) => `Счёт «${t}» на ${a} SOL.\nОплата в 1 клик:`,
      xText: (t, a) => `Счёт «${t}» — ${a} SOL. Оплата в 1 клик в Solana:`,
      paidNote: "Смарт-контракт Solana мгновенно разделил средства между кошельками.",
      qrLoading: "Создаю QR…",
      qrAlt: "QR-код счёта",
      blinkDesc: (c, k, f) => `Авто-сплит: ${c}% исполнителю${k ? ` · ${k}% напарнику` : ""} · ${f}% комиссия сервиса`,
    },
    create: {
      errTitleLong: "Название слишком длинное: максимум 64 байта (кириллица — по 2 байта на букву, около 32 букв)",
      errVaultAddr: "Некорректный адрес для комиссии",
      noTreasury: "Не задан кошелёк платформы для комиссии (NEXT_PUBLIC_TREASURY). Создание счетов в основной сети отключено.",
      reqName: "ФИО или название ИП",
      reqNamePh: "ИП Смагулов А.Б.",
      reqIin: "ИИН / БИН (12 цифр)",
      reqSaved: "Реквизиты сохранены ✓",
      iinWord: "ИИН",
      noProgram: "Программа не настроена (NEXT_PUBLIC_PROGRAM_ID).",
      noWallet: "Кошелёк не подключён. Подключите Phantom или Solflare, либо включите демо-режим в шапке.",
      splitTitle: "Авто-распределение платежа (в сети)",
      partYou: "Исполнитель",
      partFee: "Комиссия сервиса",
      partCollab: "Напарник",
      youGet: (p) => `Вам на кошелёк (${p}%):`,
      feeLine: (p) => `Комиссия сервиса (${p}%):`,
      collabLine: (p) => `Напарнику (${p}%):`,
      invoiceFallback: "Счёт",
      taskFallback: "Название услуги",
      checkoutPreview: "Так увидит заказчик",
      clientLine: (c) => `Заказчик: ${c} · оплата в 1 клик`,
      templateDesign: "UI/UX дизайн мобильного приложения",
      templateDev: "Разработка смарт-контракта",
      templateConsult: "Техническая консультация и аудит",
      demoCollabName: "Алина (UI/UX дизайнер)",
    },
    pay: {
      wallets: "Phantom, Solflare, Backpack",
      notFoundMeta: "Счёт не найден",
      metaTitle: "SteppeInvoice — оплата в 1 клик",
      metaPaid: "Счёт оплачен. Акт выполненных работ доступен.",
      metaDesc: "Оплатите в 1 клик. Деньги делятся между участниками в одной транзакции.",
      signNote: "Транзакция подписывается напрямую вашим кошельком.",
    },
    profile: {
      errCollabAddr: "Некорректный адрес кошелька Solana",
      errCollabName: "Укажите имя или роль напарника",
      demoCollabNote: "Дизайн-системы, Figma, прототипы",
      featuresTitle: "В личном кабинете доступно:",
      feat1: "Аналитика оборота и налога 4% (упрощённая декларация, форма 910.00)",
      feat2: "Реквизиты ИП или ТОО для автоматической подстановки в акты",
      feat3: "Книга напарников: адреса и доли подставляются сами",
      taxNote: "Упрощёнка 4% (форма 910.00)",
      thInvoice: "Счёт", thAmount: "Сумма", thSplit: "Сплит", thStatus: "Статус", thActions: "Действия",
      paid: "ОПЛАЧЕН", pending: "ОЖИДАЕТ", cancelBtn: "Отменить",
      reqTitle: "Реквизиты для акта выполненных работ (форма Р-1)",
      reqDesc: "Эти данные автоматически попадают в акт с QR-печатью. Лишних полей нет: сервис не хранит ваши контакты.",
      addrPlaceholder: "г. Астана, ул. Достык, д. 18",
      collabHint: "Сохраняйте напарников, чтобы выбирать их при создании счёта в 1 клик.",
      addDemo: "+ Добавить демо-напарника (Алина)",
      savedTitle: (n) => `Сохранённые напарники (${n})`,
      share: (p) => `доля ${p}%`,
    },
    wallet: {
      invalid: "Некорректный адрес кошелька.", badge: "Проверенный исполнитель", viewSolscan: "Кошелёк в Solscan ↗", reading: "Читаю репутацию из сети…",
      stats: { paid: "Оплаченных счетов", billed: "Выставлено всего", net: "Получено исполнителем", saved: "Отложено автоматически" },
      note: "Считается на лету по счетам этого кошелька в блокчейне: репутация переносится вместе с кошельком и не зависит от платформы. Отменённые счета закрываются в сети и не портят историю.",
      invoices: "Счета", none: "Счетов пока нет.",
      paidTag: "ОПЛАЧЕН", openTag: "ОТКРЫТ", receipt: "Квитанция", checkout: "Оплата",
      cancelling: "Отменяю…", cancelReclaim: "Отменить и вернуть депозит", openCount: (n) => `${n} открыто`,
    },
    demo: {
      title: "Демо-кошельки: без расширения и без реальных денег",
      intro: "Это публичные кошельки в тестовой сети Solana Devnet. Их монеты ничего не стоят, а ключи опубликованы намеренно, чтобы любой мог попробовать продукт. Все действия — настоящие транзакции тестового блокчейна: любой адрес можно открыть в Solscan.",
      step1: "Выберите «Demo Freelancer», откройте «Создать счёт» и создайте его (укажите «Demo Savings Vault» и «Demo Collaborator», чтобы увидеть сплит).",
      step2: "Скопируйте ссылку на оплату, вернитесь сюда, выберите «Demo Client 1», откройте ссылку и оплатите.",
      step3: "Следите за балансами ниже, затем откройте акт выполненных работ.",
      connected: "Сейчас подключён", nobody: "никто", use: "Использовать этот кошелёк", usedNow: "Подключён ✓",
      receiveOnly: "Только для получения (вставьте адрес в форму счёта).",
      roles: {
        freelancer: "Создаёт счета и получает оплату", client1: "Оплачивает счета", client2: "Оплачивает счета",
        vault: "Получает комиссию сервиса", collaborator: "Получает долю напарника",
      },
    },
  },
  kk: {
    nav: { finance: "Қаржы" },
    common: { copied: "✓ Көшірілді", copy: "Көшіру", copyText: "Мәтінді көшіру", open: "Ашу ↗", refresh: "Жаңарту", act: "Акт", invoiceLink: "Шот →", cancel: "Болдырмау" },
    log: { title: "Әрекеттер журналы", empty: "Әзірге бос. Әмиян мен желімен әр қадам осында көрінеді.", copy: "көшіру", clear: "тазалау" },
    blink: { you: "Сіз", tweet: "Шот дайын — 1 кликпен төлеңіз #Solana #Blinks", bannerAlt: "Шот баннері", pay: "Шотты төлеу" },
    share: {
      tgText: (t, a) => `«${t}» шоты, ${a} SOL.\n1 кликпен төлеу:`,
      xText: (t, a) => `«${t}» шоты — ${a} SOL. Solana-да 1 кликпен төлеңіз:`,
      paidNote: "Solana смарт-контракты қаражатты әмияндар арасында лезде бөлді.",
      qrLoading: "QR жасалуда…",
      qrAlt: "Шот QR-коды",
      blinkDesc: (c, k, f) => `Авто-бөлу: ${c}% орындаушыға${k ? ` · ${k}% серіктеске` : ""} · ${f}% сервис комиссиясы`,
    },
    create: {
      errTitleLong: "Атау тым ұзын: ең көбі 64 байт (кирилл әрпі — 2 байттан, шамамен 32 әріп)",
      errVaultAddr: "Комиссия мекенжайы дұрыс емес",
      noTreasury: "Комиссия үшін платформа әмияны берілмеген (NEXT_PUBLIC_TREASURY). Негізгі желіде шот құру өшірулі.",
      reqName: "Аты-жөні немесе ЖК атауы",
      reqNamePh: "ЖК Смағұлов А.Б.",
      reqIin: "ЖСН / БСН (12 сан)",
      reqSaved: "Деректемелер сақталды ✓",
      iinWord: "ЖСН",
      noProgram: "Бағдарлама бапталмаған (NEXT_PUBLIC_PROGRAM_ID).",
      noWallet: "Әмиян қосылмаған. Phantom немесе Solflare қосыңыз не жоғарыдан демо-режимді қосыңыз.",
      splitTitle: "Төлемді авто-бөлу (желіде)",
      partYou: "Орындаушы",
      partFee: "Сервис комиссиясы",
      partCollab: "Серіктес",
      youGet: (p) => `Сіздің әмияныңызға (${p}%):`,
      feeLine: (p) => `Сервис комиссиясы (${p}%):`,
      collabLine: (p) => `Серіктеске (${p}%):`,
      invoiceFallback: "Шот",
      taskFallback: "Қызмет атауы",
      checkoutPreview: "Тапсырыс беруші осылай көреді",
      clientLine: (c) => `Тапсырыс беруші: ${c} · 1 кликпен төлеу`,
      templateDesign: "Мобильді қосымшаның UI/UX дизайны",
      templateDev: "Смарт-контракт әзірлеу",
      templateConsult: "Техникалық кеңес және аудит",
      demoCollabName: "Алина (UI/UX дизайнер)",
    },
    pay: {
      wallets: "Phantom, Solflare, Backpack",
      notFoundMeta: "Шот табылмады",
      metaTitle: "SteppeInvoice — 1 кликпен төлеу",
      metaPaid: "Шот төленді. Орындалған жұмыстар акті қолжетімді.",
      metaDesc: "1 кликпен төлеңіз. Ақша қатысушылар арасында бір транзакцияда бөлінеді.",
      signNote: "Транзакцияға тікелей өз әмияныңыз қол қояды.",
    },
    profile: {
      errCollabAddr: "Solana әмиянының мекенжайы дұрыс емес",
      errCollabName: "Серіктестің атын немесе рөлін көрсетіңіз",
      demoCollabNote: "Дизайн-жүйелер, Figma, прототиптер",
      featuresTitle: "Жеке кабинетте қолжетімді:",
      feat1: "Айналым мен 4% салық аналитикасы (оңайлатылған декларация, 910.00 нысаны)",
      feat2: "Актілерге автоматты қойылатын ЖК немесе ЖШС деректемелері",
      feat3: "Серіктестер кітабы: мекенжайлар мен үлестер өздігінен қойылады",
      taxNote: "Оңайлатылған 4% (910.00 нысаны)",
      thInvoice: "Шот", thAmount: "Сома", thSplit: "Бөлу", thStatus: "Мәртебе", thActions: "Әрекеттер",
      paid: "ТӨЛЕНДІ", pending: "КҮТІЛУДЕ", cancelBtn: "Болдырмау",
      reqTitle: "Орындалған жұмыстар акті деректемелері (Р-1 нысаны)",
      reqDesc: "Бұл деректер QR-мөрі бар актіге автоматты түрде түседі. Артық өрістер жоқ: сервис байланыс деректеріңізді сақтамайды.",
      addrPlaceholder: "Астана қ., Достық к., 18",
      collabHint: "Серіктестерді сақтап қойыңыз — шот құрғанда 1 кликпен таңдайсыз.",
      addDemo: "+ Демо-серіктес қосу (Алина)",
      savedTitle: (n) => `Сақталған серіктестер (${n})`,
      share: (p) => `үлесі ${p}%`,
    },
    wallet: {
      invalid: "Әмиян мекенжайы дұрыс емес.", badge: "Тексерілген орындаушы", viewSolscan: "Әмиян Solscan-да ↗", reading: "Беделді желіден оқып жатырмын…",
      stats: { paid: "Төленген шоттар", billed: "Барлығы ұсынылды", net: "Орындаушыға түсті", saved: "Автоматты түрде жиналды" },
      note: "Осы әмиянның блокчейндегі шоттары бойынша лезде есептеледі: бедел әмиянмен бірге жүреді, платформаға тәуелді емес. Болдырылмаған шоттар желіде жабылады және тарихты бүлдірмейді.",
      invoices: "Шоттар", none: "Әзірге шоттар жоқ.",
      paidTag: "ТӨЛЕНДІ", openTag: "АШЫҚ", receipt: "Түбіртек", checkout: "Төлем",
      cancelling: "Болдырып жатырмын…", cancelReclaim: "Болдырмау және депозитті қайтару", openCount: (n) => `${n} ашық`,
    },
    demo: {
      title: "Демо-әмияндар: кеңейтімсіз, нақты ақшасыз",
      intro: "Бұл Solana Devnet сынақ желісіндегі ашық әмияндар. Олардағы монеталардың құны жоқ, ал кілттер кез келген адам өнімді байқап көруі үшін әдейі жарияланған. Барлық әрекеттер — сынақ блокчейнінің нақты транзакциялары: кез келген мекенжайды Solscan-да ашуға болады.",
      step1: "«Demo Freelancer» таңдап, «Шот құру» бетін ашып, шотты құрыңыз («Demo Savings Vault» пен «Demo Collaborator» арқылы бөлуді көресіз).",
      step2: "Төлем сілтемесін көшіріп, осында оралыңыз, «Demo Client 1» таңдап, сілтемені ашып төлеңіз.",
      step3: "Төмендегі балансты бақылаңыз, сосын орындалған жұмыстар актісін ашыңыз.",
      connected: "Қазір қосылған", nobody: "ешкім", use: "Осы әмиянды қолдану", usedNow: "Қосылған ✓",
      receiveOnly: "Тек қабылдауға арналған (мекенжайды шот пішініне қойыңыз).",
      roles: {
        freelancer: "Шот құрып, төлем алады", client1: "Шоттарды төлейді", client2: "Шоттарды төлейді",
        vault: "Сервис комиссиясын алады", collaborator: "Серіктес үлесін алады",
      },
    },
  },
  en: {
    nav: { finance: "Finance" },
    common: { copied: "✓ Copied", copy: "Copy", copyText: "Copy text", open: "Open ↗", refresh: "Refresh", act: "Act", invoiceLink: "Invoice →", cancel: "Cancel" },
    log: { title: "Activity log", empty: "Nothing yet. Every wallet and network step will appear here.", copy: "copy", clear: "clear" },
    blink: { you: "You", tweet: "Invoice is ready — pay in one click #Solana #Blinks", bannerAlt: "Invoice banner", pay: "Pay invoice" },
    share: {
      tgText: (t, a) => `Invoice "${t}" for ${a} SOL.\nPay in one click:`,
      xText: (t, a) => `Invoice "${t}" — ${a} SOL. Pay in one click on Solana:`,
      paidNote: "The Solana smart contract instantly split the funds between the wallets.",
      qrLoading: "Generating QR…",
      qrAlt: "Invoice QR code",
      blinkDesc: (c, k, f) => `Auto-split: ${c}% to you${k ? ` · ${k}% to collaborator` : ""} · ${f}% service fee`,
    },
    create: {
      errTitleLong: "The title is too long: 64 bytes at most (Cyrillic letters take 2 bytes each, about 32 letters)",
      errVaultAddr: "The fee address is not valid",
      noTreasury: "The platform fee wallet is not set (NEXT_PUBLIC_TREASURY). Creating invoices on mainnet is disabled.",
      reqName: "Full name or sole proprietor name",
      reqNamePh: "Sole proprietor Smagulov A.B.",
      reqIin: "IIN / BIN (12 digits)",
      reqSaved: "Details saved ✓",
      iinWord: "IIN",
      noProgram: "The program is not configured (NEXT_PUBLIC_PROGRAM_ID).",
      noWallet: "No wallet connected. Connect Phantom or Solflare, or turn on demo mode in the header.",
      splitTitle: "Automatic payment split (on-chain)",
      partYou: "You",
      partFee: "Service fee",
      partCollab: "Collaborator",
      youGet: (p) => `To your wallet (${p}%):`,
      feeLine: (p) => `Service fee (${p}%):`,
      collabLine: (p) => `To collaborator (${p}%):`,
      invoiceFallback: "Invoice",
      taskFallback: "Service title",
      checkoutPreview: "What your client sees",
      clientLine: (c) => `Client: ${c} · pay in one click`,
      templateDesign: "Mobile app UI/UX design",
      templateDev: "Smart contract development",
      templateConsult: "Technical consulting and audit",
      demoCollabName: "Alina (UI/UX designer)",
    },
    pay: {
      wallets: "Phantom, Solflare, Backpack",
      notFoundMeta: "Invoice not found",
      metaTitle: "SteppeInvoice — pay in one click",
      metaPaid: "Invoice paid. The act of completed work is available.",
      metaDesc: "Pay in one click. The money is split between participants in a single transaction.",
      signNote: "The transaction is signed directly by your own wallet.",
    },
    profile: {
      errCollabAddr: "That is not a valid Solana wallet address",
      errCollabName: "Enter the collaborator's name or role",
      demoCollabNote: "Design systems, Figma, prototypes",
      featuresTitle: "Your dashboard includes:",
      feat1: "Turnover and 4% tax analytics (simplified declaration, form 910.00)",
      feat2: "Sole proprietor or LLP details filled into acts automatically",
      feat3: "A collaborator book: addresses and shares fill in by themselves",
      taxNote: "Simplified 4% (form 910.00)",
      thInvoice: "Invoice", thAmount: "Amount", thSplit: "Split", thStatus: "Status", thActions: "Actions",
      paid: "PAID", pending: "PENDING", cancelBtn: "Cancel",
      reqTitle: "Details for the act of completed work (form R-1)",
      reqDesc: "These details go into the act with the QR seal automatically. There are no extra fields: the service does not store your contacts.",
      addrPlaceholder: "18 Dostyk St, Astana",
      collabHint: "Save collaborators to pick them in one click when creating an invoice.",
      addDemo: "+ Add demo collaborator (Alina)",
      savedTitle: (n) => `Saved collaborators (${n})`,
      share: (p) => `${p}% share`,
    },
    wallet: {
      invalid: "Invalid wallet address.", badge: "Verified freelancer", viewSolscan: "View wallet on Solscan ↗", reading: "Reading on-chain reputation…",
      stats: { paid: "Paid invoices", billed: "Total billed", net: "Net to freelancer", saved: "Auto-saved in vault" },
      note: "Computed live from this wallet's on-chain invoice accounts: portable reputation, not a platform rating. Cancelled invoices are closed on-chain and never count against the record.",
      invoices: "Invoices", none: "No invoices yet.",
      paidTag: "PAID", openTag: "OPEN", receipt: "Receipt", checkout: "Checkout",
      cancelling: "Cancelling…", cancelReclaim: "Cancel and reclaim deposit", openCount: (n) => `${n} open`,
    },
    demo: {
      title: "Demo wallets: no extension, no real money",
      intro: "These are public wallets on the Solana Devnet test network. Their coins are worthless, and their keys are published on purpose so anyone can try the product. Everything you do is a real transaction on the test blockchain: any address can be opened on Solscan.",
      step1: "Choose “Demo Freelancer”, open “Create invoice” and create one (use “Demo Savings Vault” and “Demo Collaborator” to see the split).",
      step2: "Copy the payment link, come back here, choose “Demo Client 1”, open the link and pay.",
      step3: "Watch the balances below change, then open the act of completed work.",
      connected: "Currently connected", nobody: "nobody", use: "Use this wallet", usedNow: "Connected ✓",
      receiveOnly: "Receive-only address (paste it into the invoice form).",
      roles: {
        freelancer: "Creates invoices and gets paid", client1: "Pays invoices", client2: "Pays invoices",
        vault: "Receives the service fee", collaborator: "Receives the collaborator share",
      },
    },
  },
};
