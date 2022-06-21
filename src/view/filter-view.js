import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const generateFilterItemsTemplate = (filter, isActive) => {
  const {name: filterName, count} = filter;
  const filterKey = Object.keys(FilterType).find((key) => FilterType[key] === filterName);
  const itemCountTemplate = filterName === FilterType.ALL || count === undefined || count === null ? '' : ` <span class="main-navigation__item-count">${count}</span>`;
  return (
    `<a href="#${filterKey.toLowerCase()}"
      class="main-navigation__item ${
    isActive ? 'main-navigation__item--active' : ''}"
      data-filter="${filterName}"
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

  constructor(filters, activeFilter) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return generateFilterViewTemplate(this.#filters, this.#activeFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    const target = evt.target.closest('.main-navigation__item');

    if (target !== null && target.classList.contains('main-navigation__item')) {
      evt.preventDefault();
      this._callback.filterTypeChange(target.dataset.filter);
    }
  };

}
