import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = (watchlist, history, favorites) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
  </nav>`
);

export default class NavigationView extends AbstractView{
  #filmCards = null;
  #watchlist = null;
  #history = null;
  #favorites = null;

  constructor (filmCardModel) {
    super();
    this.#filmCards = filmCardModel.filmCards;
    this.#watchlist = this.#filmCards.filter((el) => el.isInWatchlist);
    this.#history = this.#filmCards.filter((el) => el.isAlreadyWatched);
    this.#favorites = this.#filmCards.filter((el) => el.isFavorite);
  }

  get template() {
    return createNavigationTemplate(this.#watchlist, this.#history, this.#favorites);
  }

  get filmCards() {
    return this.#filmCards;
  }

  get watchlist() {
    return this.#watchlist;
  }

  get history() {
    return this.#history;
  }

  get favorites() {
    return this.#favorites;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((el) => el.addEventListener('click', this.#clickHandler));
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    let targetList = evt.target.href.slice(23);
    if (targetList === 'all') {
      targetList = 'filmCards';
    }
    this._callback.click(targetList);
  };
}
