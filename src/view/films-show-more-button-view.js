import AbstractView from '../framework/view/abstract-view.js';

const generateFilmsShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return generateFilmsShowMoreButtonTemplate();
  }

  setClickHandler = (handler) => {
    this._callback.filmCardClick = handler;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

}
