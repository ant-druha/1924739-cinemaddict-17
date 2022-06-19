import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class FilmsApiService extends ApiService {
  constructor(endPoint, authorization) {
    super(endPoint, authorization);
  }

  #adaptToServer = (film) => {
    const info = film.filmInfo;
    const adaptedFilmInfo = {
      ...info,
      'alternative_title': info.alternativeTitle,
      'total_rating': info.totalRating,
      'age_rating': info.ageRating,
      'release': {
        ...info.release,
        'release_country': info.release.releaseCountry
      }
    };

    delete adaptedFilmInfo.alternativeTitle;
    delete adaptedFilmInfo.totalRating;
    delete adaptedFilmInfo.ageRating;
    delete adaptedFilmInfo.release.releaseCountry;

    const adaptedUserDetails = {
      ...film.userDetails,
      'already_watched': film.userDetails.alreadyWatched,
      'watching_date': film.userDetails.watchingDate
    };

    delete adaptedUserDetails.alreadyWatched;
    delete adaptedUserDetails.watchingDate;

    const adaptedFilm = {
      ...film,
      'film_info': adaptedFilmInfo,
      'user_details': adaptedUserDetails
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  };

  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  getComments = async (filmId) => await this._load({
    url: `comments/${filmId}`
  }).then(ApiService.parseResponse);

  createComment = async (filmId, comment) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (commentId) => await this._load({
    url: `comments/${commentId}`,
    method: Method.DELETE
  });
}
