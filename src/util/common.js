const EMOJI = {
  smile: './images/emoji/smile.png',
  angry: './images/emoji/angry.png',
  puke: './images/emoji/puke.png',
  sleeping: './images/emoji/sleeping.png'
};

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

export {EMOJI, getProfileRank};
