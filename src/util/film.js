import {FILM_DESCRIPTION_PREVIEW_LENGTH} from '../const.js';

const getDescriptionPreview = (description) => description.length > FILM_DESCRIPTION_PREVIEW_LENGTH
  ? `${description.substring(0, FILM_DESCRIPTION_PREVIEW_LENGTH - 1)}...`
  : description;

export {getDescriptionPreview};
