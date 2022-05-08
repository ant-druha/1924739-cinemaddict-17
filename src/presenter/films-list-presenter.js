import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {FILM_CARD_PAGINATION_SIZE} from '../const.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import {remove, render} from '../framework/render';

export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmModel = null;
  #films = null;
  #filmsMainComponent = new FilmsMainView();
  #filmsListComponent = new FilmsListView();
  #filterComponent = null;
  #filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();
  #renderedFilmsCount = FILM_CARD_PAGINATION_SIZE;

  constructor(filmsContainer, filmModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmModel = filmModel;
  }

  init() {
    this.#films = [...this.#filmModel.films];

    this.#filterComponent = new FilterView(this.#films);

    render(this.#filterComponent, this.#filmsContainer);

    if (this.#films.length === 0) {
      render(new FilmsListEmptyView(this.#filterComponent.activeFilter), this.#filmsContainer);
      return;
    }

    for (let i = 0; i < Math.min(this.#films.length, FILM_CARD_PAGINATION_SIZE); i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    render(new SortView(), this.#filmsContainer);
    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);

    const onLoadMoreButtonClick = () => {
      this.#films.slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_CARD_PAGINATION_SIZE)
        .forEach((f) => {
          this.#renderFilmCard(f);
        });

      this.#renderedFilmsCount += FILM_CARD_PAGINATION_SIZE;

      if (this.#renderedFilmsCount >= this.#films.length) {
        remove(this.#filmsShowMoreButtonComponent);
      }
    };

    if (this.#films.length > FILM_CARD_PAGINATION_SIZE) {
      render(this.#filmsShowMoreButtonComponent, this.#filmsListComponent.element);

      this.#filmsShowMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
    }

    render(new FilmsListExtraView(), this.#filmsMainComponent.element);
  }

  #renderFilmCard(film) {
    const filmCardView = new FilmCardView(film);
    const filmsContainerElement = this.#filmsListComponent.filmsContainerElement;

    render(filmCardView, filmsContainerElement);

    filmCardView.setClickHandler(() => {
      const filmDetailsView = new FilmDetailsView(film, this.#filmModel.getComments(film));
      const body = document.querySelector('body');
      body.classList.add('hide-overflow');

      render(filmDetailsView, body);

      const closeFilmDetailsPopup = () => {
        body.classList.remove('hide-overflow');
        remove(filmDetailsView);
        document.removeEventListener('keydown', onEscKeyDown);
      };

      function onEscKeyDown(evt) {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          closeFilmDetailsPopup();
        }
      }

      filmDetailsView.setCloseButtonClickHandler(closeFilmDetailsPopup);
      document.addEventListener('keydown', onEscKeyDown);
    });
  }

}
