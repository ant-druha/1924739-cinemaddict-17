import AbstractView from '../framework/view/abstract-view.js';

const createFilmsShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createFilmsShowMoreButtonTemplate();
  }

}
