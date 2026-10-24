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
    delete: string;
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
    switchWalletText: string;
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
    feeTitle: string;
    feeDesc: string;
    contractorProfileNotice: string;
    editProfileLink: string;
    notAuthorizedNotice: string;
    saveRequisitesPrompt: string;
    saveRequisitesBtn: string;
    collabSection: string;
    collabCheckbox: string;
    selectSavedCollab: string;
    selectSavedCollabPlaceholder: string;
    orEnterManual: string;
    collabShare: string;
    collabAddr: string;
    collabPlaceholder: string;
    useDemoCollab: string;
    showCollabInAct: string;
    showCollabInActHint: string;
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
    notPaidTitle: string;
    notPaidDesc: string;
    goToPayBtn: string;
    collabInActNotice: string;
  };
  profile: {
    title: string;
    subtitle: string;
    authWallTitle: string;
    authWallDesc: string;
    authWallDemoCta: string;
    tabAnalytics: string;
    tabRequisites: string;
    tabCollaborators: string;
    companyOrName: string;
    companyPlaceholder: string;
    iinBinLabel: string;
    legalAddressLabel: string;
    ibanLabel: string;
    bicLabel: string;
    saveProfileBtn: string;
    savedAlert: string;
    statTotalInvoiced: string;
    statNetEarned: string;
    statCollabPaid: string;
    statTaxEstimate: string;
    statSuccessRate: string;
    addCollabBtn: string;
    addCollabTitle: string;
    collabNameLabel: string;
    collabNamePlaceholder: string;
    collabWalletLabel: string;
    collabWalletPlaceholder: string;
    collabPctLabel: string;
    collabNoteLabel: string;
    collabNotePlaceholder: string;
    noCollabsYet: string;
    myInvoicesTitle: string;
    noInvoices: string;
    cancelBtn: string;
    collabAddedAlert: string;
    useInInvoiceBtn: string;
  };
  onboarding: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    tourTab: string;
    taxTab: string;
    splitTab: string;
    blinksTab: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    gotItBtn: string;
    taxTitle: string;
    taxDesc1: string;
    taxDesc2: string;
    taxFormulaTitle: string;
    splitTitle: string;
    splitDesc1: string;
    splitDesc2: string;
    blinksTitle: string;
    blinksDesc1: string;
    blinksDesc2: string;
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
      delete: "Удалить",
      sol: "SOL",
      approx: "≈",
    },
    header: {
      createInvoice: "Создать инвойс",
      myProfile: "Личный кабинет",
      howItWorks: "Как это работает",
      demoNotice: "Тестовая сеть Solana Devnet · Виртуальные средства",
      switchToLive: "Включить боевой режим",
      switchToDemo: "Включить демо-режим",
      switchWalletText: "Переключить тест-кошелек:",
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
      feeTitle: "⚡ Steppe Protocol Fee (Комиссия сервиса)",
      feeDesc: "Фиксированная комиссия 1% удерживается смарт-контрактом только в момент успешной оплаты счета. Никаких скрытых платежей.",
      contractorProfileNotice: "Данные исполнителя для Акта:",
      editProfileLink: "Изменить в профиле",
      notAuthorizedNotice: "Вы не подключили кошелек. Укажите реквизиты исполнителя ниже, а после подключения сможете сохранить их в личный кабинет.",
      saveRequisitesPrompt: "Сохранить эти данные в профиль для будущих счетов?",
      saveRequisitesBtn: "Сохранить в профиль",
      collabSection: "🤝 Доля напарника (Коллаборатора)",
      collabCheckbox: "Разделить оплату с напарником (субподрядчиком)",
      selectSavedCollab: "Выбрать из сохраненных напарников:",
      selectSavedCollabPlaceholder: "-- Выберите из вашей базы напарников --",
      orEnterManual: "или указать вручную",
      collabShare: "Доля напарника",
      collabAddr: "Solana-кошелек напарника",
      collabPlaceholder: "Адрес кошелька получателя",
      useDemoCollab: "Вставить адрес Demo-напарника",
      showCollabInAct: "Указывать напарника в официальном Акте выполненных работ",
      showCollabInActHint: "Если галочка снята, напарник получит оплату на блокчейне, но в клиентском Акте будете фигурировать только вы как генеральный подрядчик (ИП).",
      previewTitle: "Живой предпросмотр инвойса",
      previewBlink: "Превью Blink в соцсетях",
      previewCheckout: "Превью чекаута",
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
      copyCheckout: "Ссылка на оплату (Чекаут)",
      copyBlink: "Ссылка Solana Blink (dial.to)",
      copyMessage: "Готовое сообщение для клиента",
      qrTitle: "Оплата по QR-коду",
      qrHint: "Клиент может отсканировать камерой мобильного кошелька (Phantom, Solflare)",
      waitingPayment: "Ожидание оплаты... Экран обновится автоматически в реальном времени.",
      paidDetected: "🎉 Оплата получена! Сплит успешно выполнен.",
      openAct: "Открыть Акт выполненных работ →",
      openCheckout: "Открыть чекаут",
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
      notPaidTitle: "Инвойс еще не оплачен",
      notPaidDesc: "Официальный Акт выполненных работ с QR-печатью формируется автоматически после зачисления оплаты на блокчейне.",
      goToPayBtn: "Перейти на страницу оплаты →",
      collabInActNotice: "Привлеченный специалист (Соисполнитель):",
    },
    profile: {
      title: "Личный кабинет исполнителя",
      subtitle: "Аналитика заработка, реквизиты ИП/ТОО для Актов и база напарников",
      authWallTitle: "Авторизация через кошелек Solana",
      authWallDesc: "Подключите ваш кошелек Solana (Phantom, Solflare или Demo), чтобы войти в профиль, просматривать финансовую аналитику, управлять реквизитами ИП и базой напарников.",
      authWallDemoCta: "⚡ Войти через Demo-кошелек исполнителя",
      tabAnalytics: "📊 Аналитика и история",
      tabRequisites: "🏢 Реквизиты ИП / ТОО",
      tabCollaborators: "👥 База напарников",
      companyOrName: "Название компании / ИП / ФИО исполнителя",
      companyPlaceholder: "Например: ИП Смагулов А.Б. или Nomad Studio",
      iinBinLabel: "ИИН / БИН (12 цифр)",
      legalAddressLabel: "Юридический адрес",
      ibanLabel: "Банковский счет IBAN (KZ...)",
      bicLabel: "БИК Банка",
      saveProfileBtn: "Сохранить реквизиты",
      savedAlert: "Реквизиты сохранены! Теперь они будут автоматически подставляться в новые инвойсы.",
      statTotalInvoiced: "Выставлено всего",
      statNetEarned: "Получено чистыми",
      statCollabPaid: "Выплачено напарникам",
      statTaxEstimate: "Налог 3% (ф. 910 РК)",
      statSuccessRate: "Оплачено счетов",
      addCollabBtn: "+ Добавить напарника",
      addCollabTitle: "Добавить напарника в базу",
      collabNameLabel: "Имя / Роль напарника",
      collabNamePlaceholder: "Например: Айбек (Senior Frontend) или Алина (UI/UX)",
      collabWalletLabel: "Solana-кошелек напарника",
      collabWalletPlaceholder: "Адрес кошелька (Base58)",
      collabPctLabel: "Доля по умолчанию (%)",
      collabNoteLabel: "Заметка / Компетенции (опционально)",
      collabNotePlaceholder: "Разработка смарт-контрактов, дизайн лендингов...",
      noCollabsYet: "В базе пока нет сохраненных напарников. Добавьте членов команды, чтобы выбирать их в 1 клик при создании инвойса.",
      myInvoicesTitle: "История выставленных счетов",
      noInvoices: "Вы пока не создали ни одного инвойса.",
      cancelBtn: "Отменить и вернуть ренту",
      collabAddedAlert: "Напарник успешно добавлен в вашу базу!",
      useInInvoiceBtn: "Использовать в инвойсе →",
    },
    onboarding: {
      welcomeTitle: "Как работает SteppeInvoice",
      welcomeSubtitle: "Платежи в Solana с автоматическим ончейн-сплитом и официальным Актом",
      tourTab: "🚀 Пошаговый процесс",
      taxTab: "🇰🇿 Налоги РК (3% СНР)",
      splitTab: "🤝 Ончейн-сплит",
      blinksTab: "⚡ Solana Blinks",
      step1Title: "1. Создайте счет",
      step1Desc: "Укажите сумму в SOL и выберите напарника из базы. Ваши реквизиты ИП автоматически попадут в Акт.",
      step2Title: "2. Отправьте ссылку заказчику",
      step2Desc: "Ссылка превращается в кнопку оплаты в Telegram, WhatsApp или интерактивный Blink в ленте Twitter (X).",
      step3Title: "3. Мгновенная ончейн-оплата",
      step3Desc: "Заказчик подтверждает перевод в Phantom или Solflare. Смарт-контракт делит деньги за 400 мс.",
      step4Title: "4. Скачайте официальный Акт",
      step4Desc: "Готовый документ по форме Р-1 с пересчетом в тенге и цифровой QR-печатью для бухгалтерии и налоговой.",
      gotItBtn: "Понятно, закрыть",
      taxTitle: "Как отчитываться перед налоговой в Казахстане?",
      taxDesc1: "Для ИП на специальном налоговом режиме (упрощенка) доход декларируется раз в полугодие по форме 910. Ставка налога составляет 3%.",
      taxDesc2: "В Акте выполненных работ SteppeInvoice автоматически фиксирует стоимость услуг в тенге по курсу на момент закрытия сделки, а QR-код ведет в Solscan, подтверждая юридический факт и дату расчета.",
      taxFormulaTitle: "Формула расчета: Оборот (₸) × 3% = Сумма налога к уплате.",
      splitTitle: "Как работает атомарный ончейн-сплит?",
      splitDesc1: "Средства клиента не хранятся на балансе нашего сайта: смарт-контракт SteppeInvoice в одной транзакции переводит долю исполнителя, долю напарника и 1% комиссии протокола.",
      splitDesc2: "Если транзакция не проходит полностью — откатывается вся операция. Напарник гарантированно получает средства без задержек и риска невыплаты.",
      blinksTitle: "Что такое Solana Actions & Blinks?",
      blinksDesc1: "Blinks (Blockchain Links) позволяют превратить любую веб-ссылку на инвойс в интерактивный виджет прямо внутри социальной сети X (Twitter) или Telegram.",
      blinksDesc2: "Клиенту не нужно переходить на сторонние сайты: кнопка 'Оплатить' с выбором суммы отображается прямо в посте.",
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
      delete: "Жою",
      sol: "SOL",
      approx: "≈",
    },
    header: {
      createInvoice: "Шот жасау",
      myProfile: "Жеке кабинет",
      howItWorks: "Қалай жұмыс істейді",
      demoNotice: "Solana Devnet сынақ желісі · Виртуалды қаражат",
      switchToLive: "Негізгі режимге өту",
      switchToDemo: "Демо-режимге өту",
      switchWalletText: "Сынақ әмиянын ауыстыру:",
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
      feeTitle: "⚡ Steppe Protocol Fee (Қызмет комиссиясы)",
      feeDesc: "1% тұрақты комиссия төлем сәтті өткен кезде ғана смарт-келісімшартпен ұсталады. Жасырын төлемдер жоқ.",
      contractorProfileNotice: "Акт үшін орындаушының деректері:",
      editProfileLink: "Профильде өзгерту",
      notAuthorizedNotice: "Әмиян қосылмаған. Орындаушы деректерін төменде енгізіңіз, кейін әмиянды қосып сақтай аласыз.",
      saveRequisitesPrompt: "Бұл деректерді алдағы шоттар үшін профильге сақтау керек пе?",
      saveRequisitesBtn: "Профильге сақтау",
      collabSection: "🤝 Серіктес (Коллаборатор) үлесі",
      collabCheckbox: "Төлемді серіктеспен (қосалқы орындаушымен) бөлісу",
      selectSavedCollab: "Сақталған серіктестерден таңдау:",
      selectSavedCollabPlaceholder: "-- Серіктестер базасынан таңдаңыз --",
      orEnterManual: "немесе қолмен енгізу",
      collabShare: "Серіктес үлесі",
      collabAddr: "Серіктестің Solana әмияны",
      collabPlaceholder: "Қабылдаушы әмиян мекенжайы",
      useDemoCollab: "Demo-серіктес мекенжайын қою",
      showCollabInAct: "Серіктесті ресми Орындалған жұмыстар актісінде көрсету",
      showCollabInActHint: "Егер белгі алынып тасталса, серіктес қаражатты блокчейнде алады, бірақ тапсырыс берушінің Актісінде тек сіз көрсетілесіз.",
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
      copyCheckout: "Төлем сілтемесі (Чекаут)",
      copyBlink: "Blink сілтемесі (dial.to)",
      copyMessage: "Клиентке арналған дайын хабарлама",
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
      notPaidTitle: "Шот әлі төленбеген",
      notPaidDesc: "QR-мөрі бар ресми Орындалған жұмыстар актісі блокчейнде төлем түскеннен кейін автоматты түрде жасалады.",
      goToPayBtn: "Төлем парақшасына өту →",
      collabInActNotice: "Қосалқы орындаушы (Серіктес):",
    },
    profile: {
      title: "Орындаушының жеке кабинеті",
      subtitle: "Табыс талдауы, Актіге арналған ЖК/ЖШС деректемелері және серіктестер базасы",
      authWallTitle: "Solana әмияны арқылы кіру",
      authWallDesc: "Жеке кабинетке кіру, табыс аналитикасын көру, ЖК деректемелерін және серіктестер тізімін басқару үшін Solana әмияныңызды (Phantom, Solflare немесе Demo) қосыңыз.",
      authWallDemoCta: "⚡ Демо-орындаушы әмиянымен кіру",
      tabAnalytics: "📊 Талдау және тарих",
      tabRequisites: "🏢 ЖК / ЖШС деректемелері",
      tabCollaborators: "👥 Серіктестер базасы",
      companyOrName: "Компания атауы / ЖК / Орындаушының аты-жөні",
      companyPlaceholder: "Мысалы: ЖК Смағұлов А.Б. немесе Nomad Studio",
      iinBinLabel: "ЖСН / БСН (12 сан)",
      legalAddressLabel: "Заңды мекенжайы",
      ibanLabel: "Банк шоты IBAN (KZ...)",
      bicLabel: "Банктің БИК коды",
      saveProfileBtn: "Деректемелерді сақтау",
      savedAlert: "Деректемелер сақталды! Енді олар барлық жаңа шоттарға автоматты түрде қойылады.",
      statTotalInvoiced: "Барлық шығарылған",
      statNetEarned: "Таза түскен табыс",
      statCollabPaid: "Серіктестерге төленген",
      statTaxEstimate: "3% Салық (ҚР 910-нысан)",
      statSuccessRate: "Төленген шоттар",
      addCollabBtn: "+ Серіктес қосу",
      addCollabTitle: "Серіктестер базасына қосу",
      collabNameLabel: "Серіктестің аты / Рөлі",
      collabNamePlaceholder: "Мысалы: Айбек (Senior Frontend) немесе Алина (UI/UX)",
      collabWalletLabel: "Серіктестің Solana әмияны",
      collabWalletPlaceholder: "Әмиян мекенжайы (Base58)",
      collabPctLabel: "Әдепкі үлесі (%)",
      collabNoteLabel: "Ескертпе / Бағыты (міндетті емес)",
      collabNotePlaceholder: "Смарт-келісімшарттар жасау, лендинг дизайны...",
      noCollabsYet: "Базада әзірге сақталған серіктестер жоқ. Шот жасағанда 1 рет басу арқылы таңдау үшін команда мүшелерін қосыңыз.",
      myInvoicesTitle: "Шығарылған шоттар тарихы",
      noInvoices: "Сіз әлі бірде-бір шот жасаған жоқсыз.",
      cancelBtn: "Бас тарту және рентаны қайтару",
      collabAddedAlert: "Серіктес базаға сәтті қосылды!",
      useInInvoiceBtn: "Инвойста қолдану →",
    },
    onboarding: {
      welcomeTitle: "SteppeInvoice қалай жұмыс істейді",
      welcomeSubtitle: "Solana-да автоматты ончейн-бөлу және ресми Актісі бар төлемдер",
      tourTab: "🚀 Қадамдық процесс",
      taxTab: "🇰🇿 ҚР Салықтары (3% СНР)",
      splitTab: "🤝 Ончейн-бөлу",
      blinksTab: "⚡ Solana Blinks",
      step1Title: "1. Шот жасаңыз",
      step1Desc: "SOL сомасын көрсетіңіз және серіктесті базадан таңдаңыз. ЖК деректері бірден Актіге жазылады.",
      step2Title: "2. Сілтемені тапсырыс берушіге жіберіңіз",
      step2Desc: "Сілтеме Telegram, WhatsApp-та немесе X (Twitter) арнасында интерактивті Blink түймесіне айналады.",
      step3Title: "3. Лезде ончейн төлем",
      step3Desc: "Клиент Phantom немесе Solflare арқылы растайды. Смарт-келісімшарт қаражатты 400 мс ішінде бөледі.",
      step4Title: "4. Ресми Актіні жүктеңіз",
      step4Desc: "Бухгалтерия мен салыққа арналған теңгеге шаққандағы және QR-мөрі бар Р-1 нысанындағы дайын құжат.",
      gotItBtn: "Түсінікті, жабу",
      taxTitle: "Қазақстанда салық органдарына қалай есеп беруге болады?",
      taxDesc1: "Арнаулы салық режиміндегі (оңайлатылған декларация) ЖК үшін табыс жарты жылда бір рет 910-нысан бойынша тапсырылады. Салық мөлшерлемесі — 3%.",
      taxDesc2: "SteppeInvoice Орындалған жұмыстар актісінде төлем күніндегі ресми бағам бойынша теңгелік соманы автоматты түрде бекітеді, ал QR-код Solscan-ға сілтеп, есеп айырысу күнін дәлелдейді.",
      taxFormulaTitle: "Есептеу формуласы: Айналым (₸) × 3% = Төленетін салық сомасы.",
      splitTitle: "Атомарлы ончейн-бөлу қалай жұмыс істейді?",
      splitDesc1: "Тапсырыс берушінің қаражаты сайт балансында сақталмайды: SteppeInvoice смарт-келісімшарты бір транзакцияда орындаушыға, серіктеске және 1% хаттама комиссиясына аударады.",
      splitDesc2: "Егер қандай да бір бөлік өтпей қалса — бүкіл транзакция тоқтатылады. Серіктес өз үлесін кідіріссіз және тәуекелсіз алады.",
      blinksTitle: "Solana Actions & Blinks дегеніміз не?",
      blinksDesc1: "Blinks (Blockchain Links) кез келген инвойс сілтемесін X (Twitter) немесе Telegram ішінде интерактивті виджетке айналдырады.",
      blinksDesc2: "Тапсырыс берушіге бөтен сайтқа өтудің қажеті жоқ: төлем түймесі тікелей жазбаның ішінде көрінеді.",
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
      delete: "Delete",
      sol: "SOL",
      approx: "≈",
    },
    header: {
      createInvoice: "Create Invoice",
      myProfile: "Dashboard",
      howItWorks: "How it works",
      demoNotice: "Solana Devnet Test Network · Virtual Test SOL",
      switchToLive: "Switch to Live Mode",
      switchToDemo: "Switch to Demo Mode",
      switchWalletText: "Switch test wallet:",
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
      feeTitle: "⚡ Steppe Protocol Fee",
      feeDesc: "Fixed 1% protocol fee settled atomically by the smart contract only upon successful payment. Zero hidden charges.",
      contractorProfileNotice: "Contractor info for the legal Act:",
      editProfileLink: "Edit in profile",
      notAuthorizedNotice: "Wallet not connected. Enter contractor details below; you can save them to your profile once connected.",
      saveRequisitesPrompt: "Save these details to your profile for future invoices?",
      saveRequisitesBtn: "Save to Profile",
      collabSection: "🤝 Collaborator Split",
      collabCheckbox: "Split payment with a collaborator (team member / dev)",
      selectSavedCollab: "Select from saved collaborators:",
      selectSavedCollabPlaceholder: "-- Choose from your collaborators directory --",
      orEnterManual: "or enter manually",
      collabShare: "Collaborator share",
      collabAddr: "Collaborator Solana wallet address",
      collabPlaceholder: "Recipient Solana public key",
      useDemoCollab: "Insert Demo Collaborator address",
      showCollabInAct: "Include collaborator in the official Act of Completed Works",
      showCollabInActHint: "If unchecked, the collaborator receives their share on-chain, but the client-facing legal Act will only list you as the primary contractor.",
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
      notPaidTitle: "Invoice Not Paid Yet",
      notPaidDesc: "The official Certificate of Completion with QR seal will be generated automatically once payment is confirmed on-chain.",
      goToPayBtn: "Go to Payment Page →",
      collabInActNotice: "Subcontractor / Collaborator:",
    },
    profile: {
      title: "Contractor Dashboard",
      subtitle: "Earnings analytics, legal requisites for Acts, and team collaborator directory",
      authWallTitle: "Sign in with Solana Wallet",
      authWallDesc: "Connect your Solana wallet (Phantom, Solflare or Demo) to access your dashboard, view earnings analytics, and manage company requisites and saved team members.",
      authWallDemoCta: "⚡ Sign in with Demo Freelancer Wallet",
      tabAnalytics: "📊 Analytics & History",
      tabRequisites: "🏢 Company Requisites",
      tabCollaborators: "👥 Collaborators Directory",
      companyOrName: "Company / Sole Proprietorship / Full Name",
      companyPlaceholder: "e.g.: Nomad Tech Studio or Smagulov A.B.",
      iinBinLabel: "Tax ID / IIN / BIN (12 digits)",
      legalAddressLabel: "Legal Registered Address",
      ibanLabel: "Bank Account IBAN (KZ...)",
      bicLabel: "Bank BIC / SWIFT",
      saveProfileBtn: "Save Requisites",
      savedAlert: "Requisites saved! These details will automatically appear on new invoices and Acts.",
      statTotalInvoiced: "Total Invoiced",
      statNetEarned: "Net Revenue",
      statCollabPaid: "Paid to Team",
      statTaxEstimate: "3% Tax (KZ Form 910)",
      statSuccessRate: "Paid Invoices",
      addCollabBtn: "+ Add Collaborator",
      addCollabTitle: "Add Collaborator to Directory",
      collabNameLabel: "Collaborator Name / Role",
      collabNamePlaceholder: "e.g.: Aibek (Senior Frontend) or Alina (UI/UX)",
      collabWalletLabel: "Collaborator Solana Wallet",
      collabWalletPlaceholder: "Solana wallet public key (Base58)",
      collabPctLabel: "Default Share (%)",
      collabNoteLabel: "Notes / Competencies (optional)",
      collabNotePlaceholder: "Smart contract development, landing page design...",
      noCollabsYet: "No saved collaborators yet. Add your teammates to select them in 1 click during invoice creation.",
      myInvoicesTitle: "Invoice History",
      noInvoices: "You have not created any invoices yet.",
      cancelBtn: "Cancel and reclaim rent",
      collabAddedAlert: "Collaborator added successfully to your directory!",
      useInInvoiceBtn: "Use in Invoice →",
    },
    onboarding: {
      welcomeTitle: "How SteppeInvoice Works",
      welcomeSubtitle: "Solana payments with instant atomic split and official accounting paperwork",
      tourTab: "🚀 Step-by-Step Flow",
      taxTab: "🇰🇿 KZ Taxes (3% Simplified)",
      splitTab: "🤝 On-Chain Split",
      blinksTab: "⚡ Solana Blinks",
      step1Title: "1. Create an invoice",
      step1Desc: "Specify amount in SOL and select a collaborator. Your company requisites prefill the Act automatically.",
      step2Title: "2. Share link anywhere",
      step2Desc: "The link turns into a 1-click pay button in Telegram, WhatsApp, or interactive Blink in X (Twitter).",
      step3Title: "3. Instant on-chain payment",
      step3Desc: "Client approves in Phantom or Solflare. The smart contract splits funds in 400ms.",
      step4Title: "4. Download official Act",
      step4Desc: "Printable Form R-1 Certificate of Completion with fiat rate and cryptographic QR seal for tax reporting.",
      gotItBtn: "Got it, close",
      taxTitle: "How to declare income in Kazakhstan?",
      taxDesc1: "For Sole Proprietorships (ИП) under the simplified tax regime, income is reported semi-annually on Form 910 with a flat 3% tax rate.",
      taxDesc2: "SteppeInvoice records the KZT equivalent in the Act of Completed Works based on the rate at transaction time. The QR code links directly to Solscan, verifying cryptographic proof of payment.",
      taxFormulaTitle: "Calculation Formula: Turnover (₸) × 3% = Payable Tax.",
      splitTitle: "How does the atomic on-chain split work?",
      splitDesc1: "Funds never sit on our servers: the SteppeInvoice smart contract splits creator share, collaborator share, and 1% protocol fee in one block.",
      splitDesc2: "If any part fails, the entire transaction is reverted. Your teammates get paid instantly with zero custody risk.",
      blinksTitle: "What are Solana Actions & Blinks?",
      blinksDesc1: "Blinks (Blockchain Links) render actionable payment buttons directly inside X (Twitter) or Telegram feeds without redirecting to external websites.",
      blinksDesc2: "Clients can execute the payment transaction right from their social media feed in one click.",
    },
  },
};
