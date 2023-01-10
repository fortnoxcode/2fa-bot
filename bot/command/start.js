import { session } from 'grammy';
import * as OTPAuth from 'otpauth';
import {
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import DB from '../../lib/db.js';
import { addApp } from '../conversations.js';
import { appListGen, backButton, underCodeButton } from './menu.js';

export default (bot) => {
  bot.use(session({ initial: () => ({}) }));

  bot.use(conversations());

  bot.use(createConversation(addApp));

  bot.callbackQuery(/code-(.*)/, async (ctx) => {
    let token = 'Token error. Try adding the app again';

    try {
      token = Number(new OTPAuth.TOTP({
        secret: ctx.match[1],
      }).generate());

      await DB.setUserSets(ctx.chat.id, 'currentApp', ctx.match[1]);

    } catch (error) {
      
      await DB.delField(`user:${ctx.chat.id}`, async () => {
        const db = await DB.getHashData(`user:${ctx.chat.id}`);
        
        return Object.keys(db).find((key) => db[key] === ctx.match[1]);
      });
    }

    ctx.editMessageText(typeof token === 'number' ? `<code>${token}</code>` : token, {
      parse_mode: 'HTML',
      reply_markup: typeof token === 'number' ? underCodeButton : backButton,
    });
  });

  bot.callbackQuery('back-button', async (ctx) => {
    await ctx.editMessageText('List of your apps:', { reply_markup: await appListGen(ctx) });
  });

  bot.callbackQuery('addApp-button', async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.enter('addApp');
  });

  bot.callbackQuery('remove-button', async (ctx) => {
    await ctx.editMessageText('App was removed', { reply_markup: backButton });

    await DB.delField(`user:${ctx.chat.id}`, async () => {
      const db = await DB.getHashData(`user:${ctx.chat.id}`);
      const sets = await DB.getHashData(`usSETS:${ctx.chat.id}`);
      return Object.keys(db).find((key) => db[key] === sets.currentApp);
    });
  });

  bot.command('start', async (ctx) => {
    await ctx.reply('The bot is designed for generating 2FA codes');
    await ctx.reply("Let's add your first App!");
    await ctx.conversation.enter('addApp');
  });
};
