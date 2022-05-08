import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((f) => f.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((f) => f.userDetails.alreadyWatched),
  [FilterType.FAVOURITES]: (films) => films.filter((f) => f.userDetails.favorite)
};


export {filter};
