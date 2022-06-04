import AbstractStatefulView from '../framework/view/abstract-stateful-view';

/**
 * @abstract
 */
export default class FilmCardAbstractStatefulView extends AbstractStatefulView {

  constructor(film = null) {
    super();
    if (film !== null) {
      this._state = FilmCardAbstractStatefulView.parseFilmToState(film);
    }
  }

  static parseFilmToState = (film) => {
    const filmInfo = {
      ...film.filmInfo,
      releaseDate: film.filmInfo.release.date,
      releaseCountry: film.filmInfo.release.releaseCountry
    };
    return {id: film.id, comments: film.comments, filmInfo, userDetails: film.userDetails};
  };

  static parseStateToFilm = (state) => {
    const filmData = {...state};

    delete filmData.filmInfo.releaseDate;
    delete filmData.filmInfo.releaseCountry;

    return filmData;
  };

  /**
   * @abstract
   */
  get cardLinkElement() {
    throw new Error('Abstract method not implemented: get cardLinkElement');
  }

  /**
   * @abstract
   */
  get cardFavouriteButtonElement() {
    throw new Error('Abstract method not implemented: get cardFavouriteButtonElement');
  }

  /**
   * @abstract
   */
  get cardMarkWatchedButtonElement() {
    throw new Error('Abstract method not implemented: get cardMarkWatchedButtonElement');
  }

  /**
   * @abstract
   */
  get cardAdToWatchesButtonElement() {
    throw new Error('Abstract method not implemented: get cardAdToWatchesButtonElement');
  }

  setFavouritesClickHandler = (callback) => {
    this._callback.favouritesClick = callback;
    this.cardFavouriteButtonElement.addEventListener('click', this.#favouritesClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.cardMarkWatchedButtonElement.addEventListener('click', this.#watchedClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.cardAdToWatchesButtonElement.addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favouritesClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favouritesClick();
  };

  _setInnerClickHandlers = () => {
    this.cardFavouriteButtonElement.addEventListener('click', this.#favouritesClickHandler);
    this.cardMarkWatchedButtonElement.addEventListener('click', this.#watchedClickHandler);
    this.cardAdToWatchesButtonElement.addEventListener('click', this.#watchListClickHandler);
  };

}
