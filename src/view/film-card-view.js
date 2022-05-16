import dayjs from 'dayjs';
import {getDescriptionPreview} from '../util/film.js';
import AbstractView from '../framework/view/abstract-view.js';

const getControlActiveClass = (isActive) => isActive ? 'film-card__controls-item--active' : '';

const generateFilmCardTemplate = ({comments, filmInfo, userDetails}) => {
  const {title, totalRating, poster, release: {date: releaseDate}, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const durationHours = Math.floor(runtime / 60);
  const durationMinutes = runtime - durationHours * 60;

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

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return generateFilmCardTemplate(this.#film);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmCardClickHandler);
  };

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

  setFavouritesClickHandler = (callback) => {
    this._callback.favouritesClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favouritesClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
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
