import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const filterItemActiveClass = 'main-navigation__item--active';

const createFilterTemplate = (watchlist, history, favorites, filterType) => (
  `<nav class="main-navigation">
    <a href="#all" data-list-type="filmCards" class="main-navigation__item ${filterType === FilterType.ALL ? filterItemActiveClass : ''}">All movies</a>
    <a href="#watchlist" data-list-type="watchlist" class="main-navigation__item ${filterType === FilterType.WATCHLIST ? filterItemActiveClass : ''}">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
    <a href="#history" data-list-type="watched" class="main-navigation__item ${filterType === FilterType.HISTORY ? filterItemActiveClass : ''}">History <span class="main-navigation__item-count">${history.length}</span></a>
    <a href="#favorites" data-list-type="favorite" class="main-navigation__item ${filterType === FilterType.FAVORITES ? filterItemActiveClass : ''}">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
  </nav>`
);

export default class FilterView extends AbstractView{
  #filmCards = null;
  #watchlist = null;
  #history = null;
  #favorites = null;
  #filterType = FilterType.ALL;

  constructor (filmCards) {
    super();
    this.#filmCards = filmCards;
    this.#watchlist = this.#filmCards.filter((el) => el.userDetails.watchlist);
    this.#history = this.#filmCards.filter((el) => el.userDetails.watched);
    this.#favorites = this.#filmCards.filter((el) => el.userDetails.favorite);
  }

  get template() {
    return createFilterTemplate(this.#watchlist, this.#history, this.#favorites, this.#filterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.dataset.listType) {
      evt.preventDefault();
      const listType = evt.target.dataset.listType;
      this._callback.filterTypeChange(listType);
      this.#filterType = listType;
    }
  };
}
