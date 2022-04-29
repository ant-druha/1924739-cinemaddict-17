import {createElement} from '../render';

const createFilmsViewTemplate = () => `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>`;

export default class FilmsListView {

  getTemplate() {
    return createFilmsViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  getFilmsContainerElement() {
    return this.getElement().querySelector('.films-list__container');
  }
}
