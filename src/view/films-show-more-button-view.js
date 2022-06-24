import AbstractView from '../framework/view/abstract-view.js';

const generateFilmsShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return generateFilmsShowMoreButtonTemplate();
  }

  setButtonClickHandler = (handler) => {
    this._callback.buttonClick = handler;
    this.element.addEventListener('click', this.#buttonClickHandler);
  };

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonClick();
  };

}
