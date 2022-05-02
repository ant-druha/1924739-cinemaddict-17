import {FILM_DESCRIPTION_PREVIEW_LENGTH} from './const';

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

const getDescriptionPreview = (description) => description.length > FILM_DESCRIPTION_PREVIEW_LENGTH
  ? `${description.substring(0, FILM_DESCRIPTION_PREVIEW_LENGTH - 1)}...`
  : description;

export {EMOJI, getRandomInteger, getRandomFloat, getDescriptionPreview};
