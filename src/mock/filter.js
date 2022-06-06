import {Filter} from '../util/filter.js';
import {FilterType} from '../const.js';

export const generateFilter = (films) => Object.entries(Filter).map(
  ([filterName, filterMovies]) => ({
    name: filterName,
    count: filterName === FilterType.ALL ? null : filterMovies(films).length,
  })
);
