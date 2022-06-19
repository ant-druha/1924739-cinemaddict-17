import AbstractView from '../framework/view/abstract-view.js';

const generateFilmsViewTemplate = (isLoading) => {
  const header = isLoading ? '<h2 class="films-list__title">Loading...</h2>' :
    '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';
  return `<section class="films-list">
      ${header}
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class FilmsListView extends AbstractView {
  #isLoading;

  constructor(isLoading = false) {
    super();
    this.#isLoading = isLoading;
  }

  get template() {
    return generateFilmsViewTemplate(this.#isLoading);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }

}
