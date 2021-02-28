const { Telegraf } = require('telegraf')
require('dotenv').config()
const { getStockPrice, getDovizPrice } = require('./lib/requests')
const commandArgs = require('./lib/commandArgs')
const schedule = require('node-schedule')
const db = require('./lib/db')

const UserModel = require('./model/User')
const StockModel = require('./model/Stock')

const { findUserByChatId } = require('./services/userService')

const bot = new Telegraf(process.env.BOT_TOKEN)
db.connect()

bot.use(commandArgs())

// schedule.scheduleJob('*/1 * * * *', async function () {
//   const data = await getStockPrice('BRYAT');
//   bot.telegram.sendMessage(
//     630053545,
//     `BRYAT: ${data.data.hisseYuzeysel.alis} ₺`
//   );
// });

bot.command('test', async (ctx) => {
  const stock_list = await StockModel.create({
    name: 'BRYAT',
    notification_times: [
      {
        hour: 5,
        minutes: 5
      },
      {
        hour: 4,
        minutes: 4
      }
    ]
  })

  const user = await UserModel.create({
    name: ctx.from.first_name,
    chat_id: ctx.message.chat.id,
    stock_list: stock_list._id
  })

  ctx.reply(user)
})

bot.start(async (ctx) => {

  if (!findUserByChatId(ctx.message.chat.id)) {
    const user = await UserModel.create({
      name: ctx.from.first_name,
      chat_id: ctx.message.chat.id
    })
  }

  ctx.reply(
    `
    Selam ${ctx.from.first_name}, bu botu kullanarak hisse senedi fiyatının anlık değerini takip edebilirsiniz.
    /help komutu ile nasıl çalıştığını öğrenebilirsiniz.

    Geliştirici: Murat Ahmet KORKMAZ
    Katkı sağlamak için: https://github.com/ahmetkorkmaz3
    `
  )
})

bot.help((ctx) => {
  ctx.reply(
    `
    Merhaba ${ctx.from.first_name}, aşağıdaki komutları kullanarak bilgi edinebilirsin.
    /hisse SYMBOL_ADI => bu komutu kullanarak hisse senedinin anlık değerini öğrenebilirsin.
    /altin komutunu kullanarak altın fiyatlarını öğrenebilirsin.
    /dolar komutunu kullanarak dolar fiyatlarını öğrenebilirsin.
    /euro komutunu kullanarak euro fiyatlarını öğrenebilirsin.
    `
  )
})

bot.command('hisse', async (ctx) => {
  try {
    const data = await getStockPrice(ctx.state.command.arg.toUpperCase())

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

bot.command('altin', async (ctx) => {
  try {
    const data = await getDovizPrice()

    const gold = data.data.filter((item) => {
      return item.SEMBOLID == 2199
    })

    ctx.reply(
      `Altın Kuru:
      Alış Fiyatı: ${gold[0].ALIS} ₺
      Satış Fiyatı: ${gold[0].SATIS} ₺
      `
    )
  } catch (error) {
    console.log(err)
  }
})

bot.command('dolar', async (ctx) => {
  try {
    const data = await getDovizPrice()

    const dolar = data.data.filter((item) => {
      return item.SEMBOLID == 1302
    })

    ctx.reply(
      `Dolar Kuru:
      Alış Fiyatı: ${dolar[0].ALIS} ₺
      Satış Fiyatı: ${dolar[0].SATIS} ₺
      `
    )
  } catch (error) {
    console.log(err)
  }
})

bot.command('euro', async (ctx) => {
  try {
    const data = await getDovizPrice()

    const euro = data.data.filter((item) => {
      return item.SEMBOLID == 1639
    })

    ctx.reply(
      `Euro Kuru:
      Alış Fiyatı: ${euro[0].ALIS} ₺
      Satış Fiyatı: ${euro[0].SATIS} ₺
      `
    )
  } catch (err) {
    console.log(err)
  }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
