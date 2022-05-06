import AbstractView from '../framework/view/abstract-view.js';

const createFilmsMainTemplate = () => '<section class="films"></section>';

export default class FilmsMainView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilmsMainTemplate();
  }

}
