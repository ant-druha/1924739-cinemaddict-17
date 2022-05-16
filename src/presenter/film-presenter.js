import FilmCardView from '../view/film-card-view';
import {remove, render, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmModel = null;
  #filmComponent = null;
  #filmDetailsComponent = null;
  #film = null;

  #updateFilm = null;
  #closeAllPopups = null;

  constructor(filmListContainer, filmModel, updateFilm, closeAllPopups) {
    this.#filmListContainer = filmListContainer;
    this.#filmModel = filmModel;
    this.#updateFilm = updateFilm;
    this.#closeAllPopups = closeAllPopups;
  }

  init = (film) => {
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

    if (this.#filmDetailsComponent !== null) {
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

    const prevFilmDetails = this.#filmDetailsComponent;

    const newFilmDetailsView = new FilmDetailsView(this.#film, this.#filmModel.getComments(this.#film));

    if (prevFilmDetails === null) {
      this.#closeAllPopups();
      render(newFilmDetailsView, body);
    } else {
      replace(newFilmDetailsView, prevFilmDetails);
    }

    newFilmDetailsView.setCloseButtonClickHandler(this.closeFilmDetailsPopup);
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

  #handleFavouritesClick = () => {
    this.#updateFilm({
      ...this.#film,
      userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}
    });
  };

  #handleWatchedClick = () => {
    this.#updateFilm({
      ...this.#film,
      userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
    });
  };

  #handleWatchListClick = () => {
    this.#updateFilm({
      ...this.#film,
      userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}
    });
  };

}
