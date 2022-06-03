import AbstractView from '../framework/view/abstract-view.js';

const createUserRatingTemplate = (watchedFilmsCount) => {
  let userRank;
  switch (true) {
    case (watchedFilmsCount < 10):
      userRank = 'Novice';
      break;
    case (watchedFilmsCount < 20):
      userRank = 'Fan';
      break;
    default:
      userRank = 'Movie Buff';
      break;
  }

  return `<section class="header__profile profile">
    <p class="profile__rating ${watchedFilmsCount === 0 ? 'visually-hidden' : ''}">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends AbstractView{
  #watchedFilmsCount = null;

  constructor(filmCards) {
    super();
    this.#watchedFilmsCount = filmCards.filter((el) => el.userDetails.watched).length;
  }

  get template() {
    return createUserRatingTemplate(this.#watchedFilmsCount);
  }
}
