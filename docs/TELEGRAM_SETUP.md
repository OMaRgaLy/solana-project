# Telegram-бот и вход: как это устроено

## Локально — одна команда
```
cd app
npm run dev
```
Скрипт `app/scripts/dev.mjs` сам: поднимает туннель ngrok, регистрирует вебхук бота на его адрес и запускает сайт. Адрес сайта выводится в консоль (`[dev] Open the site: ...`). Сайт и бот работают в одном процессе, поэтому вход, привязка кошелька и уведомления связаны. Состояние хранится в `app/.data/` и переживает перезапуски.

`npm run dev:plain` — только сайт, без бота.

## Переменные (`app/.env`, в git не попадает)
| Переменная | Что это |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен от @BotFather. Секрет. |
| `TELEGRAM_WEBHOOK_SECRET` | Случайная строка: Telegram присылает её с каждым сообщением, чужие запросы отсекаются. |
| `NEXT_PUBLIC_TELEGRAM_BOT` | Имя бота без `@`. |
| `SESSION_SECRET` | Подпись cookie входа. |
| `CRON_SECRET` | Защита `/api/telegram/poll`. |
| `NGROK_DOMAIN` | Необязательно: свой статический домен ngrok. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Нужны только на Vercel (см. ниже). |

Секреты и имя бота заполняет `node scripts/setup-env.mjs`, если пусты.

## Vercel (https://steppe-invoice-delta.vercel.app)
На Vercel сервер «засыпает» и теряет память между запросами, а на диск писать нельзя, поэтому нужна внешняя база. Для этого подходит Upstash Redis (бесплатный тариф): Vercel → Storage → Upstash Redis → Connect to Project. Переменные подставятся сами.

Затем в Settings → Environment Variables добавить `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `NEXT_PUBLIC_TELEGRAM_BOT`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL=https://steppe-invoice-delta.vercel.app` → Redeploy.

**У бота один вебхук.** Пока работает `npm run dev`, вебхук указывает на ngrok, и Vercel сообщений не получает. Для боевого сайта заведите второго бота у @BotFather и пропишите его токен в Vercel; либо перед показом на Vercel вручную вызовите:
`https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://steppe-invoice-delta.vercel.app/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>`
