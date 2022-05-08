import {filter} from '../util/filter.js';
import {FilterType} from '../const.js';

export const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterMovies]) => ({
    name: filterName,
    count: filterName === FilterType.ALL ? null : filterMovies(films).length,
  })
);
