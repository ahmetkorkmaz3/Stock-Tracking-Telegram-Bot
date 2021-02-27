const { Telegraf } = require("telegraf");
require("dotenv").config();
const { getStockPrice } = require("./lib/stockRequest");
const { commandArgs } = require("./lib/commandArgs");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(commandArgs())

/*
bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name}, you can list your stock list`);
});

 */
bot.command('price', ctx => {
    console.log(ctx.state.command);
})
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
