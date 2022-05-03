import {filmComments, generateFilm} from '../mock/film.js';

export default class FilmModel {
  #films = Array.from({length: 30}, generateFilm);

  get films() {
    return this.#films;
  }

  getComments = (film) => {
    const allComments = filmComments;
    const result = [];
    film.comments.forEach((comment) => {
      const matchedComment = allComments.get(comment);
      if (matchedComment) {
        result.push(matchedComment);
      }
    });
    return result;
  };
}
