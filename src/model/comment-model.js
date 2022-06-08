import {getRandomInteger} from '../util/common';
import {generateComment} from '../mock/comment';
import Observable from '../framework/observable';


export default class CommentModel extends Observable {
  #comments = new Map();

  getComments = (film) => {
    const result = [];
    film.comments.forEach((commentId) => {
      result.push(this.#comments.get(commentId));
    });
    return result;
  };

  addComment = (updateType, {film, comment}) => {
    this.#comments.set(comment.id, comment);
    this._notify(updateType, film);
  };

  generateComments = () => {
    const result = [];
    for (let i = 0; i < getRandomInteger(0, 16); i++) {
      const comment = generateComment();
      result.push(comment);
      this.#comments.set(comment.id, comment);
    }
    return result;
  };

  deleteComment = (updateType, {film, commentId}) => {
    this.#comments.delete(commentId);
    this._notify(updateType, film);
  };

}
