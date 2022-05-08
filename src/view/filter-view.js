import AbstractView from '../framework/view/abstract-view.js';
import {generateFilter} from '../mock/filter.js';
import {FilterType} from '../const.js';

const createFilterItemsTemplate = (filter, isActive) => {
  const {name, count} = filter;
  const itemCountTemplate = count === undefined || count === null ? '' : ` <span class="main-navigation__item-count">${count}</span>`;
  return `<a href="#${name}" class="main-navigation__item ${
    isActive
      ? 'main-navigation__item--active'
      : ''
  }">${name}${itemCountTemplate}</a>`;
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
