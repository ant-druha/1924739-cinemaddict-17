import {createElement} from '../render.js';

const createFilmsShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreButtonView {
  #element = null;

  get template() {
    return createFilmsShowMoreButtonTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
