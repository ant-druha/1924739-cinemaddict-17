import {generateFilm} from '../mock/film.js';
import Observable from '../framework/observable';
import CommentModel from './comment-model';

export default class FilmModel extends Observable {
  #commentModel = new CommentModel();

  #films = Array.from({length: 30}, () => generateFilm(this.#commentModel));

  get films() {
    return this.#films;
  }

  getFilm = (id) => this.#films.find((film) => (film.id === id));

  addFilm = (updateType, update) => {
    this.films = [
      update,
      ...this.films
    ];
    this._notify(updateType, update);
  };

  updateFilm = (updateType, update) => {
    const index = this.films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexciting film');
    }

    this.#films = [
      ...this.films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  getComments = (film) => this.#commentModel.getComments(film);
}
