import {createElement} from '../render';


const createFilmsMainTemplate = () => '<section class="films"></section>';

export default class FilmsMainView {
  #element = null;
  #films = null;
  constructor(films) {
    this.#films = films;
  }


  get template() {
    return createFilmsMainTemplate();
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
