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

export {commentEmotions, FILM_DESCRIPTION_PREVIEW_LENGTH, FILM_CARD_PAGINATION_SIZE, FilterType, SortType, ExtraViewType};
