import dayjs from 'dayjs';
import {getDescriptionPreview} from '../util/film.js';
import AbstractView from '../framework/view/abstract-view.js';

const generateFilmCardTemplate = ({comments, filmInfo, userDetails}) => {
  const {title, totalRating, poster, release: {date: releaseDate}, runtime, genre, description} = filmInfo;
  const {watchList, alreadyWatched, favorite} = userDetails;

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
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchList ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
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

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

}
