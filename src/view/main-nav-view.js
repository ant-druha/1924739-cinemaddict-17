import {createElement} from '../render';

const getMainNavViewTemplate = () => `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
  </nav>`;

export default class MainNavView {
  #element = null;

  get template() {
    return getMainNavViewTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get activeFilter() {
    return this.element.querySelector('.main-navigation__item--active').getAttribute('href');
  }

  removeElement() {
    this.#element = null;
  }
}
