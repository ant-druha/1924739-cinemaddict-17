import AbstractView from '../framework/view/abstract-view.js';
import {generateFilter} from '../mock/filter.js';
import {FilterType} from '../const.js';

const createFilterItemsTemplate = (filter, isActive) => {
  const {name: filterName, count} = filter;
  const filterKey = Object.keys(FilterType).find((key) => FilterType[key] === filterName);
  const itemCountTemplate = count === undefined || count === null ? '' : ` <span class="main-navigation__item-count">${count}</span>`;
  return `<a href="#${filterKey.toLowerCase()}" class="main-navigation__item ${
    isActive
      ? 'main-navigation__item--active'
      : ''
  }">${filterName}${itemCountTemplate}</a>`;
};

const createMainNavViewTemplate = (films, activeFilter) => {
  const filterItemsTemplate = generateFilter(films).map(
    ({name, count}) => createFilterItemsTemplate({name, count}, name === activeFilter)
  ).join('');
  return `<nav class="main-navigation">${filterItemsTemplate}</nav>`;
};

export default class FilterView extends AbstractView {
  #films;
  #activeFilter;

  constructor(films, activeFilter = FilterType.ALL) {
    super();
    this.#films = films;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createMainNavViewTemplate(this.#films, this.#activeFilter);
  }

  get activeFilter() {
    return this.element.querySelector('.main-navigation__item--active').getAttribute('href');
  }

}
