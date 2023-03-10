import { InlineKeyboard } from 'grammy';
import DB from '../../lib/db.js';

export const appListGen = async (ctx) => {
  
  const kb = new InlineKeyboard();
  const appList = await DB.getHashData(`user:${ctx.chat.id}`);

  Object.keys(appList).forEach((btn) => {
    kb.text(`ð ${btn}`, `code-${appList[btn]}`).row();
  });

  kb.text('âAdd new app', 'addApp-button');
  return kb;
};

export const backButton = new InlineKeyboard()
  .text('âï¸ Back to list', 'back-button');

export const underCodeButton = new InlineKeyboard()
  .text('â Remove app', 'remove-button')
  .row()
  .text('âï¸ Back to list', 'back-button');
