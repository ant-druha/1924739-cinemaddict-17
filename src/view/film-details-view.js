import dayjs from 'dayjs';
import {EMOJI} from '../util/common.js';
import FilmCardAbstractStatefulView from './film-card-abstract-stateful-view';
import {commentEmotions} from '../const';

const generateFilmDetailsViewTemplate = ({filmInfo, userDetails, filmComments, newComment}) => {
  const {
    title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors,
    releaseDate, releaseCountry, runtime, genre, description
  } = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const durationHours = Math.floor(runtime / 60);
  const durationMinutes = runtime - durationHours * 60;

  const generateGenresTemplate = (genres) => {
    let genreList = '';
    genres.forEach((g) => {
      genreList += `<span class="film-details__genre">${g}</span>`;
    });

    return `<td class="film-details__cell">${genreList}</td>`;
  };

  const generateFilmDetailsControl = (isActive, buttonText, nameId) => (
    `<button
      type="button"
      class="film-details__control-button ${isActive ?
      'film-details__control-button--active' : ''
    } film-details__control-button--${nameId}"
      id="${nameId}"
      name="${nameId}">${buttonText}
     </button>`
  );

  const generateFilmCommentTemplate = (comment) => {
    const authorInfo = comment.author ? `<span class="film-details__comment-author">${comment.author}</span>` : '';
    const dateInfo = comment.date ? `<span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD HH:MM')}</span>` : '';
    return (
      `<li class="film-details__comment" data-id="${comment.id}">
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
        </li>`
    );
  };

  const generateNewCommentTemplate = (comment) => {
    const generateEmojiItem = (emojiName, checked) => (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}" ${checked ? 'checked' : ''}>
       <label class="film-details__emoji-label" for="emoji-${emojiName}">
          <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji" data-emoji-name="${emojiName}">
       </label>`
    );
    let emojiItems = '';
    commentEmotions.forEach((emoji) => {
      emojiItems += generateEmojiItem(emoji, comment.emoji && emoji === comment.emoji);
    });
    return `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
        ${comment.emoji ? `<img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji">` : ''}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment.text}</textarea>
        </label>

        <div class="film-details__emoji-list">
        ${emojiItems}
        </div>
    </div>`;
  };

  const generateFilmCommentsListTemplate = (comments) => {
    const listItems = [];
    comments.forEach((c) => {
      listItems.push(generateFilmCommentTemplate(c));
    });
    return `<ul class="film-details__comments-list">${listItems.join('')}</ul>`;
  };

  return (
    `<section class="film-details">
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
              ${generateGenresTemplate(genre)}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        ${generateFilmDetailsControl(watchlist, 'Add to watchlist', 'watchlist')}
        ${generateFilmDetailsControl(alreadyWatched, 'Already watched', 'watched')}
        ${generateFilmDetailsControl(favorite, 'Add to favorites', 'favorite')}
      </section>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

          ${generateFilmCommentsListTemplate(filmComments)}

          ${generateNewCommentTemplate(newComment)}
        </section>
      </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsView extends FilmCardAbstractStatefulView {

  constructor(film, comments) {
    super();
    this._state = FilmDetailsView.parseFilmDetailsToState(film, comments);
    this.#setInnerClickHandlers();
  }

  static parseFilmDetailsToState = (film, comments, newComment = {text: '', emoji: null}) => ({
    ...super.parseFilmToState(film),
    filmComments: comments,
    newComment
  });

  static parseStateToFilmComments = (state) => state.filmComments;

  #setInnerClickHandlers = () => {
    this.cardFavouriteButtonElement.addEventListener('click', this._favouritesClickHandler);
    this.cardMarkWatchedButtonElement.addEventListener('click', this._watchedClickHandler);
    this.cardAdToWatchesButtonElement.addEventListener('click', this._watchListClickHandler);

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#commentEmojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentTextInputHandler);

    this.element.querySelector('.film-details__comments-list')?.addEventListener('click', this.#commentDeleteClickHandler);
    this.element.querySelector('.film-details__inner').addEventListener('keydown', this.#commentSubmitFormActionHandler);
  };

  #commentEmojiClickHandler = (evt) => {
    const emojiName = evt.target.dataset.emojiName;
    if (emojiName) {
      evt.preventDefault();
      this.updateElement({newComment: {text: this._state.newComment.text, emoji: emojiName}});
    }
  };

  #commentTextInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({newComment: {text: evt.target.value, emoji: this._state.newComment.emoji}});
  };

  #commentDeleteClickHandler = (evt) => {
    const target = evt.target;
    if (!target.classList.contains('film-details__comment-delete')) {
      return;
    }

    evt.preventDefault();
    const commentId = target.closest('.film-details__comment')?.dataset.id;
    if (commentId) {
      const index = this._state.filmComments.findIndex((c) => c.id === +commentId);
      if (index >= 0) {
        const filmComments = [
          ...this._state.filmComments.slice(0, index),
          ...this._state.filmComments.slice(index + 1)
        ];
        this.updateElement({
          comments: [...filmComments.map((c) => c.id)],
          filmComments
        });
      }
      this._callback.commentDeleteClick({film: FilmDetailsView.parseStateToFilm(this._state), commentId});
    }
  };

  #commentSubmitFormActionHandler = (evt) => {
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {
      evt.preventDefault();
      this._callback.commentSubmitAction({film: FilmDetailsView.parseStateToFilm(this._state), comment: this._state.newComment});
      // evt.target.closest('.film-details__inner').submit();
    }
  };

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelector('.film-details__comment-delete')?.addEventListener('click', this.#commentDeleteClickHandler);
  };

  setCommentSubmitFormHandler = (callback) => {
    this._callback.commentSubmitAction = callback;
    this.element.querySelector('.film-details__inner').addEventListener('keydown', this.#commentSubmitFormActionHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerClickHandlers();
  };

  get template() {
    return generateFilmDetailsViewTemplate(this._state);
  }

  get cardLinkElement() {
    return this.element.querySelector('.film-card__link');
  }

  get cardFavouriteButtonElement() {
    return this.element.querySelector('.film-details__control-button--favorite');
  }

  get cardMarkWatchedButtonElement() {
    return this.element.querySelector('.film-details__control-button--watched');
  }

  get cardAdToWatchesButtonElement() {
    return this.element.querySelector('.film-details__control-button--watchlist');
  }

  setCloseButtonClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

}
