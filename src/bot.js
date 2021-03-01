const { Telegraf } = require('telegraf')
require('dotenv').config()

// schemas
const UserModel = require('./model/User')
const StockModel = require('./model/Stock')

// http requests
const { getStockPrice, getDovizPrice } = require('./lib/requests')

const commandArgs = require('./lib/commandArgs')

// mongo collection services
const { findUserByChatId } = require('./services/userService')
const { createStock } = require('./services/stockService')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(commandArgs())

const start = () => {
  bot.start(async (ctx) => {
    const isUserHave = await findUserByChatId(ctx.message.chat.id)
    if (!isUserHave) {
      const user = await UserModel.create({
        name: ctx.from.first_name,
        chat_id: ctx.message.chat.id,
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
}

const help = () => {
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
}

const stock = () => {
  bot.command('hisse', async (ctx) => {
    try {
      const data = await getStockPrice(ctx.state.command.arg[0].toUpperCase())

      ctx.reply(
        `${ctx.state.command.arg[0].toUpperCase()} Hissesi:
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
}

const gold = () => {
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
}

const dolar = () => {
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
}

const euro = () => {
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
}

const notificationList = () => {
  bot.command('liste', async (ctx) => {
    const args = ctx.state.command.arg
    const notification_times = []

    for (let index = 1; index < args.length; index += 2) {
      const object = {
        hour: args[index],
        minutes: args[index + 1],
      }
      notification_times.push(object)
    }

    const stock = await createStock({
      name: ctx.state.command.arg[0].toUpperCase(),
      notification_times: notification_times,
      chat_id: ctx.message.chat.id,
    })
  })
}

const launch = () => {
  bot.launch()
}

const stop = () => {
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

module.exports = {
  start,
  help,
  launch,
  stock,
  gold,
  dolar,
  euro,
  notificationList,
  stop,
}
