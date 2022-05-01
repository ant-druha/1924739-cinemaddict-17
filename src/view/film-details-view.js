import {createElement} from '../render.js';
import dayjs from 'dayjs';
import {EMOJI} from '../util.js';

const getFilmDetailsViewTemplate = ({filmInfo, userDetails}, filmComments) => {
  const {
    title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors,
    release: {date: releaseDate, releaseCountry}, runtime, genre, description
  } = filmInfo;
  const {watchList, alreadyWatched, favorite} = userDetails;

  const durationHours = Math.floor(runtime / 60);
  const durationMinutes = runtime - durationHours * 60;

  const generateGenresTemplate = (genres) => {
    let genreList = '';
    genres.forEach((g) => {
      genreList += `<span class="film-details__genre">${g}</span>`;
    });

    return `<td class="film-details__cell">${genreList}</td>`;
  };

  const generateFilmDetailsControl = (isActive, buttonText, nameId) => `<button type="button" class="film-details__control-button ${
    isActive ? 'film-details__control-button--active' : ''
  } film-details__control-button--${nameId}" id="${nameId}" name="${nameId}">${buttonText}</button>`;

  const generateFilmCommentTemplate = (comment) => {
    const authorInfo = comment.author ? `<span class="film-details__comment-author">${comment.author}</span>` : '';
    const dateInfo = comment.date ? `<span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD HH:MM')}</span>` : '';
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="${EMOJI[comment.emotion]}" width="55" height="55" alt="emoji-${comment.emotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${comment.comment}</p>
                <p class="film-details__comment-info">
                  ${authorInfo}
                  ${dateInfo}
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>`;
  };

  const generateFilmCommentsListTemplate = (comments) => {
    const listItems = [];
    comments.forEach((c) => {
      listItems.push(generateFilmCommentTemplate(c));
    });
    return `<ul class="film-details__comments-list">${listItems.join()}</ul>`;
  };

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>

      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(releaseDate).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${durationHours}h ${durationMinutes}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${generateGenresTemplate(genre)}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        ${generateFilmDetailsControl(watchList, 'Add to watchlist', 'watchlist')}
        ${generateFilmDetailsControl(alreadyWatched, 'Already watched', 'watched')}
        ${generateFilmDetailsControl(favorite, 'Add to favorites', 'favorite')}
      </section>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

          ${generateFilmCommentsListTemplate(filmComments)}

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
  </form>
</section>`;
};

export default class FilmDetailsView {

  constructor(film, comments) {
    this.film = film;
    this.comments = comments;
  }

  getTemplate() {
    return getFilmDetailsViewTemplate(this.film, this.comments);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

}
