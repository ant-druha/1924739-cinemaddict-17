import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const';

const generateFilmsEmptyViewTemplate = (filter) => {
  let statusText = '';
  switch (filter) {
    case FilterType.ALL:
      statusText = 'There are no movies in our database';
      break;
    case FilterType.WATCHLIST:
      statusText = 'There are no movies to watch now';
      break;
    case FilterType.HISTORY:
      statusText = 'There are no watched movies now';
      break;
    case FilterType.FAVORITES:
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
    return generateFilmsEmptyViewTemplate(this.#filter);
  }

}
