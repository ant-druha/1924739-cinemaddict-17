import Observable from '../framework/observable';
import {submitComment} from '../mock/comment';
import {UpdateType} from '../const';

export default class FilmModel extends Observable {
  /**
   * @type {FilmsApiService}
   */
  #filmsApiService;
  #commentModel;
  #films = [];

  constructor(filmsApiService, commentModel) {
    super();
    this.#filmsApiService = filmsApiService;
    this.#commentModel = commentModel;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
      // console.log('films from server: ', films);
      // console.log('films adapted: ', this.#films);
    } catch (e) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

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

  getComments = async (film) => await this.#commentModel.getComments(film);

  addComment = (updateType, {film, comment}) => {
    const commentWithId = submitComment(comment.text, comment.emoji, true);

    const updatedFilm = {...film, comments: [...film.comments, commentWithId.id]};
    this.#updateFilmNoNotify(updatedFilm);

    this.#commentModel.addComment(updateType, {film: updatedFilm, comment: commentWithId});
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film['film_info'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating'],
        release: {
          ...film['film_info']['release'],
          releaseCountry: film['film_info']['release']['release_country']
        }
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['release']['release_country'];

    delete adaptedFilm['user_details'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  };
}
