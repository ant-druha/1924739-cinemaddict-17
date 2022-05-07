import AbstractView from '../framework/view/abstract-view.js';

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

export default class FilmsListEmptyView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilmsEmptyViewTemplate(this.#filter);
  }

}
