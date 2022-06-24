import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const generateFilmsViewTemplate = ({isLoading}) => {
  const header = isLoading ? '<h2 class="films-list__title">Loading...</h2>' :
    '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';
  return `<section class="films-list">
      ${header}
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class FilmsListView extends AbstractStatefulView {

  constructor(isLoading = false) {
    super();
    this._state = {isLoading: isLoading};
  }

  get template() {
    return generateFilmsViewTemplate(this._state);
  }

  setLoading = (value) => {
    this.updateElement({isLoading: value});
  };

  get container() {
    return this.element.querySelector('.films-list__container');
  }

  _restoreHandlers = () => {
  };

}
