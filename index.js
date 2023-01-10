import * as grammy from 'grammy';
import { Start } from './bot/command/index.js';

const bot = new grammy.Bot('bot token');

Start(bot);

bot.start({
  onStart(botInfo) {
    console.log(`Bot ${botInfo.username} started`);
  },
});
