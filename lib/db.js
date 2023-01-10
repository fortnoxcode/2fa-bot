import { createClient } from 'redis';

const user = createClient({ url: 'base url' });

user.connect().then(() => {
  console.log('Redis connected');
});

user.on('error', (err) => console.log('[Redis] Redis Error', err));

export default {
  getHashData: async (key) => user.HGETALL(key),
  regNewApp: async (userID, appname, token) => {
    await user.HSET(`user:${userID}`, appname, token);
  },
  delField: async (userID, fieldCallback) => {
    user.HDEL(userID, await fieldCallback());
  },
  setUserSets: async (userID, set, value) => {
    await user.HSET(`usSETS:${userID}`, set, value);
  },
};
