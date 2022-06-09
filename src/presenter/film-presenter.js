import FilmCardView from '../view/film-card-view';
import {remove, render, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';
import {UpdateType, UserAction} from '../const';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmModel = null;
  #filmComponent = null;
  #filmDetailsComponent = null;
  #film = null;

  #changeData = null;
  #closeAllPopups = null;

  constructor(filmListContainer, filmModel, changeData, closeAllPopups) {
    this.#filmListContainer = filmListContainer;
    this.#filmModel = filmModel;
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

  #renderFilmDetailsView = () => {
    const body = document.querySelector('body');
    body.classList.add('hide-overflow');

    const newFilmDetailsView = new FilmDetailsView(this.#film, this.#filmModel.getComments(this.#film));

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

    this.#addCardClickHandlers(newFilmDetailsView);

    this.#filmDetailsComponent = newFilmDetailsView;
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

  #handleCommentDeleteClick = ({film, commentId}) => {
    this.#changeData(UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {film, commentId});
  };

  #handleCommentSubmitFormAction = ({film, comment}) => {
    this.#changeData(UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {film, comment});
  };

  #handleFavouritesClick = () => {
    this.#changeData(UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}
      });
  };

  #handleWatchedClick = () => {
    this.#changeData(UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
      });
  };

  #handleWatchListClick = () => {
    this.#changeData(UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}
      });
  };

}
