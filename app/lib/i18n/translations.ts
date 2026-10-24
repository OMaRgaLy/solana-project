export type Language = "kk" | "ru" | "en";

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    liveMode: string;
    demoMode: string;
    switchMode: string;
    connectWallet: string;
    disconnect: string;
    copied: string;
    copy: string;
    solscan: string;
    loading: string;
    error: string;
    save: string;
    saved: string;
    cancel: string;
    back: string;
    close: string;
    sol: string;
    approx: string;
  };
  header: {
    createInvoice: string;
    myProfile: string;
    howItWorks: string;
    demoNotice: string;
    switchToLive: string;
    switchToDemo: string;
  };
  home: {
    badge: string;
    heroTitle1: string;
    heroTitleAccent: string;
    heroDesc: string;
    createCta: string;
    demoCta: string;
    howTitle: string;
    howStep1Title: string;
    howStep1Desc: string;
    howStep2Title: string;
    howStep2Desc: string;
    howStep3Title: string;
    howStep3Desc: string;
    howStep4Title: string;
    howStep4Desc: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
  };
  create: {
    title: string;
    subtitle: string;
    templateQuick: string;
    taskTitle: string;
    taskTitlePlaceholder: string;
    clientName: string;
    clientPlaceholder: string;
    amountLabel: string;
    amountHint: string;
    feeNote: string;
    contractorProfileNotice: string;
    editProfileLink: string;
    collabSection: string;
    collabCheckbox: string;
    collabShare: string;
    collabAddr: string;
    collabPlaceholder: string;
    useDemoCollab: string;
    previewTitle: string;
    previewBlink: string;
    previewCheckout: string;
    deployBtn: string;
    deploying: string;
    needWallet: string;
    errTitleEmpty: string;
    errAmountInvalid: string;
    errCollabAddr: string;
    templateDesign: string;
    templateDev: string;
    templateAudit: string;
  };
  share: {
    titleSuccess: string;
    subtitleSuccess: string;
    viewSolscan: string;
    shareHeading: string;
    shareTg: string;
    shareX: string;
    shareWa: string;
    copyCheckout: string;
    copyBlink: string;
    copyMessage: string;
    qrTitle: string;
    qrHint: string;
    waitingPayment: string;
    paidDetected: string;
    openAct: string;
    openCheckout: string;
    shareMsgTemplate: (title: string, amount: string, url: string) => string;
  };
  pay: {
    verifiedBadge: string;
    invoiceTitle: string;
    amountDue: string;
    fromCreator: string;
    splitBreakdown: string;
    creatorShare: string;
    protocolFee: string;
    collabShare: string;
    payBtn: string;
    payingBtn: string;
    connectPrompt: string;
    demoPayBtn: string;
    paidTitle: string;
    paidDesc: string;
    openActBtn: string;
    notFoundTitle: string;
    notFoundDesc: string;
  };
  act: {
    docTitle: string;
    number: string;
    contractor: string;
    iinBin: string;
    customer: string;
    subject: string;
    totalAmount: string;
    solRateNotice: string;
    statusPaid: string;
    qrNotice: string;
    printBtn: string;
    switchLangNotice: string;
  };
  profile: {
    title: string;
    subtitle: string;
    companyOrName: string;
    companyPlaceholder: string;
    iinBinLabel: string;
    emailLabel: string;
    phoneLabel: string;
    tgLabel: string;
    walletLabel: string;
    saveProfileBtn: string;
    savedAlert: string;
    myInvoicesTitle: string;
    grossTotal: string;
    netTotal: string;
    invoicesCount: string;
    noInvoices: string;
    cancelBtn: string;
  };
  onboarding: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    gotItBtn: string;
    tipsTitle: string;
    tipTaxTitle: string;
    tipTaxDesc: string;
    tipCollabTitle: string;
    tipCollabDesc: string;
    tipBlinkTitle: string;
    tipBlinkDesc: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    common: {
      appName: "SteppeInvoice",
      tagline: "Инвойсы в Solana с мгновенным авто-сплитом и Актом выполненных работ",
      liveMode: "Боевой режим",
      demoMode: "Демо-режим",
      switchMode: "Сменить режим",
      connectWallet: "Подключить кошелек",
      disconnect: "Отключить",
      copied: "Скопировано!",
      copy: "Копировать",
      solscan: "Смотреть в Solscan ↗",
      loading: "Загрузка...",
      error: "Ошибка",
      save: "Сохранить",
      saved: "Сохранено ✓",
      cancel: "Отмена",
      back: "Назад",
      close: "Закрыть",
      sol: "SOL",
      approx: "≈",
    },
    header: {
      createInvoice: "Создать инвойс",
      myProfile: "Реквизиты и Профиль",
      howItWorks: "Как это работает",
      demoNotice: "Тестовая сеть Solana Devnet · Виртуальные средства",
      switchToLive: "Включить боевой режим",
      switchToDemo: "Включить демо-режим",
    },
    home: {
      badge: "🇰🇿 Создано для фрилансеров и IT-команд",
      heroTitle1: "Выставляй счета миру.",
      heroTitleAccent: "Получай оплату за 400 мс.",
      heroDesc: "SteppeInvoice превращает платеж в Solana Blink: клиент оплачивает счет в 1 клик прямо в Twitter или Telegram. Смарт-контракт мгновенно делит оплату между вами и напарником, а система формирует официальный Акт выполненных работ с QR-печатью.",
      createCta: "Создать инвойс →",
      demoCta: "Попробовать демо без кошелька",
      howTitle: "Как это работает",
      howStep1Title: "Создайте инвойс",
      howStep1Desc: "Укажите сумму в SOL, напарника и его долю. Реквизиты для Акта подставятся из профиля.",
      howStep2Title: "Поделитесь ссылкой",
      howStep2Desc: "Отправьте готовую ссылку в Telegram, WhatsApp или опубликуйте как Solana Blink в X (Twitter).",
      howStep3Title: "Мгновенная оплата",
      howStep3Desc: "Клиент подтверждает транзакцию в своем кошельке. Смарт-контракт делит средства за 400 мс.",
      howStep4Title: "Скачайте Акт",
      howStep4Desc: "Официальный Акт выполненных работ с QR-кодом подтверждения транзакции в Solscan для вашей бухгалтерии.",
      feat1Title: "📄 Акт выполненных работ",
      feat1Desc: "Печатная форма первичного документа по законодательству РК с пересчетом в тенге и цифровой QR-печатью.",
      feat2Title: "⚡ Атомарный ончейн-сплит",
      feat2Desc: "Входящий платеж делится прямо внутри смарт-контракта без посредников и без хранения средств на сервисе.",
      feat3Title: "🌟 Ончейн-репутация",
      feat3Desc: "История оплаченных счетов хранится в блокчейне — никто не сможет заблокировать ваш заработанный рейтинг.",
    },
    create: {
      title: "Новый инвойс",
      subtitle: "Создание защищенного счета в блокчейне Solana с автоматическим сплитом",
      templateQuick: "Быстрые шаблоны:",
      templateDesign: "UI/UX Дизайн (1.5 SOL)",
      templateDev: "Разработка (5 SOL)",
      templateAudit: "Консультация (0.5 SOL)",
      taskTitle: "Название задачи / предмета работ (в блокчейн, до 64 симв.)",
      taskTitlePlaceholder: "Например: Разработка адаптивного лендинга",
      clientName: "Заказчик / Компания клиента",
      clientPlaceholder: "Например: Acme Corp (USA)",
      amountLabel: "Сумма в SOL",
      amountHint: "Курс обновляется в реальном времени:",
      feeNote: "Комиссия протокола SteppeInvoice: 1% (авто-отчисление при оплате)",
      contractorProfileNotice: "Данные исполнителя для Акта:",
      editProfileLink: "Изменить в профиле",
      collabSection: "🤝 Доля напарника (Коллаборатора)",
      collabCheckbox: "Разделить оплату с напарником (субподрядчиком)",
      collabShare: "Доля напарника",
      collabAddr: "Solana-кошелек напарника",
      collabPlaceholder: "Адрес кошелька получателя",
      useDemoCollab: "Вставить адрес Demo-напарника",
      previewTitle: "Живой предпросмотр инвойса",
      previewBlink: "Превью Blink в ленте соцсетей",
      previewCheckout: "Превью страницы оплаты",
      deployBtn: "Создать инвойс в блокчейне",
      deploying: "Подтверждение в блокчейне...",
      needWallet: "Подключите кошелек для создания",
      errTitleEmpty: "Введите название задачи",
      errAmountInvalid: "Укажите корректную сумму в SOL (> 0)",
      errCollabAddr: "Введите корректный адрес Solana-кошелька напарника",
    },
    share: {
      titleSuccess: "Инвойс успешно создан!",
      subtitleSuccess: "Счет зафиксирован в блокчейне Solana. Отправьте ссылку заказчику.",
      viewSolscan: "Посмотреть транзакцию создания в Solscan ↗",
      shareHeading: "Отправить заказчику в 1 клик",
      shareTg: "В Telegram",
      shareX: "В Twitter / X",
      shareWa: "В WhatsApp",
      copyCheckout: "Ссылка на оплату",
      copyBlink: "Ссылка Blink (dial.to)",
      copyMessage: "Готовое сообщение со счетом",
      qrTitle: "Оплата по QR-коду",
      qrHint: "Клиент может отсканировать камерой мобильного кошелька (Phantom, Solflare)",
      waitingPayment: "Ожидание оплаты... Экран обновится автоматически в реальном времени.",
      paidDetected: "🎉 Оплата получена! Сплит успешно выполнен.",
      openAct: "Открыть Акт выполненных работ →",
      openCheckout: "Открыть страницу оплаты",
      shareMsgTemplate: (title, amt, url) => `Здравствуйте! Выставляю счет за "${title}" на сумму ${amt} SOL.\nОплатить в 1 клик можно по ссылке:\n${url}`,
    },
    pay: {
      verifiedBadge: "SteppeInvoice · Верифицированный ончейн-инвойс",
      invoiceTitle: "Счет на оплату",
      amountDue: "К оплате",
      fromCreator: "Исполнитель:",
      splitBreakdown: "Куда распределяются средства при оплате (атомарно):",
      creatorShare: "Исполнитель",
      protocolFee: "Комиссия протокола (1%)",
      collabShare: "Напарник",
      payBtn: "Оплатить",
      payingBtn: "Подтверждение транзакции в кошельке...",
      connectPrompt: "Подключите кошелек для оплаты",
      demoPayBtn: "Оплатить от лица Demo Client (в 1 клик)",
      paidTitle: "Оплачено! Платеж зафиксирован в блокчейне",
      paidDesc: "Средства моментально разделены между кошельками в одной транзакции.",
      openActBtn: "📄 Открыть Акт выполненных работ",
      notFoundTitle: "Инвойс не найден",
      notFoundDesc: "Возможно, счет был отменен исполнителем или ссылка содержит ошибку.",
    },
    act: {
      docTitle: "АКТ ВЫПОЛНЕННЫХ РАБОТ (ОКАЗАННЫХ УСЛУГ)",
      number: "№",
      contractor: "Исполнитель:",
      iinBin: "ИИН/БИН:",
      customer: "Заказчик:",
      subject: "Наименование работ (услуг):",
      totalAmount: "ИТОГО К ОПЛАТЕ:",
      solRateNotice: "Расчетный эквивалент по официальному курсу на момент закрытия сделки:",
      statusPaid: "✓ ОПЛАЧЕНО В СЕТИ SOLANA (Транзакция зафиксирована ончейн)",
      qrNotice: "Отсканируйте QR-код для верификации криптографической подписи транзакции в Solscan Explorer",
      printBtn: "Распечатать / Сохранить в PDF",
      switchLangNotice: "Язык документа:",
    },
    profile: {
      title: "Юридический профиль и реквизиты",
      subtitle: "Данные сохраняются локально и автоматически подставляются в ваши инвойсы и Акты выполненных работ",
      companyOrName: "Название компании / ИП / ФИО исполнителя",
      companyPlaceholder: "Например: ИП Смагулов А.Б. или Nomad Studio",
      iinBinLabel: "ИИН / БИН (12 цифр)",
      emailLabel: "Контактный Email",
      phoneLabel: "Номер телефона / WhatsApp",
      tgLabel: "Telegram никнейм (@username)",
      walletLabel: "Основной Solana-кошелек",
      saveProfileBtn: "Сохранить реквизиты",
      savedAlert: "Реквизиты сохранены! Теперь они будут подставляться во все новые инвойсы.",
      myInvoicesTitle: "История выставленных инвойсов",
      grossTotal: "Всего выставлено",
      netTotal: "Получено чистыми",
      invoicesCount: "Количество инвойсов",
      noInvoices: "Вы пока не создали ни одного инвойса.",
      cancelBtn: "Отменить и вернуть ренту",
    },
    onboarding: {
      welcomeTitle: "Добро пожаловать в SteppeInvoice!",
      welcomeSubtitle: "Платежи в Solana с автоматическим сплитом и бухгалтерскими документами",
      step1Title: "1. Выставляйте инвойс в SOL",
      step1Desc: "Указывайте сумму, долю напарника и копилку. Заполненные реквизиты ИП сразу идут в Акт.",
      step2Title: "2. Отправляйте ссылку в любой мессенджер",
      step2Desc: "Ссылка превращается в кнопку оплаты в Telegram, WhatsApp или Solana Blink в X (Twitter).",
      step3Title: "3. Получайте оплату и юридический Акт",
      step3Desc: "Деньги делятся за 400 мс смарт-контрактом, а вы получаете документ с QR-печатью для налоговой.",
      gotItBtn: "Понятно, приступить к работе",
      tipsTitle: "Советы и частые вопросы",
      tipTaxTitle: "Как отчитываться перед налоговой в РК?",
      tipTaxDesc: "В Акте выполненных работ фиксируется сумма в тенге по курсу на дату оплаты. QR-код ведет в Solscan, подтверждая факт расчета. Доход декларируется по форме 910 (упрощенка 3%).",
      tipCollabTitle: "Как работает сплит с напарником?",
      tipCollabDesc: "Смарт-контракт атомарно делит средства в одной транзакции. Напарник получает свою часть на кошелек моментально.",
      tipBlinkTitle: "Что такое Solana Blink?",
      tipBlinkDesc: "Это ссылка, которая прямо в ленте Twitter или Telegram отображает карточку с кнопкой оплаты без перехода на сайт.",
    },
  },

  kk: {
    common: {
      appName: "SteppeInvoice",
      tagline: "Solana-да лезде авто-бөлу және Орындалған жұмыстар актісі бар шоттар",
      liveMode: "Негізгі режим",
      demoMode: "Демо-режим",
      switchMode: "Режимді ауыстыру",
      connectWallet: "Әмиянды қосу",
      disconnect: "Ажырату",
      copied: "Көшірілді!",
      copy: "Көшіру",
      solscan: "Solscan-да көру ↗",
      loading: "Жүктелуде...",
      error: "Қате",
      save: "Сақтау",
      saved: "Сақталды ✓",
      cancel: "Бас тарту",
      back: "Артқа",
      close: "Жабу",
      sol: "SOL",
      approx: "≈",
    },
    header: {
      createInvoice: "Шот жасау",
      myProfile: "Деректемелер мен Профиль",
      howItWorks: "Қалай жұмыс істейді",
      demoNotice: "Solana Devnet сынақ желісі · Виртуалды қаражат",
      switchToLive: "Негізгі режимге өту",
      switchToDemo: "Демо-режимге өту",
    },
    home: {
      badge: "🇰🇿 Фрилансерлер мен IT-командалар үшін жасалған",
      heroTitle1: "Әлемге шот ұсыныңыз.",
      heroTitleAccent: "Төлемді 400 мс ішінде алыңыз.",
      heroDesc: "SteppeInvoice төлемді Solana Blink-ке айналдырады: тапсырыс беруші Twitter немесе Telegram-да 1 рет басу арқылы төлейді. Смарт-келісімшарт төлемді серіктесіңізбен бөледі, ал жүйе QR-мөрі бар ресми Орындалған жұмыстар актісін жасайды.",
      createCta: "Шот жасау →",
      demoCta: "Әмиянсыз демоны байқап көру",
      howTitle: "Жұмыс істеу реті",
      howStep1Title: "Шот жасаңыз",
      howStep1Desc: "SOL сомасын, серіктесті және оның үлесін көрсетіңіз. Акт деректері профильден қойылады.",
      howStep2Title: "Сілтемені жіберіңіз",
      howStep2Desc: "Дайын сілтемені Telegram, WhatsApp арқылы жіберіңіз немесе X (Twitter)-де Blink ретінде жариялаңыз.",
      howStep3Title: "Лезде төлем",
      howStep3Desc: "Клиент өз әмиянында транзакцияны растайды. Смарт-келісімшарт қаражатты 400 мс ішінде бөледі.",
      howStep4Title: "Актіні жүктеп алыңыз",
      howStep4Desc: "Бухгалтерияңыз үшін Solscan-дағы транзакцияны растайтын QR-мөрі бар ресми Орындалған жұмыстар актісі.",
      feat1Title: "📄 Орындалған жұмыстар актісі",
      feat1Desc: "ҚР заңнамасына сәйкес теңгеге шаққандағы және цифрлық QR-мөрі бар бастапқы құжат формасы.",
      feat2Title: "⚡ Атомарлы ончейн-бөлу",
      feat2Desc: "Кіріс төлем делдалдарсыз және қаражатты сервисте ұстамай, тікелей смарт-келісімшарт ішінде бөлінеді.",
      feat3Title: "🌟 Ончейн-бедел",
      feat3Desc: "Төленген шоттар тарихы блокчейнде сақталады — ешкім сіздің беделіңізді бұғаттай алмайды.",
    },
    create: {
      title: "Жаңа шот",
      subtitle: "Solana блокчейнінде авто-бөлуі бар қорғалған инвойс жасау",
      templateQuick: "Жылдам үлгілер:",
      templateDesign: "UI/UX Дизайн (1.5 SOL)",
      templateDev: "Бағдарламалау (5 SOL)",
      templateAudit: "Кеңес беру (0.5 SOL)",
      taskTitle: "Тапсырма / жұмыс атауы (блокчейнге, 64 таңбаға дейін)",
      taskTitlePlaceholder: "Мысалы: Бейімделген лендинг жасау",
      clientName: "Тапсырыс беруші / Клиент компаниясы",
      clientPlaceholder: "Мысалы: Acme Corp (USA)",
      amountLabel: "Сома (SOL)",
      amountHint: "Бағам нақты уақытта жаңартылады:",
      feeNote: "SteppeInvoice хаттама комиссиясы: 1% (төлем кезінде автоматты түрде)",
      contractorProfileNotice: "Акт үшін орындаушының деректері:",
      editProfileLink: "Профильде өзгерту",
      collabSection: "🤝 Серіктес (Коллаборатор) үлесі",
      collabCheckbox: "Төлемді серіктеспен (қосалқы орындаушымен) бөлісу",
      collabShare: "Серіктес үлесі",
      collabAddr: "Серіктестің Solana әмияны",
      collabPlaceholder: "Қабылдаушы әмиян мекенжайы",
      useDemoCollab: "Demo-серіктес мекенжайын қою",
      previewTitle: "Шотты алдын ала көру",
      previewBlink: "Әлеуметтік желідегі Blink бейнесі",
      previewCheckout: "Төлем парақшасын алдын ала көру",
      deployBtn: "Блокчейнде шот жасау",
      deploying: "Блокчейнде расталуда...",
      needWallet: "Шот жасау үшін әмиянды қосыңыз",
      errTitleEmpty: "Тапсырма атауын енгізіңіз",
      errAmountInvalid: "Дұрыс SOL сомасын көрсетіңіз (> 0)",
      errCollabAddr: "Серіктестің дұрыс Solana әмиянын енгізіңіз",
    },
    share: {
      titleSuccess: "Шот сәтті жасалды!",
      subtitleSuccess: "Инвойс Solana блокчейнінде бекітілді. Сілтемені тапсырыс берушіге жіберіңіз.",
      viewSolscan: "Жасау транзакциясын Solscan-да көру ↗",
      shareHeading: "Тапсырыс берушіге 1 рет басу арқылы жіберу",
      shareTg: "Telegram арқылы",
      shareX: "Twitter / X арқылы",
      shareWa: "WhatsApp арқылы",
      copyCheckout: "Төлем сілтемесі",
      copyBlink: "Blink сілтемесі (dial.to)",
      copyMessage: "Шот туралы дайын хабарлама",
      qrTitle: "QR-код арқылы төлеу",
      qrHint: "Клиент мобильді әмиян камерасымен сканерлей алады (Phantom, Solflare)",
      waitingPayment: "Төлем күтілуде... Экран нақты уақытта автоматты түрде жаңарады.",
      paidDetected: "🎉 Төлем қабылданды! Бөлініс сәтті орындалды.",
      openAct: "Орындалған жұмыстар актісін ашу →",
      openCheckout: "Төлем парақшасын ашу",
      shareMsgTemplate: (title, amt, url) => `Сәлеметсіз бе! "${title}" бойынша ${amt} SOL сомасына шот ұсынамын.\n1 рет басу арқылы төлеу сілтемесі:\n${url}`,
    },
    pay: {
      verifiedBadge: "SteppeInvoice · Тексерілген ончейн-инвойс",
      invoiceTitle: "Төлем шоты",
      amountDue: "Төленетін сома",
      fromCreator: "Орындаушы:",
      splitBreakdown: "Төлем кезінде қаражаттың бөлінуі (атомарлы):",
      creatorShare: "Орындаушы",
      protocolFee: "Хаттама комиссиясы (1%)",
      collabShare: "Серіктес",
      payBtn: "Төлеу",
      payingBtn: "Әмиянда транзакция расталуда...",
      connectPrompt: "Төлем жасау үшін әмиянды қосыңыз",
      demoPayBtn: "Demo Client атынан төлеу (1 рет басу)",
      paidTitle: "Төленді! Төлем блокчейнде бекітілді",
      paidDesc: "Қаражат бір транзакция ішінде әмияндарға лезде бөлінді.",
      openActBtn: "📄 Орындалған жұмыстар актісін ашу",
      notFoundTitle: "Шот табылмады",
      notFoundDesc: "Шот орындаушы тарапынан жойылған болуы мүмкін немесе сілтемеде қате бар.",
    },
    act: {
      docTitle: "ОРЫНДАЛҒАН ЖҰМЫСТАР (КӨРСЕТІЛГЕН ҚЫЗМЕТТЕР) АКТІСІ",
      number: "№",
      contractor: "Орындаушы:",
      iinBin: "ЖСН/БСН:",
      customer: "Тапсырыс беруші:",
      subject: "Жұмыстардың (қызметтердің) атауы:",
      totalAmount: "ТӨЛЕНУГЕ ТИІС БАРЛЫҒЫ:",
      solRateNotice: "Мәміле жабылған кездегі ресми бағам бойынша есептелген балама:",
      statusPaid: "✓ SOLANA ЖЕЛІСІНДЕ ТӨЛЕНДІ (Транзакция ончейн бекітілді)",
      qrNotice: "Solscan Explorer-де транзакцияның цифрлық қолтаңбасын тексеру үшін QR-кодты сканерлеңіз",
      printBtn: "Басып шығару / PDF ретінде сақтау",
      switchLangNotice: "Құжат тілі:",
    },
    profile: {
      title: "Заңды тұлға профилі мен деректемелер",
      subtitle: "Деректер жергілікті түрде сақталады және шоттарыңыз бен Орындалған жұмыстар актілеріне автоматты түрде қойылады",
      companyOrName: "Компания атауы / ЖК / Орындаушының аты-жөні",
      companyPlaceholder: "Мысалы: ЖК Смағұлов А.Б. немесе Nomad Studio",
      iinBinLabel: "ЖСН / БСН (12 сан)",
      emailLabel: "Байланыс электрондық поштасы",
      phoneLabel: "Телефон нөмірі / WhatsApp",
      tgLabel: "Telegram пайдаланушы аты (@username)",
      walletLabel: "Негізгі Solana әмияны",
      saveProfileBtn: "Деректемелерді сақтау",
      savedAlert: "Деректемелер сақталды! Енді олар барлық жаңа шоттарға қойылады.",
      myInvoicesTitle: "Шығарылған шоттар тарихы",
      grossTotal: "Барлығы шығарылған",
      netTotal: "Таза түскен табыс",
      invoicesCount: "Шоттар саны",
      noInvoices: "Сіз әлі бірде-бір шот жасаған жоқсыз.",
      cancelBtn: "Бас тарту және рентаны қайтару",
    },
    onboarding: {
      welcomeTitle: "SteppeInvoice-ке қош келдіңіз!",
      welcomeSubtitle: "Solana-да автоматты бөлу және бухгалтерлік құжаттары бар төлемдер",
      step1Title: "1. SOL-мен шот ұсыныңыз",
      step1Desc: "Соманы, серіктес үлесін және қорды көрсетіңіз. Деректер бірден Актіге жазылады.",
      step2Title: "2. Сілтемені кез келген мессенджерге жіберіңіз",
      step2Desc: "Сілтеме Telegram, WhatsApp-та немесе X-те Solana Blink-ке айналады.",
      step3Title: "3. Төлемді және ресми Актіні алыңыз",
      step3Desc: "Қаражат 400 мс ішінде смарт-келісімшартпен бөлінеді, ал сіз QR-мөрлі Акті аласыз.",
      gotItBtn: "Түсінікті, жұмысты бастау",
      tipsTitle: "Кеңестер мен жиі қойылатын сұрақтар",
      tipTaxTitle: "ҚР салық органдарына қалай есеп беруге болады?",
      tipTaxDesc: "Орындалған жұмыстар актісінде төлем күніндегі теңгелік сома бекітіледі. QR-код Solscan-ға сілтейді. Табыс 910-нысан бойынша (3% оңайлатылған декларация) декларацияланады.",
      tipCollabTitle: "Серіктеспен бөлісу қалай жұмыс істейді?",
      tipCollabDesc: "Смарт-келісімшарт қаражатты бір транзакцияда атомарлы түрде бөледі. Серіктес өз үлесін әмиянына бірден алады.",
      tipBlinkTitle: "Solana Blink дегеніміз не?",
      tipBlinkDesc: "Бұл Twitter немесе Telegram арнасында сайтқа кірмей-ақ төлем түймесін көрсететін сілтеме.",
    },
  },

  en: {
    common: {
      appName: "SteppeInvoice",
      tagline: "Solana invoices with instant on-chain auto-split and official Act of Works",
      liveMode: "Live Mode",
      demoMode: "Demo Mode",
      switchMode: "Switch mode",
      connectWallet: "Connect Wallet",
      disconnect: "Disconnect",
      copied: "Copied!",
      copy: "Copy",
      solscan: "View on Solscan ↗",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      saved: "Saved ✓",
      cancel: "Cancel",
      back: "Back",
      close: "Close",
      sol: "SOL",
      approx: "≈",
    },
    header: {
      createInvoice: "Create Invoice",
      myProfile: "Business Profile",
      howItWorks: "How it works",
      demoNotice: "Solana Devnet Test Network · Virtual Test SOL",
      switchToLive: "Switch to Live Mode",
      switchToDemo: "Switch to Demo Mode",
    },
    home: {
      badge: "🇰🇿 Built for Central Asian Freelancers & Global Teams",
      heroTitle1: "Invoice the world.",
      heroTitleAccent: "Get paid in 400ms.",
      heroDesc: "SteppeInvoice turns invoices into Solana Blinks: clients pay in 1 click directly inside X (Twitter) or Telegram feeds. The smart contract instantly splits funds between you and your collaborator, generating an official Act of Completed Works with an on-chain QR seal.",
      createCta: "Create an invoice →",
      demoCta: "Try demo without wallet",
      howTitle: "How It Works",
      howStep1Title: "Create invoice",
      howStep1Desc: "Specify amount in SOL, collaborator wallet, and split percentage.",
      howStep2Title: "Share the link",
      howStep2Desc: "Send a checkout link via Telegram, WhatsApp, or post a Solana Blink on X.",
      howStep3Title: "1-Click payment",
      howStep3Desc: "Client approves in Phantom or Solflare. The smart contract splits funds in 400ms.",
      howStep4Title: "Download the Act",
      howStep4Desc: "Official Certificate of Completion with a Solscan QR verification seal for accounting.",
      feat1Title: "📄 Act of Completed Works",
      feat1Desc: "Printable official accounting certificate with fiat equivalent and cryptographic QR seal.",
      feat2Title: "⚡ Atomic On-Chain Split",
      feat2Desc: "Incoming payments split inside the smart contract in one transaction without custodial risk.",
      feat3Title: "🌟 Portable Reputation",
      feat3Desc: "Paid invoice history lives permanently on-chain — no platform can lock your reputation.",
    },
    create: {
      title: "New Invoice",
      subtitle: "Deploy a secure Solana on-chain invoice with automatic split",
      templateQuick: "Quick Presets:",
      templateDesign: "UI/UX Design (1.5 SOL)",
      templateDev: "Development (5 SOL)",
      templateAudit: "Consulting (0.5 SOL)",
      taskTitle: "Task title / Scope of work (stored on-chain, ≤ 64 chars)",
      taskTitlePlaceholder: "e.g.: Responsive Landing Page Design",
      clientName: "Client / Company Name",
      clientPlaceholder: "e.g.: Acme Corp (USA)",
      amountLabel: "Amount in SOL",
      amountHint: "Live indicative exchange rate:",
      feeNote: "SteppeInvoice Protocol Fee: 1% (settled atomically upon payment)",
      contractorProfileNotice: "Contractor info for the legal Act:",
      editProfileLink: "Edit in profile",
      collabSection: "🤝 Collaborator Split",
      collabCheckbox: "Split payment with a collaborator (team member / dev)",
      collabShare: "Collaborator share",
      collabAddr: "Collaborator Solana wallet address",
      collabPlaceholder: "Recipient Solana public key",
      useDemoCollab: "Insert Demo Collaborator address",
      previewTitle: "Live Invoice Preview",
      previewBlink: "Blink Social Preview",
      previewCheckout: "Checkout Page Preview",
      deployBtn: "Deploy Invoice to Blockchain",
      deploying: "Confirming on Solana...",
      needWallet: "Connect wallet to deploy invoice",
      errTitleEmpty: "Please enter a task title",
      errAmountInvalid: "Please enter a valid SOL amount (> 0)",
      errCollabAddr: "Please enter a valid Solana address for collaborator",
    },
    share: {
      titleSuccess: "Invoice deployed successfully!",
      subtitleSuccess: "The invoice account is live on Solana. Share the payment link with your client.",
      viewSolscan: "View creation transaction on Solscan ↗",
      shareHeading: "Share with Client in 1 Click",
      shareTg: "Share to Telegram",
      shareX: "Share to Twitter / X",
      shareWa: "Share to WhatsApp",
      copyCheckout: "Checkout Page Link",
      copyBlink: "Blink Link (dial.to)",
      copyMessage: "Ready-to-send Message",
      qrTitle: "Pay via Mobile QR",
      qrHint: "Client can scan with Phantom or Solflare mobile wallet camera",
      waitingPayment: "Awaiting payment... Screen will update automatically in real time.",
      paidDetected: "🎉 Payment received! Split settled atomically on-chain.",
      openAct: "Open Act of Completed Works →",
      openCheckout: "Open Checkout Page",
      shareMsgTemplate: (title, amt, url) => `Hello! Here is the invoice for "${title}" (${amt} SOL).\nYou can pay in 1 click here:\n${url}`,
    },
    pay: {
      verifiedBadge: "SteppeInvoice · Verified On-Chain Invoice",
      invoiceTitle: "Payment Invoice",
      amountDue: "Amount Due",
      fromCreator: "Contractor:",
      splitBreakdown: "Where your payment goes (atomic on-chain split):",
      creatorShare: "Contractor",
      protocolFee: "Protocol Fee (1%)",
      collabShare: "Collaborator",
      payBtn: "Pay Invoice",
      payingBtn: "Confirming transaction in wallet...",
      connectPrompt: "Connect wallet to pay",
      demoPayBtn: "Pay as Demo Client (1 click test)",
      paidTitle: "Paid! Split settled on-chain",
      paidDesc: "Funds were transferred to all parties atomically in the same block.",
      openActBtn: "📄 Open Act of Completed Works",
      notFoundTitle: "Invoice not found",
      notFoundDesc: "The invoice may have been cancelled or the link is invalid.",
    },
    act: {
      docTitle: "CERTIFICATE OF COMPLETION (ACT OF COMPLETED WORKS)",
      number: "No.",
      contractor: "Contractor:",
      iinBin: "Tax ID / BIN:",
      customer: "Customer:",
      subject: "Scope of work / Services:",
      totalAmount: "TOTAL PAYABLE:",
      solRateNotice: "Indicative fiat conversion at the settlement timestamp:",
      statusPaid: "✓ PAID ON SOLANA (On-chain cryptographic settlement verified)",
      qrNotice: "Scan QR code to verify the cryptographic settlement transaction on Solscan Explorer",
      printBtn: "Print / Save as PDF",
      switchLangNotice: "Document language:",
    },
    profile: {
      title: "Business Profile & Requisites",
      subtitle: "Saved locally and automatically prefilled into your invoices and legal Acts of Works",
      companyOrName: "Company / Sole Proprietorship / Full Name",
      companyPlaceholder: "e.g.: Nomad Tech Studio or Smagulov A.B.",
      iinBinLabel: "Tax ID / IIN / BIN (12 digits)",
      emailLabel: "Contact Email",
      phoneLabel: "Phone / WhatsApp",
      tgLabel: "Telegram Username (@handle)",
      walletLabel: "Primary Payout Wallet",
      saveProfileBtn: "Save Profile",
      savedAlert: "Profile saved! These details will automatically appear on new invoices and Acts.",
      myInvoicesTitle: "Invoice History",
      grossTotal: "Total Invoiced",
      netTotal: "Net Received",
      invoicesCount: "Invoices Count",
      noInvoices: "You have not created any invoices yet.",
      cancelBtn: "Cancel and reclaim rent",
    },
    onboarding: {
      welcomeTitle: "Welcome to SteppeInvoice!",
      welcomeSubtitle: "Solana payments with instant atomic split and official accounting paperwork",
      step1Title: "1. Create an invoice in SOL",
      step1Desc: "Enter the amount and collaborator share. Contractor details automatically prefill the Act.",
      step2Title: "2. Send link anywhere",
      step2Desc: "The link works in Telegram, WhatsApp, or as a native Solana Blink inside X (Twitter).",
      step3Title: "3. Get paid & download the Act",
      step3Desc: "Funds split atomically in 400ms, and you get an official printable Act sealed with Solscan QR.",
      gotItBtn: "Got it, let's start",
      tipsTitle: "Guides & FAQ",
      tipTaxTitle: "How to declare income in Kazakhstan?",
      tipTaxDesc: "The Act records the KZT equivalent at the settlement timestamp. The QR verifies on-chain payment. Declare income under form 910 (3% simplified tax regime).",
      tipCollabTitle: "How does the collaborator split work?",
      tipCollabDesc: "The smart contract executes transfers in the exact same transaction. The collaborator receives their share instantly with zero trust issues.",
      tipBlinkTitle: "What is a Solana Blink?",
      tipBlinkDesc: "Blinks allow users to execute on-chain transactions directly from feed cards on X or Telegram without leaving the platform.",
    },
  },
};
