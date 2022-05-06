import AbstractView from '../framework/view/abstract-view.js';

const createHeaderProfileTemplate = (ratingBadge, avatarUrl) => `<section class="header__profile profile">
    <p class="profile__rating">${ratingBadge}</p>
    <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
  </section>`;

export default class HeaderProfileView extends AbstractView {
  constructor(ratingBadge, avatarUrl) {
    super();
    this.ratingBadge = ratingBadge;
    this.avatarUrl = avatarUrl;
  }

  get template() {
    return createHeaderProfileTemplate(this.ratingBadge, this.avatarUrl);
  }

}
