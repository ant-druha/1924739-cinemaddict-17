import Observable from '../framework/observable';
import FilmModel from './film-model';


export default class CommentModel extends Observable {
  /**
   * @type {FilmsApiService}
   */
  #filmsApiService;
  #comments = new Map();

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  getComments = async (film) => {
    try {
      return await this.#filmsApiService.getComments(film.id);
    } catch (e) {
      return [];
    }
  };

  addComment = (updateType, {film, comment}) => {
    this.#filmsApiService.createComment(film.id, comment).then(({movie: updatedFilm}) => {
      this._notify(updateType, FilmModel.adaptToClient(updatedFilm));
    });
  };

  deleteComment = (updateType, {film, commentId}) => {
    this.#comments.delete(commentId);
    this._notify(updateType, film);
  };

}
