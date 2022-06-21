import Observable from '../framework/observable';
import UserProfileView from '../view/user-profile-view';
import {getProfileRank} from '../util/common';
import {remove, render} from '../framework/render';

export default class UserProfilePresenter extends Observable {
  #container;
  #filmModel;
  #userProfileView = null;
  #avatarUrl = 'images/bitmap@2x.png';

  constructor(container, filmModel) {
    super();
    this.#container = container;
    this.#filmModel = filmModel;
    this.#filmModel.addObserver(this.#handleModelChange);
  }

  init = () => {
    remove(this.#userProfileView);
    this.#userProfileView = new UserProfileView(this.#getProfileRank(), this.#avatarUrl);
    render(this.#userProfileView, this.#container);
  };

  #getProfileRank = () => {
    const watchedCount = this.#filmModel.films.filter((film) => film.userDetails.alreadyWatched).length;
    return getProfileRank(watchedCount);
  };

  #handleModelChange = () => {
    this.init();
  };

}
