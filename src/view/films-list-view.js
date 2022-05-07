import AbstractView from '../framework/view/abstract-view.js';

const createFilmsViewTemplate = () => `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>`;

export default class FilmsListView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createFilmsViewTemplate();
  }

  get filmsContainerElement() {
    return this.element.querySelector('.films-list__container');
  }

}
