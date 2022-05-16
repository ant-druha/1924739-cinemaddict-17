import FilmCardView from '../view/film-card-view';
import {remove, render, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmModel = null;
  #updateFilm = null;
  #filmComponent = null;
  #filmDetailsComponent = null;
  #film = null;

  constructor(filmListContainer, filmModel, updateFilm) {
    this.#filmListContainer = filmListContainer;
    this.#filmModel = filmModel;
    this.#updateFilm = updateFilm;
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

    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#filmModel.getComments(this.#film));

    if (prevFilmDetails === null) {
      render(this.#filmDetailsComponent, body);
    } else {
      replace(this.#filmDetailsComponent, prevFilmDetails);
    }

    this.#filmDetailsComponent.setCloseButtonClickHandler(this.#closeFilmDetailsPopup);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#addCardClickHandlers(this.#filmDetailsComponent);
  };

  #closeFilmDetailsPopup = () => {
    const body = document.querySelector('body');
    body.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
    this.#filmDetailsComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmDetailsPopup();
    }
  };

  #handleFavouritesClick = () => {
    this.#updateFilm({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };

  #handleWatchedClick = () => {
    this.#updateFilm({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #handleWatchListClick = () => {
    this.#updateFilm({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

}
