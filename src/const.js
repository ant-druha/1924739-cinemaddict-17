import dayjs from 'dayjs';

const CommentEmotions = ['smile', 'sleeping', 'puke', 'angry'];

const FILM_DESCRIPTION_PREVIEW_LENGTH = 140;

const FILM_CARD_PAGINATION_SIZE = 5;

const COMMENT_MIN_LENGTH = 5;

const PROFILE_RANK_NOVICE = 10;

const PROFILE_RANK_FAN = 20;

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites'
};

const SortType = {
  DEFAULT: 'Sort by default',
  DATE: 'Sort by date',
  RATING: 'Sort by rating'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_FILM: 'DELETE_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT',
  CLOSE_POPUP: 'CLOSE_POPUP'
};

const UpdateType = {
  INIT: 'INIT',
  FORM: 'FORM',
  MINOR: 'MINOR',
  PATCH: 'PATCH',
  MAJOR: 'MAJOR'
};

const sort = {
  [SortType.DEFAULT]: (films) => (films),
  [SortType.DATE]: (films) => films
    .sort(({filmInfo: filmInfo1}, {filmInfo: filmInfo2}) => dayjs(filmInfo2.release.date).diff(dayjs(filmInfo1.release.date))),
  [SortType.RATING]: (films) => films
    .sort(({filmInfo: filmInfo1}, {filmInfo: filmInfo2}) => filmInfo2.totalRating - filmInfo1.totalRating)
};

export {CommentEmotions, FILM_DESCRIPTION_PREVIEW_LENGTH, FILM_CARD_PAGINATION_SIZE, COMMENT_MIN_LENGTH, PROFILE_RANK_NOVICE, PROFILE_RANK_FAN, FilterType, SortType, UserAction, UpdateType, sort};
