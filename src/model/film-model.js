import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class FilmModel extends Observable {
  /**
   * @type {FilmsApiService}
   */
  #filmsApiService;
  /**
   * @type {CommentModel}
   */
  #commentModel;
  #films = [];

  constructor(filmsApiService, commentModel) {
    super();
    this.#filmsApiService = filmsApiService;
    this.#commentModel = commentModel;
  }

  init = async () => {
    this.#films = await this.#fetchFilms();

    this._notify(UpdateType.INIT);
  };

  get films() {
    return this.#films;
  }

  findFilm = (id) => this.#films.find((film) => (film.id === id));

  updateFilm = async (updateType, update) => {
    try {
      const result = await this.#filmsApiService.updateFilm(update);
      const film = this.#adaptToClient(result);
      this._notify(updateType, film);
      this.#updateFilmLocally(film);
    } catch (e) {
      throw Error('Can\'t update movie');
    }
  };


  addComment = async (updateType, {film, comment}) => {
    try {
      const {movie: updatedFilm} = await this.#commentModel.createComment(film.id, comment);
      this._notify(updateType, this.#adaptToClient(updatedFilm));
    } catch (e) {
      throw Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, {filmId, commentId}) => {
    try {
      await this.#commentModel.deleteComment(commentId);
      await this.#fetchFilms();

      this._notify(updateType, this.findFilm(filmId));
    } catch (e) {
      throw Error('Can\'t delete comment');
    }
  };

  #fetchFilms = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (e) {
      this.#films = [];
    }
    return this.films;
  };

  #updateFilmLocally = (update) => {
    const index = this.films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexciting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];
  };

  getComments = async (film) => {
    try {
      return await this.#filmsApiService.getComments(film.id);
    } catch (e) {
      return [];
    }
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
