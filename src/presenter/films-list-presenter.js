import {render} from '../render.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsShowMoreButtonView from '../view/films-show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmsMainView from '../view/films-main-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import MainNavView from '../view/main-nav-view';
import MainSortView from '../view/main-sort-view';

export default class FilmsListPresenter {
  filmsMainComponent = new FilmsMainView();
  filmsListComponent = new FilmsListView();
  filmsShowMoreButtonComponent = new FilmsShowMoreButtonView();

  init(filmsContainer) {
    this.filmsContainer = filmsContainer;

    const filmsListContainerElement = this.filmsListComponent.getFilmsContainerElement();

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), filmsListContainerElement);
    }

    render(new MainNavView(), this.filmsContainer);
    render(new MainSortView(), this.filmsContainer);
    render(this.filmsMainComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsMainComponent.getElement());
    render(this.filmsShowMoreButtonComponent, this.filmsListComponent.getElement());
    render(new FilmsListExtraView(), this.filmsMainComponent.getElement());
  }

}
