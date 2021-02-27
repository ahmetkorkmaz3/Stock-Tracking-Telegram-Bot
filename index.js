const { Telegraf } = require("telegraf");
require("dotenv").config();
const { getStockPrice } = require("./lib/stockRequest");
const commandArgs = require("./lib/commandArgs");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(commandArgs())

bot.start((ctx) => {
  ctx.reply(
    `
    Selam ${ctx.from.first_name}, bu botu kullanarak hisse senedi fiyatının anlık değerini takip edebilirsiniz.
    /help komutu ile nasıl çalıştığını öğrenebilirsiniz.

    Geliştirici: Murat Ahmet KORKMAZ
    Katkı sağlamak için: https://github.com/ahmetkorkmaz3
    `
    );
});

bot.command('stock', async ctx => {
  try {
    const data = await getStockPrice(ctx.state.command.arg.toUpperCase());

    ctx.reply(
      `${ctx.state.command.arg.toUpperCase()} Hissesi:
      Alış Fiyatı: ${data.data.hisseYuzeysel.alis} ₺
      Satış Fiyatı: ${data.data.hisseYuzeysel.satis} ₺
      Tavan Fiyat: ${data.data.hisseYuzeysel.tavan} ₺
      Taban Fiyat: ${data.data.hisseYuzeysel.taban} ₺
      `
    )

  } catch (error) {
    ctx.reply(error.error)
  }
})


bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
