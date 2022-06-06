import FilterView from '../view/filter-view';
import {remove, render, RenderPosition} from '../framework/render';
import {FilterType, UpdateType} from '../const';
import {Filter} from '../util/filter';

export default class FilterPresenter {
  #container = null;
  #filterComponent = null;
  /**
   *
   * @type {FilmModel}
   */
  #filmModel = null;
  /**
   *
   * @type {FilterModel}
   */
  #filterModel = null;

  constructor(container, filmModel, filterModel) {
    this.#container = container;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  get filters() {
    const films = this.#filmModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: Filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: Filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: Filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: Filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init() {
    if (this.#filterComponent !== null) {
      remove(this.#filterComponent);
      this.#filterComponent = null;
    }
    this.#filterComponent = new FilterView(this.filters, this.#filterModel.filter);

    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterChange);

    render(this.#filterComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleFilterChange = (filter) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filter);
  };
}
