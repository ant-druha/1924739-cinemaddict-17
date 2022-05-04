import {render} from '../render.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import MainNavView from '../view/main-nav-view.js';
import MainSortView from '../view/main-sort-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {FILM_CARD_PAGINATION_SIZE} from '../const.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';

export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmModel = null;
  #films = null;
  #filmsMainComponent = new FilmsMainView();
  #filmsListComponent = new FilmsListView();
  #mainNavComponent = new MainNavView();
  #filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();
  #renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;

  constructor(filmsContainer, filmModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmModel = filmModel;
  }

  init() {
    this.#films = [...this.#filmModel.films];

    render(this.#mainNavComponent, this.#filmsContainer);

    if (this.#films.length === 0) {
      render(new FilmsListEmptyView(this.#mainNavComponent.activeFilter), this.#filmsContainer);
      return;
    }

    for (let i = 0; i < Math.min(this.#films.length, FILM_CARD_PAGINATION_SIZE); i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    render(new MainSortView(), this.#filmsContainer);
    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);

    const onLoadMoreButtonClick = () => {
      this.#films.slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_PAGINATION_SIZE)
        .forEach((f) => {
          this.#renderFilmCard(f);
        });

      this.#renderedFilmsCount += FILM_CARD_PAGINATION_SIZE;

      if (this.#renderedFilmsCount >= this.#films.length) {
        this.#filmsShowMoreButtonComponent.element.removeEventListener('click', onLoadMoreButtonClick);
        this.#filmsShowMoreButtonComponent.element.remove();
        this.#filmsShowMoreButtonComponent.removeElement();

      }
    };

    if (this.#films.length > FILM_CARD_PAGINATION_SIZE) {
      render(this.#filmsShowMoreButtonComponent, this.#filmsListComponent.element);

      this.#filmsShowMoreButtonComponent.element.addEventListener('click', onLoadMoreButtonClick);
    }

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
        document.removeEventListener('keydown', onEscKeyDown);
      };

      function onEscKeyDown(evt) {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          closeFilmDetailsPopup();
        }
      }

      filmPopupCloseButton.addEventListener('click', closeFilmDetailsPopup);
      document.addEventListener('keydown', onEscKeyDown);
    });
  }

}
