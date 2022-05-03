import {createElement} from '../render.js';

const createHeaderProfileTemplate  = () => `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="" alt="Avatar" width="35" height="35">
  </section>`;

export default class HeaderProfileView {
  #element = null;

  constructor(ratingBadge, avatarUrl) {
    this.ratingBadge = ratingBadge;
    this.avatarUrl = avatarUrl;
  }


  get template() {
    return createHeaderProfileTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
      this.#element.querySelector('.profile__rating').textContent = this.ratingBadge;
      this.#element.querySelector('.profile__avatar').src = this.avatarUrl;
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }

}
