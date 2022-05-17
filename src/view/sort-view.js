import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const';

const generateSortItem = (sortType, isActive) => (
  `<li><a href="#"
          data-sort-type="${sortType}"
          class="sort__button ${isActive ? 'sort__button--active' : ''}">${sortType}</a>
   </li>`
);

const generateSortViewTemplate = (currentSortType) => {
  const sortListItems = Object.values(SortType)
    .map((sortType) => generateSortItem(sortType, sortType === currentSortType))
    .join('');
  return `<ul class="sort">${sortListItems}</ul>`;
};

export default class SortView extends AbstractView {
  #sortType;

  constructor(sortType = SortType.DEFAULT) {
    super();
    this.#sortType = sortType;
  }

  setActiveSortClickHandler = (changeSort) => {
    this._callback.changeSort = changeSort;
    this.element.addEventListener('click', this.#activeSortClickHandler);
  };

  #activeSortClickHandler = (evt) => {
    evt.preventDefault();

    const sortType = evt.target.dataset.sortType || evt.target.parentElement.dataset.sortType;

    if (sortType !== null) {
      this._callback.changeSort(sortType);
    }
  };

  get template() {
    return generateSortViewTemplate(this.#sortType);
  }

}
