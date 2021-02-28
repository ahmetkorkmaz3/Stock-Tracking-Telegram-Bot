const { Telegraf } = require('telegraf');
require('dotenv').config();
const { getStockPrice, getDovizPrice } = require('./lib/requests');
const commandArgs = require('./lib/commandArgs');
const schedule = require('node-schedule');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(commandArgs());

schedule.scheduleJob('*/1 * * * *', async function () {
  const data = await getStockPrice('BRYAT');
  bot.telegram.sendMessage(
    630053545,
    `BRYAT: ${data.data.hisseYuzeysel.alis} ₺`
  );
});

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

bot.help((ctx) => {
  ctx.reply(
    `
    Merhaba ${ctx.from.first_name}, aşağıdaki komutları kullanarak bilgi edinebilirsin.
    /hisse SYMBOL_ADI => bu komutu kullanarak hisse senedinin anlık değerini öğrenebilirsin.
    /doviz komutunu kullanarak altın, dolar, euro fiyatlarını öğrenebilirsin.
    `
  );
});

bot.command('hisse', async (ctx) => {
  try {
    const data = await getStockPrice(ctx.state.command.arg.toUpperCase());

    ctx.reply(
      `${ctx.state.command.arg.toUpperCase()} Hissesi:
      Alış Fiyatı: ${data.data.hisseYuzeysel.alis} ₺
      Satış Fiyatı: ${data.data.hisseYuzeysel.satis} ₺
      Tavan Fiyat: ${data.data.hisseYuzeysel.tavan} ₺
      Taban Fiyat: ${data.data.hisseYuzeysel.taban} ₺
      `
    );
  } catch (error) {
    ctx.reply(error.error);
  }
});

bot.command('doviz', async (ctx) => {
  try {
    const data = await getDovizPrice();

    const gold = data.data.filter((item) => {
      return item.SEMBOLID == 2199;
    });

    const euro = data.data.filter((item) => {
      return item.SEMBOLID == 1639;
    });

    const dolar = data.data.filter((item) => {
      return item.SEMBOLID == 1302;
    });

    ctx.reply(
      `Altın Kuru:
      Alış Fiyatı: ${gold[0].ALIS} ₺
      Satış Fiyatı: ${gold[0].SATIS} ₺
      `
    );

    ctx.reply(
      `Euro Kuru:
      Alış Fiyatı: ${euro[0].ALIS} ₺
      Satış Fiyatı: ${euro[0].SATIS} ₺
      `
    );

    ctx.reply(
      `Dolar Kuru:
      Alış Fiyatı: ${dolar[0].ALIS} ₺
      Satış Fiyatı: ${dolar[0].SATIS} ₺
      `
    );
  } catch (err) {
    console.log(err);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
