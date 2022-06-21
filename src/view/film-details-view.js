import dayjs from 'dayjs';
import he from 'he';
import {EMOJI} from '../util/common.js';
import FilmCardAbstractStatefulView from './film-card-abstract-stateful-view';
import {commentEmotions, COMMENT_MIN_LENGTH} from '../const';
import {createElement, RenderPosition} from '../framework/render';

const generateFilmDetailsViewTemplate = ({
  filmInfo,
  userDetails,
  isCommentsLoading,
  isDisabled,
  deletingCommentId,
  filmComments,
  newComment
}) => {
  const {
    title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors,
    release: {date: releaseDate, releaseCountry}, runtime, genre, description
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
    const isDeletingComment = deletingCommentId !== null && deletingCommentId === comment.id;
    return (
      `<li class="film-details__comment" data-id="${comment.id}">
          <span class="film-details__comment-emoji">
            <img src="${EMOJI[comment.emotion]}" width="55" height="55" alt="emoji-${comment.emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
            <p class="film-details__comment-info">
              ${authorInfo}
              ${dateInfo}
              <button class="film-details__comment-delete" ${isDeletingComment ? 'disabled' : ''}>${isDeletingComment ? 'Deleting...' : 'Delete'}</button>
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
      emojiItems += generateEmojiItem(emoji, comment.emotion && emoji === comment.emotion);
    });
    return `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
        ${comment.emotion ? `<img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">` : ''}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment.comment}</textarea>
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
  <form class="film-details__inner ${isDisabled ? 'film-details__inner--disabled' : ''}" action="" method="get">
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
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${isCommentsLoading ? 'Loading...' : filmComments.length}</span></h3>

          ${generateFilmCommentsListTemplate(filmComments)}

          ${generateNewCommentTemplate(newComment)}
        </section>
      </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsView extends FilmCardAbstractStatefulView {

  constructor(film, commentsPromise) {
    super();
    this._state = FilmDetailsView.parseFilmDetailsToState(film, true, []);
    commentsPromise.then((comments) => {
      this.updateElement({
        isCommentsLoading: false, filmComments: comments
      });
    });
    this.#setInnerClickHandlers();
  }

  static parseFilmDetailsToState = (film, isCommentsLoading, comments, newComment = {comment: '', emotion: null}) => ({
    ...super.parseFilmToState(film),
    isCommentsLoading: isCommentsLoading,
    isDisabled: false,
    deletingCommentId: null,
    filmComments: comments,
    newComment
  });

  _parseStateToFilm = (state) => {
    const filmData = {...state};

    delete filmData.filmInfo.releaseDate;
    delete filmData.filmInfo.releaseCountry;

    delete filmData.isCommentsLoading;

    delete filmData.isDisabled;
    delete filmData.deletingCommentId;

    delete filmData.filmComments;

    return filmData;
  };

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
      this.updateElement({newComment: {comment: this._state.newComment.comment, emotion: emojiName}});
    }
  };

  #commentTextInputHandler = (evt) => {
    evt.preventDefault();
    this.#validateInput();
    this._setState({newComment: {comment: evt.target.value, emotion: this._state.newComment.emotion}});
  };

  #commentDeleteClickHandler = (evt) => {
    const target = evt.target;
    if (!target.classList.contains('film-details__comment-delete')) {
      return;
    }

    evt.preventDefault();
    const commentId = target.closest('.film-details__comment')?.dataset.id;
    if (commentId) {
      this._callback.commentDeleteClick({filmId: this._parseStateToFilm(this._state).id, commentId});
    }
  };

  #isMetaEnterPressed = (evt) => (evt.metaKey || evt.ctrlKey) && evt.key === 'Enter';

  #commentSubmitFormActionHandler = (evt) => {
    if (this.#isMetaEnterPressed(evt)) {
      evt.preventDefault();
      if (this.#validateForm()) {
        this._callback.formSubmit({
          film: this._parseStateToFilm(this._state),
          comment: this._state.newComment
        });
      }
    }
  };

  #validateForm = () => this.#validateInput() && this.#validateEmoji();

  #validateInput = () => {
    this.#clearValidateError();
    let errorText = '';
    const inputText = this.element.querySelector('.film-details__comment-input').value;

    if (inputText.trim().length === 0) {
      errorText = 'To submit new comment enter text';
    } else if (inputText.trim().length < COMMENT_MIN_LENGTH) {
      errorText = `Comment length must be at least ${COMMENT_MIN_LENGTH} characters`;
    }

    if (errorText.length > 0) {
      this.#showError(errorText);
      return false;
    }

    return true;
  };

  #validateEmoji = () => {
    this.#clearValidateError();
    if (this.element.querySelector('.film-details__add-emoji-label img') === null) {
      this.#showError('To submit new comment select emoji');
      return false;
    }

    return true;
  };

  #showError = (error) => {
    const errorElement = createElement(`<div class="error">${error}</div>`);
    const newCommentBlock = this.element.querySelector('.film-details__comments-wrap');
    newCommentBlock.insertAdjacentElement(RenderPosition.AFTEREND, errorElement);
  };

  #clearValidateError = () => {
    this.element.querySelector('.film-details__comments-wrap + .error')?.remove();
  };

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelector('.film-details__comment-delete')?.addEventListener('click', this.#commentDeleteClickHandler);
  };

  setCommentSubmitFormHandler = (callback) => {
    this._callback.formSubmit = callback;
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

  get shakeElement() {
    return this.element.querySelector('.film-details__inner');
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

}
