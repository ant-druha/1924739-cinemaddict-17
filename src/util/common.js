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

const getRandomFloat = (min, max, fractionalDigits = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return (Math.random() * (upper - lower) + lower).toFixed(fractionalDigits);
};

export const updateItem = (items, updated) => {
  const index = items.findIndex((item) => item.id === updated.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updated,
    ...items.slice(index + 1, items.length - 1)
  ];
};

export {EMOJI, getRandomInteger, getRandomFloat};
