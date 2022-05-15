import FilmCardView from '../view/film-card-view';
import {remove, render} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmModel = null;
  #filmComponent = null;
  #filmDetailsComponent = null;
  #film = null;

  constructor(filmListContainer, filmModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmModel = filmModel;
  }

  init = (film) => {
    this.#film = film;
    this.#filmComponent = new FilmCardView(this.#film);

    render(this.#filmComponent, this.#filmListContainer);

    this.#filmComponent.setClickHandler(this.#renderFilmDetailsView);
  };

  #renderFilmDetailsView = () => {
    const body = document.querySelector('body');
    body.classList.add('hide-overflow');

    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#filmModel.getComments(this.#film));

    render(this.#filmDetailsComponent, body);

    this.#filmDetailsComponent.setCloseButtonClickHandler(this.#closeFilmDetailsPopup);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #closeFilmDetailsPopup = () => {
    const body = document.querySelector('body');
    body.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmDetailsPopup();
    }
  };

}
