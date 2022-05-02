import {render} from '../render.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import MainNavView from '../view/main-nav-view.js';
import MainSortView from '../view/main-sort-view.js';
import FilmDetailsView from '../view/film-details-view';

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

    const filmsListContainerElement = this.#filmsListComponent.filmsContainerElement;

    for (let i = 0; i < this.#films.length; i++) {
      render(new FilmCardView(this.#films[i]), filmsListContainerElement);
    }

    render(new FilmDetailsView(this.#films[0], this.#filmModel.getComments(this.#films[0])), filmsListContainerElement);

    render(new MainNavView(), this.#filmsContainer);
    render(new MainSortView(), this.#filmsContainer);
    render(this.#filmsMainComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsMainComponent.element);
    render(this.#filmsShowMoreButtonComponent, this.#filmsListComponent.element);
    render(new FilmsListExtraView(), this.#filmsMainComponent.element);
  }

}
