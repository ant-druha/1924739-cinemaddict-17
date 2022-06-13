import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import SortView from '../view/sort-view.js';
import {
  ExtraViewType,
  FILM_CARD_PAGINATION_SIZE,
  sort,
  SortType,
  UpdateType,
  UserAction
} from '../const.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import {createElement, remove, render, RenderPosition, replace} from '../framework/render';
import {getRandomInteger} from '../util/common';
import {getRandomSlice} from '../mock/film';
import FilmPresenter from './film-presenter';
import {Filter} from '../util/filter';

export default class FilmsPresenter {
  #filmsContainer = null;
  /**
   *
   * @type {FilmModel}
   */
  #filmModel;

  /**
   *
   * @type {CommentModel}
   */
  #commentModel;
  /**
   *
   * @type {FilterModel}
   */
  #filterModel = null;

  #filmToPresenterMap = new Map();

  #filmsMainComponent = new FilmsMainView();
  #filmsListComponent = null;

  #filmExtraComponents = [];

  #filmsListEmptyComponent = null;

  #sortComponent = null;
  #filmsShowMoreButtonComponent = null;
  #renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;

  #currentSortType = SortType.DEFAULT;

  #isLoading = true;

  /**
   *
   * @param filmsContainer {Element}
   * @param filmModel {FilmModel}
   * @param commentModel {CommentModel}
   * @param filterModel {FilterModel}
   */
  constructor(filmsContainer, filmModel, commentModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filteredFilms = Filter[this.#filterModel.filter]([...(this.#filmModel.films)]);
    return sort[this.#currentSortType](filteredFilms);
  }

  #renderLoading = () => {
    this.#filmsListComponent = new FilmsListView(true);
    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);
  };

  #removeLoading = () => {
    this.#filmsListComponent = null;
    remove(this.#filmsMainComponent);
    remove(this.#filmsListComponent);
  };

  init = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderFooterFilmsStatistics();

    const films = this.films;

    if (films.length === 0) {
      this.#renderEmptyList();

      remove(this.#sortComponent);
      this.#sortComponent = null;

      return;
    }

    this.#renderSort(this.#currentSortType);

    this.#filmsListComponent = new FilmsListView();
    this.#renderFilms();

    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);

    this.#renderShowMoreButton();

    this.#renderFilmExtraView(ExtraViewType.TOP_RATED, getRandomSlice(films, getRandomInteger(0, 4)));

    this.#renderFilmExtraView(ExtraViewType.TOP_COMMENTED, getRandomSlice(films, getRandomInteger(0, 4)));
  };

  #renderFooterFilmsStatistics = () => {
    const statisticsSection = document.querySelector('.footer .footer__statistics');
    const statisticsText = createElement(`<p>${this.films.length} movies inside</p>`);
    statisticsSection.insertAdjacentElement(RenderPosition.BEFOREEND, statisticsText);
  };

  #clearFilms = (resetSortType = false) => {
    this.#filmToPresenterMap.clear();

    remove(this.#filmsListComponent);
    remove(this.#filmsShowMoreButtonComponent);
    remove(this.#filmsListEmptyComponent);

    this.#filmExtraComponents.forEach((c) => remove(c));

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;
  };

  #renderEmptyList = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterModel.filter);
    render(this.#filmsListEmptyComponent, this.#filmsContainer);
  };

  #renderSort = (sortType) => {
    const newSort = new SortView(sortType);

    newSort.setActiveSortClickHandler(this.#handleSortChange);

    if (this.#sortComponent) {
      replace(newSort, this.#sortComponent);
    } else {
      render(newSort, this.#filmsContainer);
    }

    this.#sortComponent = newSort;
  };

  #renderShowMoreButton() {
    this.#filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();

    const onLoadMoreButtonClick = () => {
      this.films.slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_PAGINATION_SIZE)
        .forEach((f) => {
          this.#renderFilmCard(f, this.#filmsListComponent.container);
        });

      this.#renderedFilmsCount += FILM_CARD_PAGINATION_SIZE;

      if (this.#renderedFilmsCount >= this.films.length) {
        remove(this.#filmsShowMoreButtonComponent);
      }
    };

    if (this.films.length > FILM_CARD_PAGINATION_SIZE) {
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

    this.#filmExtraComponents.push(filmsListExtraComponent);
  }

  #renderFilmCard(film, container) {
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#handleFilmViewAction, this.#closeAllPopups);
    filmPresenter.init(film);
    this.#filmToPresenterMap.set(film.id, filmPresenter);
  }

  #closeAllPopups = () => {
    this.#filmToPresenterMap.forEach((p) => {
      p.closeFilmDetailsPopup();
    });
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#filmToPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.PATCH:
        this.#filmToPresenterMap.get(data.id).init(data, true);
        break;
      case UpdateType.MAJOR:
        this.#clearFilms(true);
        this.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#removeLoading();
        this.init();
    }

  };

  #handleFilmViewAction = (actionType, updateType, payload) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmModel.updateFilm(updateType, payload);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmModel.addComment(updateType, payload);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentModel.deleteComment(updateType, payload);
        break;
    }
  };

  #handleSortChange = (sortType) => {
    this.#currentSortType = sortType;

    this.#renderSort(sortType);

    this.#filmToPresenterMap.clear();
    Array.from(this.#filmsListComponent.container.children).forEach((c) => c.remove());
    this.#filmsListComponent.container.innerHTML = '';

    this.#renderFilms();
  };

  #renderFilms() {
    for (let i = 0; i < Math.min(this.films.length, FILM_CARD_PAGINATION_SIZE); i++) {
      this.#renderFilmCard(this.films[i], this.#filmsListComponent.container);
    }
  }
}
