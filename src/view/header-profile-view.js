import {createElement} from '../render.js';

const createHeaderProfileTemplate  = () => `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="" alt="Avatar" width="35" height="35">
  </section>`;

export default class HeaderProfileView {

  constructor(ratingBadge, avatarUrl) {
    this.ratingBadge = ratingBadge;
    this.avatarUrl = avatarUrl;
  }


  getTemplate() {
    return createHeaderProfileTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.element.querySelector('.profile__rating').textContent = this.ratingBadge;
      this.element.querySelector('.profile__avatar').src = this.avatarUrl;
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

}
