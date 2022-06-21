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
import {getRandomInteger, getRandomSlice} from '../util/common';
import FilmPresenter from './film-presenter';
import {Filter} from '../util/filter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsPresenter {
  #container = null;
  /**
   *
   * @type {FilmModel}
   */
  #filmModel;

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

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #isLoading = true;

  /**
   *
   * @param filmsContainer {Element}
   * @param filmModel {FilmModel}
   * @param filterModel {FilterModel}
   */
  constructor(filmsContainer, filmModel, filterModel) {
    this.#container = filmsContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;
    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filteredFilms = Filter[this.#filterModel.filter]([...(this.#filmModel.films)]);
    return sort[this.#currentSortType](filteredFilms);
  }

  init = () => {
    render(this.#filmsMainComponent, this.#container);

    if (this.#isLoading) {
      this.#renderFilmsListComponent(true);
      return;
    }

    this.#renderFooterFilmsStatistics();

    const films = this.films;

    if (films.length === 0) {
      this.#renderEmptyList();

      return;
    }

    this.#renderSort(this.#currentSortType);

    this.#renderFilmsListComponent(false);
    this.#renderFilms();

    this.#renderShowMoreButton();

    this.#renderFilmExtraView(ExtraViewType.TOP_RATED, getRandomSlice(films, getRandomInteger(0, 4)));

    this.#renderFilmExtraView(ExtraViewType.TOP_COMMENTED, getRandomSlice(films, getRandomInteger(0, 4)));
  };

  #renderFilmsListComponent = (isLoading) => {
    const newFilmsListView = new FilmsListView(isLoading);
    if (this.#filmsListComponent !== null) {
      replace(newFilmsListView, this.#filmsListComponent);
    } else {
      render(newFilmsListView, this.#filmsMainComponent.element);
    }
    this.#filmsListComponent = newFilmsListView;
  };

  #renderFooterFilmsStatistics = () => {
    const statisticsSection = document.querySelector('.footer .footer__statistics');
    statisticsSection.innerHTML = '';
    const statisticsText = createElement(`<p>${this.films.length} movies inside</p>`);
    statisticsSection.insertAdjacentElement(RenderPosition.BEFOREEND, statisticsText);
  };

  #resetFilms = (resetSortType = false) => {
    this.#clearFilms();

    remove(this.#filmsShowMoreButtonComponent);
    remove(this.#filmsListEmptyComponent);

    this.#filmExtraComponents.forEach((c) => remove(c));

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;
  };

  #clearFilms = () => {
    this.#filmToPresenterMap.clear();
    Array.from(this.#filmsListComponent.container.children).forEach((c) => c.remove());
    this.#filmsListComponent.container.innerHTML = '';
  };

  #renderEmptyList = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterModel.filter);
    render(this.#filmsListEmptyComponent, this.#container, RenderPosition.AFTERBEGIN);

    remove(this.#sortComponent);
    this.#sortComponent = null;
  };

  #renderSort = (sortType) => {
    const newSort = new SortView(sortType);

    newSort.setActiveSortClickHandler(this.#handleSortChange);

    if (this.#sortComponent) {
      replace(newSort, this.#sortComponent);
    } else {
      render(newSort, this.#container, RenderPosition.AFTERBEGIN);
    }

    this.#sortComponent = newSort;
  };

  #renderShowMoreButton() {
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
      remove(this.#filmsShowMoreButtonComponent);

      this.#filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();
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
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#filterModel, this.#handleFilmViewAction, this.#closeAllPopups);
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
        this.#rerenderFilms();
        break;
      case UpdateType.FORM:
        this.#filmToPresenterMap.get(data.id).init(data, true);
        this.#filmToPresenterMap.get(data.id).setFormDisabled(false);
        break;
      case UpdateType.MAJOR:
        this.#resetFilms(true);
        this.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.init();
    }

  };

  #handleFilmViewAction = async (actionType, updateType, payload) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM: {
        try {
          await this.#filmModel.updateFilm(updateType, payload);
        } catch (e) {
          this.#filmToPresenterMap.get(payload.id)?.setAborting();
        }
        break;
      }
      case UserAction.ADD_COMMENT: {
        const {film, comment} = payload;
        try {
          this.#filmToPresenterMap.get(film.id).setFormDisabled(true);
          await this.#filmModel.addComment(updateType, {film, comment});
        } catch (e) {
          this.#filmToPresenterMap.get(film.id)?.setAborting();
        }
        break;
      }
      case UserAction.DELETE_COMMENT: {
        const {filmId, commentId} = payload;
        try {
          this.#filmToPresenterMap.get(filmId).setCommentDeleting(commentId);
          await this.#filmModel.deleteComment(updateType, {filmId, commentId});
        } catch (e) {
          this.#filmToPresenterMap.get(filmId)?.setAborting();
        }
        break;
      }
    }

    this.#uiBlocker.unblock();
  };

  #rerenderFilms = () => {
    this.#clearFilms();

    if (this.films.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderFilms(this.#renderedFilmsCount);
  };

  #handleSortChange = (sortType) => {
    this.#currentSortType = sortType;

    this.#closeAllPopups();

    this.#renderSort(sortType);

    this.#renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;

    this.#rerenderFilms();

    this.#renderShowMoreButton();
  };

  #renderFilms(filmsCount = FILM_CARD_PAGINATION_SIZE) {
    for (let i = 0; i < Math.min(this.films.length, filmsCount); i++) {
      this.#renderFilmCard(this.films[i], this.#filmsListComponent.container);
    }
  }
}
