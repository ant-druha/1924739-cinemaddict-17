import {createElement} from '../render';

const createFilmsViewTemplate = () => `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>`;

export default class FilmsListView {
  #element = null;

  get template() {
    return createFilmsViewTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get filmsContainerElement() {
    return this.element.querySelector('.films-list__container');
  }

  removeElement() {
    this.#element = null;
  }
}
