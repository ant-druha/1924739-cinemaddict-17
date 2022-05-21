import dayjs from 'dayjs';
import {getDescriptionPreview} from '../util/film.js';
import FilmCardAbstractView from './film-card-abstract-view';

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

export default class FilmCardView extends FilmCardAbstractView {

  constructor(film) {
    super(film);
  }

  get template() {
    return generateFilmCardTemplate(this.film);
  }

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
