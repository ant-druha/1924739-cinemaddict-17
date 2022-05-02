import {render} from '../render.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import MainNavView from '../view/main-nav-view.js';
import MainSortView from '../view/main-sort-view.js';
import FilmDetailsView from '../view/film-details-view.js';

export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmModel = null;
  #films = null;
  #filmsMainComponent = new FilmsMainView();
  #filmsListComponent = new FilmsListView();
  #filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();

  init(filmsContainer, filmModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmModel = filmModel;
    this.#films = [...this.#filmModel.films];

    for (let i = 0; i < this.#films.length; i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    render(new MainNavView(), this.#filmsContainer);
    render(new MainSortView(), this.#filmsContainer);
    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);
    render(this.#filmsShowMoreButtonComponent, this.#filmsListComponent.element);
    render(new FilmsListExtraView(), this.#filmsMainComponent.element);
  }

  #renderFilmCard(film) {
    const filmCardView = new FilmCardView(film);
    const filmsContainerElement = this.#filmsListComponent.filmsContainerElement;

    render(filmCardView, filmsContainerElement);

    filmCardView.element.querySelector('.film-card__link').addEventListener('click', () => {
      const filmDetailsView = new FilmDetailsView(film, this.#filmModel.getComments(film));
      const body = document.querySelector('body');
      body.classList.add('hide-overflow');

      render(filmDetailsView, body);

      const filmPopupCloseButton = filmDetailsView.element.querySelector('.film-details__close-btn');

      const closeFilmDetailsPopup = () => {
        body.classList.remove('hide-overflow');
        filmDetailsView.element.remove();
        filmDetailsView.removeElement();
        filmPopupCloseButton.removeEventListener('click', closeFilmDetailsPopup);
        document.removeEventListener('keydown', closeFilmDetailsPopup);
      };

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          closeFilmDetailsPopup();
        }
      };

      filmPopupCloseButton.addEventListener('click', closeFilmDetailsPopup);
      document.addEventListener('keydown', onEscKeyDown);
    });
  }

}
