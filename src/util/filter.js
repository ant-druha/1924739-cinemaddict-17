import {FilterType} from '../const';

const Filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((f) => f.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((f) => f.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((f) => f.userDetails.favorite)
};


export {Filter};
