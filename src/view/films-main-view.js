import {createElement} from '../render';


const createFilmsMainTemplate = () => '<section class="films"></section>';

export default class FilmsMainView {
  constructor(films) {
    this.films = films;
  }


  getTemplate() {
    return createFilmsMainTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
