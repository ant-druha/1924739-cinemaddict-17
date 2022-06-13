import Observable from '../framework/observable';


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
    this.#comments.set(comment.id, comment);
    this._notify(updateType, film);
  };

  deleteComment = (updateType, {film, commentId}) => {
    this.#comments.delete(commentId);
    this._notify(updateType, film);
  };

}
