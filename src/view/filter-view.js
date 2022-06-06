import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const generateFilterItemsTemplate = (filter, isActive) => {
  const {name: filterName, count} = filter;
  const filterKey = Object.keys(FilterType).find((key) => FilterType[key] === filterName);
  const itemCountTemplate = count === undefined || count === null ? '' : ` <span class="main-navigation__item-count">${count}</span>`;
  return (
    `<a href="#${filterKey.toLowerCase()}"
      class="main-navigation__item ${
    isActive? 'main-navigation__item--active' : ''}"
      >${filterName}${itemCountTemplate}</a>`
  );
};

const generateFilterViewTemplate = (filters, activeFilter) => {
  const filterItemsTemplate = filters.map(
    ({name, count}) => generateFilterItemsTemplate({name, count}, name === activeFilter)
  ).join('');
  return `<nav class="main-navigation">${filterItemsTemplate}</nav>`;
};

export default class FilterView extends AbstractView {
  #activeFilter;
  #filters;

  constructor(films, activeFilter = FilterType.ALL) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return generateFilterViewTemplate(this.#filters, this.#activeFilter);
  }

}
