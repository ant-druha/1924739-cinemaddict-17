import dayjs from 'dayjs';

const commentEmotions = ['smile', 'sleeping', 'puke', 'angry'];

const FILM_DESCRIPTION_PREVIEW_LENGTH = 140;

const FILM_CARD_PAGINATION_SIZE = 5;

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVOURITES: 'Favorites'
};

const SortType = {
  DEFAULT: 'Sort by default',
  DATE: 'Sort by date',
  RATING: 'Sort by rating'
};

const ExtraViewType = {
  TOP_RATED: 'Top rated',
  TOP_COMMENTED: 'Most commented'
};

const sort = {
  [SortType.DEFAULT]: (films) => (films),
  [SortType.DATE]: (films) => films
    .sort(({filmInfo: filmInfo1}, {filmInfo: filmInfo2}) => dayjs(filmInfo1.release.date).diff(dayjs(filmInfo2.release.date))),
  [SortType.RATING]: (films) => films
    .sort(({filmInfo: filmInfo1}, {filmInfo: filmInfo2}) => filmInfo2.totalRating - filmInfo1.totalRating)
};

export {commentEmotions, FILM_DESCRIPTION_PREVIEW_LENGTH, FILM_CARD_PAGINATION_SIZE, FilterType, SortType, ExtraViewType, sort};
