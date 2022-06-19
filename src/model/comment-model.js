import Observable from '../framework/observable';


export default class CommentModel extends Observable {
  /**
   * @type {FilmsApiService}
   */
  #filmsApiService;

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

  createComment = async (filmId, comment) => this.#filmsApiService.createComment(filmId, comment);

  deleteComment = async (commentId) => this.#filmsApiService.deleteComment(commentId);

}
