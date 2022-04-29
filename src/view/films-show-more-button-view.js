import {createElement} from '../render.js';

const createFilmsShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreButtonView {
  getTemplate() {
    return createFilmsShowMoreButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
