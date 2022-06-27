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
import FilmPresenter from './film-presenter';
import {Filter} from '../util/filter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {getRandomSlice} from '../util/common';

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
  #filmTopRatedViewToPresenterMap = new Map();
  #filmTopCommentedViewToPresenterMap = new Map();

  #popupPresenter = null;

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
    if (this.#isLoading) {
      render(this.#filmsMainComponent, this.#container);
      this.#renderFilmsListComponent(true);
      return;
    }

    this.#renderFooterFilmsStatistics();

    if (this.films.length === 0) {
      this.#renderEmptyList();

      return;
    }

    this.#renderSort(this.#currentSortType);

    this.#renderFilmsListComponent(false);
    this.#renderFilms();

    this.#renderShowMoreButton();

    this.#renderExtraViews();
  };

  #renderExtraViews = () => {
    this.#filmExtraComponents.forEach((component) => remove(component));

    this.#renderFilmExtraView(ExtraViewType.TOP_RATED, this.#getTopRated(), this.#filmTopRatedViewToPresenterMap);
    this.#renderFilmExtraView(ExtraViewType.TOP_COMMENTED, this.#getTopCommented(), this.#filmTopCommentedViewToPresenterMap);
  };

  #getTopRated = () => {
    const sorted = sort[SortType.RATING]([
      ...this.#filmModel.films]
      .filter((film) => film.filmInfo.totalRating !== 0));

    return this.#getTopFilms(sorted, this.#getFilmRating);
  };

  #getTopCommented = () => {
    const sorted = [...this.#filmModel.films]
      .filter((film) => film.comments.length > 0)
      .sort((film1, film2) => film2.comments.length - film1.comments.length);

    return this.#getTopFilms(sorted, this.#getFilmCommentsLength);
  };

  #getTopFilms = (sortedArray, getAttributeToCompare) => {
    const length = sortedArray.length;
    const maxItems = Math.min(2, length);

    if (length > 0 && getAttributeToCompare(sortedArray[0]) === getAttributeToCompare(sortedArray[length - 1])) {
      return getRandomSlice(sortedArray, maxItems);
    }

    return sortedArray.slice(0, maxItems);
  };

  #getFilmCommentsLength = (film) => film.comments.length;

  #getFilmRating = (film) => film.filmInfo.totalRating;

  #renderFilmsListComponent = (isLoading) => {
    if (this.#filmsListComponent === null) {
      const newFilmsListView = new FilmsListView(isLoading);
      render(newFilmsListView, this.#filmsMainComponent.element);
      this.#filmsListComponent = newFilmsListView;
    } else {
      this.#filmsListComponent.setLoading(isLoading);
    }
  };

  #renderFooterFilmsStatistics = () => {
    const statisticsSection = document.querySelector('.footer .footer__statistics');
    statisticsSection.innerHTML = '';
    const statisticsText = createElement(`<p>${this.#filmModel.films.length} movies inside</p>`);
    statisticsSection.insertAdjacentElement(RenderPosition.BEFOREEND, statisticsText);
  };

  #resetFilms = (resetSortType = false) => {
    this.#clearFilms();

    remove(this.#filmsShowMoreButtonComponent);
    remove(this.#filmsListEmptyComponent);

    this.#filmExtraComponents.forEach((component) => remove(component));

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;
  };

  #clearFilms = () => {
    this.#filmToPresenterMap.clear();
    Array.from(this.#filmsListComponent.container.children).forEach((child) => child.remove());
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

  #renderShowMoreButton = () => {
    remove(this.#filmsShowMoreButtonComponent);

    if (this.#renderedFilmsCount >= this.films.length) {
      return;
    }

    const handleLoadMoreButtonClick = () => {
      this.films.slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_PAGINATION_SIZE)
        .forEach((film) => {
          this.#renderFilmCard(film, this.#filmsListComponent.container);
        });

      this.#renderedFilmsCount += FILM_CARD_PAGINATION_SIZE;

      if (this.#renderedFilmsCount >= this.films.length) {
        remove(this.#filmsShowMoreButtonComponent);
      }
    };

    this.#filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();
    render(this.#filmsShowMoreButtonComponent, this.#filmsListComponent.element);
    this.#filmsShowMoreButtonComponent.setButtonClickHandler(handleLoadMoreButtonClick);
  };


  #renderFilmExtraView = (title, films, filmToPresenterMap) => {
    const filmsListExtraComponent = new FilmsListExtraView(title);
    render(filmsListExtraComponent, this.#filmsMainComponent.element);

    const filmsContainerElement = filmsListExtraComponent.container;

    films.forEach((film) => {
      this.#renderFilmCard(film, filmsContainerElement, filmToPresenterMap);
    });

    this.#filmExtraComponents.push(filmsListExtraComponent);
  };

  #renderFilmCard = (film, container, filmToPresenterMap = this.#filmToPresenterMap) => {
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#filterModel, this.#handleFilmViewAction, this.#closeAllPopups, this.#setPopupPresenter);
    filmPresenter.init(film);

    filmToPresenterMap.set(film.id, filmPresenter);
  };

  #closeAllPopups = () => {
    this.#filmToPresenterMap.forEach((presenter) => {
      presenter.closeFilmDetailsPopup();
    });
  };

  #initFilmView = (film, updatePopup = false) => {
    this.#filmToPresenterMap.get(film.id)?.init(film, updatePopup);
    this.#filmTopRatedViewToPresenterMap.get(film.id)?.init(film, updatePopup);
    this.#filmTopCommentedViewToPresenterMap.get(film.id)?.init(film, updatePopup);
  };

  #setFilmViewAborting = (filmId) => {
    if (this.#popupPresenter !== null) {
      this.#popupPresenter.setAborting();
      return;
    }

    this.#filmToPresenterMap.get(filmId)?.setAborting();
    this.#filmTopRatedViewToPresenterMap.get(filmId)?.setAborting();
    this.#filmTopCommentedViewToPresenterMap.get(filmId)?.setAborting();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#initFilmView(data);
        break;
      case UpdateType.PATCH:
        this.#rerenderFilms();
        break;
      case UpdateType.FORM:
        this.#initFilmView(data, true);
        this.#popupPresenter.setFormDisabled(false);
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
          this.#setFilmViewAborting(payload.id);
        }
        break;
      }
      case UserAction.ADD_COMMENT: {
        const {film, comment} = payload;
        try {
          this.#popupPresenter.setFormDisabled(true);
          await this.#filmModel.addComment(updateType, {film, comment});
        } catch (e) {
          this.#setFilmViewAborting(film.id);
        }
        break;
      }
      case UserAction.DELETE_COMMENT: {
        const {filmId, commentId} = payload;
        try {
          this.#popupPresenter.setCommentDeleting(commentId);
          await this.#filmModel.deleteComment(updateType, {filmId, commentId});
        } catch (e) {
          this.#setFilmViewAborting(filmId);
        }
        break;
      }
      case UserAction.CLOSE_POPUP: {
        this.#rerenderFilms(true);
        break;
      }
    }

    this.#uiBlocker.unblock();
  };

  #setPopupPresenter = (presenter) => {
    this.#popupPresenter = presenter;
  };

  #rerenderFilms = (renderExtraViews = false) => {
    this.#clearFilms();

    if (this.films.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderFilms(this.#renderedFilmsCount);

    this.#renderShowMoreButton();

    if (renderExtraViews) {
      this.#renderExtraViews();
    }
  };

  #handleSortChange = (sortType) => {
    this.#currentSortType = sortType;

    this.#closeAllPopups();

    this.#renderSort(sortType);

    this.#renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;

    this.#rerenderFilms();

    this.#renderShowMoreButton();
  };

  #renderFilms = (filmsCount = FILM_CARD_PAGINATION_SIZE) => {
    for (let i = 0; i < Math.min(this.films.length, filmsCount); i++) {
      this.#renderFilmCard(this.films[i], this.#filmsListComponent.container);
    }
  };
}
