const EMOJI = {
  smile: './images/emoji/smile.png',
  angry: './images/emoji/angry.png',
  puke: './images/emoji/puke.png',
  sleeping: './images/emoji/sleeping.png'
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomSlice = (array, n) => array.sort(() => Math.random() - Math.random()).slice(0, n);


const getProfileRank = (watchedCount) => {
  if (watchedCount <= 0) {
    return '';
  }
  if (watchedCount >= 1 && watchedCount <= 10) {
    return 'novice';
  }
  if (watchedCount > 10 && watchedCount <= 20) {
    return 'fan';
  }

  return 'movie buff';
};

export {EMOJI, getRandomInteger, getRandomSlice, getProfileRank};
