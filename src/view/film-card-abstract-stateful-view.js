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

  static parseFilmToState = (film) => ({
    id: film.id,
    comments: film.comments,
    filmInfo: film.filmInfo,
    userDetails: film.userDetails
  });

  _parseStateToFilm = (state) => {
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
    this.cardFavouriteButtonElement.addEventListener('click', this._favouritesClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.cardMarkWatchedButtonElement.addEventListener('click', this._watchedClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.cardAdToWatchesButtonElement.addEventListener('click', this._watchListClickHandler);
  };

  _watchListClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({userDetails: {...this._state.userDetails, watchlist: !this._state.userDetails.watchlist}});
    this._callback.watchListClick(this._parseStateToFilm(this._state));
  };

  _watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      userDetails: {
        ...this._state.userDetails,
        alreadyWatched: !this._state.userDetails.alreadyWatched
      }
    });
    this._callback.watchedClick(this._parseStateToFilm(this._state));
  };

  _favouritesClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({userDetails: {...this._state.userDetails, favorite: !this._state.userDetails.favorite}});
    this._callback.favouritesClick(this._parseStateToFilm(this._state));
  };

}
