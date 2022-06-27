import dayjs from 'dayjs';
import {getDescriptionPreview} from '../util/film.js';
import FilmCardAbstractStatefulView from './film-card-abstract-stateful-view';

const getControlActiveClass = (isActive) => isActive ? 'film-card__controls-item--active' : '';

const generateFilmCardTemplate = ({comments, filmInfo, userDetails}) => {
  const {title, totalRating, poster, release: {date: releaseDate}, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const HOUR_MINUTES = 60;

  const durationHours = Math.floor(runtime / HOUR_MINUTES);
  const durationMinutes = runtime - durationHours * HOUR_MINUTES;

  return `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dayjs(releaseDate).year()}</span>
              <span class="film-card__duration">${durationHours}h ${durationMinutes}m</span>
              <span class="film-card__genre">${genre.join(', ')}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${getDescriptionPreview(description)}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlActiveClass(watchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlActiveClass(alreadyWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${getControlActiveClass(favorite)}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCardView extends FilmCardAbstractStatefulView {

  constructor(film) {
    super(film);
    this.#setInnerClickHandlers();
  }

  get template() {
    return generateFilmCardTemplate(this._state);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.cardLinkElement.addEventListener('click', this.#filmCardClickHandler);
  };

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

  #setInnerClickHandlers = () => {
    this.cardFavouriteButtonElement.addEventListener('click', this._favouritesClickHandler);
    this.cardMarkWatchedButtonElement.addEventListener('click', this._watchedClickHandler);
    this.cardAdToWatchesButtonElement.addEventListener('click', this._watchListClickHandler);
    this.cardLinkElement.addEventListener('click', this.#filmCardClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerClickHandlers();
  };

  get cardLinkElement() {
    return this.element.querySelector('.film-card__link');
  }

  get cardFavouriteButtonElement() {
    return this.element.querySelector('.film-card__controls-item--favorite');
  }

  get cardMarkWatchedButtonElement() {
    return this.element.querySelector('.film-card__controls-item--mark-as-watched');
  }

  get cardAdToWatchesButtonElement() {
    return this.element.querySelector('.film-card__controls-item--add-to-watchlist');
  }

}
