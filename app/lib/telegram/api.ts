const token = () => process.env.TELEGRAM_BOT_TOKEN;

export const botUsername = () => process.env.NEXT_PUBLIC_TELEGRAM_BOT || "";
export const botEnabled = () => Boolean(token());

export type Button = { text: string; url?: string; callback_data?: string };

export async function sendMessage(chatId: number | string, text: string, buttons: Button[][] = []) {
  if (!token()) return;
  await fetch(`https://api.telegram.org/bot${token()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(buttons.length ? { reply_markup: { inline_keyboard: buttons } } : {}),
    }),
  }).catch(() => {});
}

export async function answerCallback(id: string, text = "") {
  if (!token()) return;
  await fetch(`https://api.telegram.org/bot${token()}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: id, text }),
  }).catch(() => {});
}

/** Registers the command menu; `language` omitted = default menu for everyone without a localized one. */
export async function setMyCommands(commands: { command: string; description: string }[], language?: string) {
  if (!token()) return;
  await fetch(`https://api.telegram.org/bot${token()}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commands, ...(language ? { language_code: language } : {}) }),
  }).catch(() => {});
}

export const esc =(s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
