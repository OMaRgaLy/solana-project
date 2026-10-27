import type { Language } from "./translations";

// "How to pay" for a client who has never used crypto. Written to promise only what is true everywhere:
// Phantom's Buy button relies on third-party providers whose availability depends on the country and card,
// and the app shows the price before confirming, so the guide tells people to check it instead of assuming.
export type Guide = {
  title: string;
  lead: string;
  steps: { title: string; body: string; bullets?: string[] }[];
  noteTitle: string;
  notes: string[];
  backToPay: string;
  payLink: string;
  officialSite: string;
  quick: { title: string; steps: string[]; install: string; fullGuide: string; cardNote: string };
};

export const guide: Record<Language, Guide> = {
  ru: {
    title: "Как оплатить счёт, если у вас ещё нет крипты",
    lead: "Это займёт 10–15 минут один раз. Потом любой счёт оплачивается в один клик, за секунды, из любой страны.",
    steps: [
      {
        title: "Установите кошелёк Phantom",
        body: "Приложение для телефона или расширение для браузера. Скачивайте только с официального сайта.",
      },
      {
        title: "Создайте кошелёк и сохраните фразу",
        body: "Phantom покажет секретную фразу из 12 слов. Запишите её на бумаге и храните дома. Она восстанавливает доступ к деньгам. Никому её не сообщайте: ни исполнителю, ни службе поддержки, ни нам.",
      },
      {
        title: "Пополните кошелёк в SOL",
        body: "Нужна сумма из счёта плюс совсем немного на комиссию сети (доли цента). Способы на выбор:",
        bullets: [
          "Кнопка «Купить» внутри Phantom: оплата картой, Apple Pay или Google Pay через партнёров Phantom. Доступность, способы и комиссию для вашей страны и карты Phantom показывает до подтверждения, проверьте там.",
          "Купите SOL на лицензированной бирже в вашей стране и выведите на адрес вашего Phantom, сеть Solana. В Казахстане используйте биржи с лицензией МФЦА.",
          "P2P-покупка только через эскроу биржи. Переводы незнакомым людям напрямую — риск мошенничества.",
        ],
      },
      {
        title: "Откройте ссылку на оплату и нажмите «Оплатить»",
        body: "Подключите Phantom, проверьте сумму и подтвердите. Деньги придут исполнителю сразу, а чек можно открыть в обозревателе Solscan.",
      },
    ],
    noteTitle: "Важно знать",
    notes: [
      "Курс SOL меняется: сумма в SOL в счёте фиксирована, а эквивалент в долларах и тенге ориентировочный.",
      "Правила обращения с криптовалютой зависят от страны. В Казахстане криптовалюта не является платёжным средством, а покупка и владение разрешены через лицензированные площадки. Проверьте требования для себя.",
      "Мы не храним ваши деньги и не видим вашу секретную фразу.",
    ],
    backToPay: "Вернуться к оплате",
    payLink: "Нет кошелька? Как оплатить",
    officialSite: "Официальный сайт Phantom",
    quick: { title: "Нет кошелька? Это займёт 5 минут", steps: ["Установите Phantom (телефон или браузер)","Создайте кошелёк, фразу из 12 слов запишите на бумагу и никому не показывайте","Нажмите «Купить» в Phantom и пополните SOL картой, затем вернитесь сюда и нажмите «Оплатить»"], install: "Установить Phantom", fullGuide: "Подробная инструкция", cardNote: "Способы и комиссию для вашей страны и карты Phantom покажет до подтверждения." },
  },
  kk: {
    title: "Криптоңыз әлі жоқ болса, шотты қалай төлеуге болады",
    lead: "Бұл бір рет қана 10–15 минут алады. Содан кейін кез келген шот 1 кликпен, секундтарда, кез келген елден төленеді.",
    steps: [
      {
        title: "Phantom әмиянын орнатыңыз",
        body: "Телефонға қосымша немесе браузерге кеңейтім. Тек ресми сайттан жүктеңіз.",
      },
      {
        title: "Әмиян жасап, құпия сөз тіркесін сақтаңыз",
        body: "Phantom 12 сөзден тұратын құпия тіркесті көрсетеді. Оны қағазға жазып, үйде сақтаңыз. Ол ақшаға қолжетімділікті қалпына келтіреді. Оны ешкімге айтпаңыз: орындаушыға да, қолдау қызметіне де, бізге де.",
      },
      {
        title: "Әмиянды SOL-мен толтырыңыз",
        body: "Шоттағы сома мен желі комиссиясына аздап қосымша қажет (центтің үлестері). Таңдауға болады:",
        bullets: [
          "Phantom ішіндегі «Сатып алу» түймесі: Phantom серіктестері арқылы карта, Apple Pay немесе Google Pay-мен төлеу. Еліңіз бен картаңыз үшін қолжетімділікті, тәсілдер мен комиссияны Phantom растауға дейін көрсетеді, сол жерден тексеріңіз.",
          "Еліңіздегі лицензиялы биржада SOL сатып алып, Phantom мекенжайына шығарыңыз, Solana желісі. Қазақстанда ХҚО (AIFC) лицензиясы бар биржаларды пайдаланыңыз.",
          "P2P сатып алу тек биржа эскроуы арқылы. Танымайтын адамдарға тікелей аудару — алаяқтық қаупі.",
        ],
      },
      {
        title: "Төлем сілтемесін ашып, «Төлеу» басыңыз",
        body: "Phantom қосыңыз, соманы тексеріп, растаңыз. Ақша орындаушыға бірден түседі, түбіртекті Solscan шолғышында ашуға болады.",
      },
    ],
    noteTitle: "Білу маңызды",
    notes: [
      "SOL бағамы өзгереді: шоттағы SOL сомасы тіркелген, ал доллар мен теңгедегі баламасы шамамен.",
      "Криптовалютамен жұмыс ережелері елге байланысты. Қазақстанда криптовалюта төлем құралы емес, ал сатып алу мен иелену лицензиялы алаңдар арқылы рұқсат етілген. Талаптарды өзіңіз тексеріңіз.",
      "Біз ақшаңызды сақтамаймыз және құпия тіркесіңізді көрмейміз.",
    ],
    backToPay: "Төлемге оралу",
    payLink: "Әмиян жоқ па? Қалай төлеуге болады",
    officialSite: "Phantom ресми сайты",
    quick: { title: "Әмиян жоқ па? Бұл 5 минут алады", steps: ["Phantom орнатыңыз (телефон немесе браузер)","Әмиян жасап, 12 сөзден тұратын тіркесті қағазға жазыңыз, ешкімге көрсетпеңіз","Phantom ішінде «Сатып алу» түймесін басып, SOL-ды картамен толтырыңыз, содан кейін осында оралып «Төлеу» басыңыз"], install: "Phantom орнату", fullGuide: "Толық нұсқаулық", cardNote: "Еліңіз бен картаңыз үшін тәсілдер мен комиссияны Phantom растауға дейін көрсетеді." },
  },
  en: {
    title: "How to pay an invoice if you have no crypto yet",
    lead: "This takes 10–15 minutes once. After that, any invoice is paid in one click, in seconds, from any country.",
    steps: [
      {
        title: "Install the Phantom wallet",
        body: "A phone app or a browser extension. Download it only from the official site.",
      },
      {
        title: "Create a wallet and save the phrase",
        body: "Phantom shows a 12-word secret recovery phrase. Write it on paper and keep it at home. It restores access to your money. Never share it with anyone: not the freelancer, not support, not us.",
      },
      {
        title: "Add SOL to the wallet",
        body: "You need the invoice amount plus a tiny bit for the network fee (fractions of a cent). Pick one way:",
        bullets: [
          "The Buy button inside Phantom: pay by card, Apple Pay or Google Pay through Phantom's partners. Availability, methods and fees for your country and card are shown before you confirm, so check it there.",
          "Buy SOL on an exchange licensed in your country and withdraw it to your Phantom address on the Solana network. In Kazakhstan, use exchanges licensed by the AIFC.",
          "P2P only through the exchange's escrow. Sending money directly to strangers is a fraud risk.",
        ],
      },
      {
        title: "Open the payment link and press Pay",
        body: "Connect Phantom, check the amount and confirm. The freelancer receives the money right away, and you can open the receipt on the Solscan explorer.",
      },
    ],
    noteTitle: "Good to know",
    notes: [
      "The SOL price moves: the invoice amount in SOL is fixed, while the dollar and tenge equivalents are approximate.",
      "Rules for crypto depend on the country. In Kazakhstan crypto is not a means of payment, while buying and holding it is allowed through licensed platforms. Check the requirements for yourself.",
      "We never hold your money and never see your recovery phrase.",
    ],
    backToPay: "Back to payment",
    payLink: "No wallet yet? How to pay",
    officialSite: "Official Phantom site",
    quick: { title: "No wallet yet? It takes 5 minutes", steps: ["Install Phantom (phone or browser)","Create a wallet, write the 12-word phrase on paper and show it to no one","Tap Buy in Phantom and add SOL with your card, then come back here and press Pay"], install: "Install Phantom", fullGuide: "Full guide", cardNote: "Phantom shows the methods and fees for your country and card before you confirm." },
  },
};
