import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import {ExtraViewType, FILM_CARD_PAGINATION_SIZE, sort, SortType} from '../const.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import {remove, render, replace} from '../framework/render';
import {getRandomInteger, updateItem} from '../util/common';
import {getRandomSlice} from '../mock/film';
import FilmPresenter from './film-presenter';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmModel = null;

  #films = [];
  #filmToPresenterMap = new Map();

  #sourcedFilms = [];

  #filmsMainComponent = new FilmsMainView();
  #filmsListComponent = new FilmsListView();

  #sortComponent = null;
  #filterComponent = null;
  #filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();
  #renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;

  constructor(filmsContainer, filmModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmModel = filmModel;
  }

  init() {
    this.#films = [...this.#filmModel.films];
    // В отличие от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this.#sourcedFilms = [...this.#filmModel.films];

    this.#filterComponent = new FilterView(this.#films);

    render(this.#filterComponent, this.#filmsContainer);

    if (this.#films.length === 0) {
      render(new FilmsListEmptyView(this.#filterComponent.activeFilter), this.#filmsContainer);
      return;
    }

    this.#renderFilms();

    this.#renderSort(SortType.DEFAULT);

    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);

    this.#renderShowMoreButton();

    this.#renderFilmExtraView(ExtraViewType.TOP_RATED, getRandomSlice(this.#films, getRandomInteger(0, 4)));

    this.#renderFilmExtraView(ExtraViewType.TOP_COMMENTED, getRandomSlice(this.#films, getRandomInteger(0, 4)));
  }

  #renderSort = (sortType) => {
    const newSort = new SortView(sortType);

    newSort.setActiveSortClickHandler(this.#handleSortChange);

    if (this.#sortComponent === null) {
      render(newSort, this.#filmsContainer);
    } else {
      replace(newSort, this.#sortComponent);
    }

    this.#sortComponent = newSort;
  };

  #renderShowMoreButton() {
    const onLoadMoreButtonClick = () => {
      this.#films.slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_PAGINATION_SIZE)
        .forEach((f) => {
          this.#renderFilmCard(f, this.#filmsListComponent.container);
        });

      this.#renderedFilmsCount += FILM_CARD_PAGINATION_SIZE;

      if (this.#renderedFilmsCount >= this.#films.length) {
        remove(this.#filmsShowMoreButtonComponent);
      }
    };

    if (this.#films.length > FILM_CARD_PAGINATION_SIZE) {
      render(this.#filmsShowMoreButtonComponent, this.#filmsListComponent.element);

      this.#filmsShowMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
    }
  }

  #renderFilmExtraView(title, films) {
    const filmsListExtraComponent = new FilmsListExtraView(title);
    render(filmsListExtraComponent, this.#filmsMainComponent.element);

    const filmsContainerElement = filmsListExtraComponent.container;

    films.forEach((f) => {
      this.#renderFilmCard(f, filmsContainerElement);
    });
  }

  #renderFilmCard(film, container) {
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#handleFilmChange, this.#closeAllPopups);
    filmPresenter.init(film);
    this.#filmToPresenterMap.set(film.id, filmPresenter);
  }

  #closeAllPopups = () => {
    this.#filmToPresenterMap.forEach((p) => {
      p.closeFilmDetailsPopup();
    });
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmToPresenterMap.get(updatedFilm.id).init(updatedFilm);
  };

  #handleSortChange = (sortType) => {
    this.#renderSort(sortType);

    this.#films = sort[sortType]([...this.#sourcedFilms]);

    this.#filmToPresenterMap.clear();
    Array.from(this.#filmsListComponent.container.children).forEach((c) => c.remove());
    this.#filmsListComponent.container.innerHTML = '';

    this.#renderFilms();
  };

  #renderFilms() {
    for (let i = 0; i < Math.min(this.#films.length, FILM_CARD_PAGINATION_SIZE); i++) {
      this.#renderFilmCard(this.#films[i], this.#filmsListComponent.container);
    }
  }
}
