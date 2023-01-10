import { InlineKeyboard } from 'grammy';
import DB from '../../lib/db.js';

export const appListGen = async (ctx) => {
  
  const kb = new InlineKeyboard();
  const appList = await DB.getHashData(`user:${ctx.chat.id}`);

  Object.keys(appList).forEach((btn) => {
    kb.text(`🔘 ${btn}`, `code-${appList[btn]}`).row();
  });

  kb.text('➕Add new app', 'addApp-button');
  return kb;
};

export const backButton = new InlineKeyboard()
  .text('◀️ Back to list', 'back-button');

export const underCodeButton = new InlineKeyboard()
  .text('❌ Remove app', 'remove-button')
  .row()
  .text('◀️ Back to list', 'back-button');
