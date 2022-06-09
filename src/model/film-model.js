import {generateFilm} from '../mock/film.js';
import Observable from '../framework/observable';
import {submitComment} from '../mock/comment';

export default class FilmModel extends Observable {
  #commentModel;
  #films;

  constructor(commentModel) {
    super();
    this.#commentModel = commentModel;
    this.#films = Array.from({length: 30}, () => generateFilm(this.#commentModel));
  }

  get films() {
    return this.#films;
  }

  getFilm = (id) => this.#films.find((film) => (film.id === id));

  updateFilm = (updateType, update) => {
    this.#updateFilmNoNotify(update);
    this._notify(updateType, update);
  };

  #updateFilmNoNotify = (update) => {
    const index = this.films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexciting film');
    }

    this.#films = [
      ...this.films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];
  };

  getComments = (film) => this.#commentModel.getComments(film);

  addComment = (updateType, {film, comment}) => {
    const commentWithId = submitComment(comment.text, comment.emoji, true);

    const updatedFilm = {...film, comments: [...film.comments, commentWithId.id]};
    this.#updateFilmNoNotify(updatedFilm);

    this.#commentModel.addComment(updateType, {film: updatedFilm, comment: commentWithId});
  };
}
