import AbstractView from '../framework/view/abstract-view.js';

/**
 * @abstract
 */
export default class FilmCardAbstractView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get film() {
    return this.#film;
  }

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

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.cardLinkElement.addEventListener('click', this.#filmCardClickHandler);
  };

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

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

}
