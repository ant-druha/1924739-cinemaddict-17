import {createElement} from '../render';

const createFilmsEmptyViewTemplate = (filter) => {
  let statusText = '';
  switch (filter) {
    case '#all':
      statusText = 'There are no movies in our database';
      break;
    case '#watchlist':
      statusText = 'There are no movies to watch now';
      break;
    case '#history':
      statusText = 'There are no watched movies now';
      break;
    case '#favorites':
      statusText = 'There are no favorite movies now';
      break;
  }
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${statusText}</h2>
    </section>
  </section>`;
};

export default class FilmsListEmptyView {
  #element = null;
  #filter = null;

  constructor(filter) {
    this.#filter = filter;
  }

  get template() {
    return createFilmsEmptyViewTemplate(this.#filter);
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
