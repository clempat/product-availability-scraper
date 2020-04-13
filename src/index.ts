import env from "dotenv";
import Telegraf from "telegraf";
import { Telegram } from "telegraf";
import { detectVendor } from "./lib/detectVendor";
import getUrl from "get-urls";
import {
  BRINGMEISTER,
  getProductFromUrl as getBringmeisterProductFromUrl,
} from "./lib/bringmeister";
import DB from "./lib/db";
import { CronJob } from "cron";
import { getAvailableProducts } from "./lib/scrapper";

env.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);

const job = new CronJob("*/2 * * * *", async () => {
  console.log(`⏲️ RUNNING THE CRON`);
  const products = await getAvailableProducts();

  const db = DB();

  products.forEach((product) => {
    if (!product.clientId) return;
    telegram
      .sendMessage(
        product.clientId,
        `"🟢 ${product.name}" is now available ! Go Get It ! \n\n ${product.url}`
      )
      .catch((e) => console.log(e));
  });

  db.deleteProducts(products);
});

bot.start((ctx) => ctx.reply("Welcome !!!"));
bot.help((ctx) =>
  ctx.reply(
    "Send me a product link and I will let you know when it is available."
  )
);
bot.hears(/https:\/\//, async (ctx) => {
  const chat = await ctx.getChat();
  const urls = getUrl(ctx.message.text).values();
  const url = urls.next().value;
  const vendor = detectVendor(url);
  if (vendor === undefined) {
    if (chat.type !== "private") return;
    console.warn(`Unknown vendor: ${url}`);
    return ctx.reply(
      `😢 Unfortunately I cannot help you with this product vendor yet.`
    );
  }

  if (vendor === BRINGMEISTER) {
    const product = await getBringmeisterProductFromUrl(url);
    if (!product) return;

    if (product.available) {
      return ctx.reply(
        `🟢 "${product.name}" is already available. Got Get It !`
      );
    }

    const db = DB(chat.id);

    try {
      db.addProduct(product);
    } catch (e) {
      return ctx.reply(e.message);
    }

    return ctx.reply(
      `Ok I will let you know when "${product.name}" will be available.`
    );
  }
});

job.start();
bot.launch();
