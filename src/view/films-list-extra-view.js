import AbstractView from '../framework/view/abstract-view.js';

const generateFilmsListExtraViewTemplate = (title) => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
  </section>`
);

export default class FilmsListExtraView extends AbstractView {
  #title;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return generateFilmsListExtraViewTemplate(this.#title);
  }

  get filmsContainerElement() {
    return this.element.querySelector('.films-list__container');
  }

}
