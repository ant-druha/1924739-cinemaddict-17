import AbstractView from '../framework/view/abstract-view.js';

const generateFilmsMainTemplate = () => '<section class="films"></section>';

export default class FilmsMainView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return generateFilmsMainTemplate();
  }

}
