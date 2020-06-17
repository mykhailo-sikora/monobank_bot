require('dotenv').config();

const Telegraph = require("telegraf");
const axios = require("axios");
const{code} = require("currency-codes");

const {tokenForBot: {TOKEN}, regex: {RegExp}} = require('./config');
const bot = new Telegraph(TOKEN);

bot.start(context => context.reply("Welcome to telegram monobank bot"));

bot.hears(/^[A-Z]+$/i, async (ctx) => {
    const clientCurCode = ctx.message.text;
    const currency = code(clientCurCode);

    if (!currency) return ctx.reply('Currency didn`t found');

    try {
        const result = await axios.get("https://api.monobank.ua/bank/currency");
        const foundCurrency = result.data.find((cur) => cur.currencyCodeA === +currency.number);
        if (!foundCurrency || !foundCurrency.rateBuy || !foundCurrency.rateSell) {
            return ctx.reply('Currency didn`t found in Monobank API');
        }
        return ctx.replyWithMarkdown(`◙
        CURRENCY: *${currency.code}*
        RATE Buy: *${foundCurrency.rateBuy}*
        RATE SELL: *${foundCurrency.rateSell}*
  
        `);
    } catch (err) {
        return ctx.reply(err);
    }
});


bot.startPolling();
