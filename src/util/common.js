import {PROFILE_RANK_FAN, PROFILE_RANK_NOVICE} from '../const';

const emoji = {
  smile: './images/emoji/smile.png',
  angry: './images/emoji/angry.png',
  puke: './images/emoji/puke.png',
  sleeping: './images/emoji/sleeping.png'
};

const getProfileRank = (watchedCount) => {
  if (watchedCount <= 0) {
    return '';
  }
  if (watchedCount >= 1 && watchedCount <= PROFILE_RANK_NOVICE) {
    return 'novice';
  }
  if (watchedCount > PROFILE_RANK_NOVICE && watchedCount <= PROFILE_RANK_FAN) {
    return 'fan';
  }

  return 'movie buff';
};

const getRandomSlice = (array, n) => array.sort(() => Math.random() - Math.random()).slice(0, n);

export {emoji, getProfileRank, getRandomSlice};
