require('dotenv').config()

const db = require('./src/lib/db')
const bot = require('./src/bot')

db.connect()

bot.start()
bot.help()
bot.stock()
bot.gold()
bot.dolar()
bot.euro()
bot.notificationList()
bot.launch()

bot.stop()
