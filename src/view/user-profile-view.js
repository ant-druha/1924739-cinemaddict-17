import AbstractView from '../framework/view/abstract-view.js';

const generateUserProfileViewTemplate = (ratingBadge, avatarUrl) => `<section class="header__profile profile">
    <p class="profile__rating">${ratingBadge}</p>
    <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
  </section>`;

export default class UserProfileView extends AbstractView {
  constructor(ratingBadge, avatarUrl) {
    super();
    this.ratingBadge = ratingBadge;
    this.avatarUrl = avatarUrl;
  }

  get template() {
    return generateUserProfileViewTemplate(this.ratingBadge, this.avatarUrl);
  }

}
