import FilmCardView from '../view/film-card-view';
import {remove, render, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';
import {FilterType, UpdateType, UserAction} from '../const';

export default class FilmPresenter {
  #filmListContainer;
  #filmModel;
  /**
   * @type {FilterModel}
   */
  #filterModel;
  #filmComponent = null;
  #filmDetailsComponent = null;
  #film = null;

  #changeData;
  #closeAllPopups;

  constructor(filmListContainer, filmModel, filterModel, changeData, closeAllPopups) {
    this.#filmListContainer = filmListContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;
    this.#changeData = changeData;
    this.#closeAllPopups = closeAllPopups;
  }

  init = (film, updatePopup = false) => {
    const prevFilm = this.#film;
    const prevFilmComponent = this.#filmComponent;

    this.#film = film;
    this.#filmComponent = new FilmCardView(this.#film);

    if (prevFilm === null) {
      render(this.#filmComponent, this.#filmListContainer);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }
    this.#filmComponent.setFilmCardClickHandler(this.#renderFilmDetailsView);

    this.#addCardClickHandlers(this.#filmComponent);

    if (this.#filmDetailsComponent !== null && updatePopup) {
      this.#renderFilmDetailsView();
    }
  };

  #addCardClickHandlers = (element) => {
    element.setFavouritesClickHandler(this.#handleFavouritesClick);
    element.setWatchedClickHandler(this.#handleWatchedClick);
    element.setWatchListClickHandler(this.#handleWatchListClick);
  };

  #addPopupCardClickHandlers = (element) => {
    element.setFavouritesClickHandler(this.#handlePopupFavouritesClick);
    element.setWatchedClickHandler(this.#handlePopupWatchedClick);
    element.setWatchListClickHandler(this.#handlePopupWatchListClick);
  };

  #renderFilmDetailsView = () => {
    const body = document.querySelector('body');
    body.classList.add('hide-overflow');

    const commentsPromise = this.#filmModel.getComments(this.#film);
    const newFilmDetailsView = new FilmDetailsView(this.#film, commentsPromise);

    if (this.#filmDetailsComponent !== null) {
      replace(newFilmDetailsView, this.#filmDetailsComponent);
    } else {
      this.#closeAllPopups();
      render(newFilmDetailsView, body);
    }

    newFilmDetailsView.setCloseButtonClickHandler(this.closeFilmDetailsPopup);
    newFilmDetailsView.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    newFilmDetailsView.setCommentSubmitFormHandler(this.#handleCommentSubmitFormAction);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#addPopupCardClickHandlers(newFilmDetailsView);

    this.#filmDetailsComponent = newFilmDetailsView;
  };

  setCommentDeleting = (commentId) => {
    this.#filmDetailsComponent.updateElement({deletingCommentId: commentId});
  };

  setFormDisabled = (isDisabled) => {
    this.#filmDetailsComponent.updateElement({isDisabled: isDisabled});
  };

  setAborting = () => {
    if (this.#filmDetailsComponent === null) {
      const resetCardState = () => {
        this.#filmComponent.updateElement({
          ...FilmCardView.parseFilmToState(this.#film)
        });
      };

      this.#filmComponent.shake(resetCardState);
      return;
    }

    const resetFormState = () => {
      this.#filmDetailsComponent.updateElement({
        ...FilmCardView.parseFilmToState(this.#film),
        deletingCommentId: null,
        isDeleting: false,
        isDisabled: false
      });
    };

    this.#filmDetailsComponent.shake(resetFormState);
  };

  closeFilmDetailsPopup = () => {
    const body = document.querySelector('body');
    body.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
    this.#filmDetailsComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closeFilmDetailsPopup();
    }
  };

  #handleCommentDeleteClick = ({filmId, commentId}) => {
    this.#changeData(UserAction.DELETE_COMMENT,
      UpdateType.FORM,
      {filmId, commentId});
  };

  #handleCommentSubmitFormAction = ({film, comment}) => {
    this.#changeData(UserAction.ADD_COMMENT,
      UpdateType.FORM,
      {film, comment});
  };

  #handleFavouritesClick = (film) => {
    const updateType = this.#filterModel.filter === FilterType.FAVORITES ? UpdateType.PATCH : UpdateType.MINOR;
    this.#changeData(UserAction.UPDATE_FILM,
      updateType,
      film
    );
  };

  #handleWatchedClick = (film) => {
    const updateType = this.#filterModel.filter === FilterType.HISTORY ? UpdateType.PATCH : UpdateType.MINOR;
    this.#changeData(UserAction.UPDATE_FILM,
      updateType,
      film
    );
  };

  #handleWatchListClick = (film) => {
    const updateType = this.#filterModel.filter === FilterType.WATCHLIST ? UpdateType.PATCH : UpdateType.MINOR;
    this.#changeData(UserAction.UPDATE_FILM,
      updateType,
      film
    );
  };

  #handlePopupFavouritesClick = (film) => {
    this.#changeData(UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      film
    );
  };

  #handlePopupWatchedClick = (film) => {
    this.#changeData(UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      film
    );
  };

  #handlePopupWatchListClick = (film) => {
    this.#changeData(UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      film
    );
  };

}
