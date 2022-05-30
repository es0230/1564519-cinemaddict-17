import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const ACTIVE_FILTER_BUTTON_CLASS = 'main-navigation__item--active';

const createFilterTemplate = (watchlist, history, favorites, filterType) => (
  `<nav class="main-navigation">
    <a href="#all" data-list-type="filmCards" class="main-navigation__item ${filterType === FilterType.ALL ? ACTIVE_FILTER_BUTTON_CLASS : ''}">All movies</a>
    <a href="#watchlist" data-list-type="watchlist" class="main-navigation__item ${filterType === FilterType.WATCHLIST ? ACTIVE_FILTER_BUTTON_CLASS : ''}">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
    <a href="#history" data-list-type="watched" class="main-navigation__item ${filterType === FilterType.HISTORY ? ACTIVE_FILTER_BUTTON_CLASS : ''}">History <span class="main-navigation__item-count">${history.length}</span></a>
    <a href="#favorites" data-list-type="favorite" class="main-navigation__item ${filterType === FilterType.FAVORITES ? ACTIVE_FILTER_BUTTON_CLASS : ''}">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
  </nav>`
);

export default class FilterView extends AbstractView{
  #filmCards = null;
  #watchlist = null;
  #history = null;
  #favorites = null;
  #filterType = null;

  constructor (filmCards, filterType) {
    super();
    this.#filmCards = filmCards;
    this.#watchlist = this.#filmCards.filter((el) => el.userDetails.watchlist);
    this.#history = this.#filmCards.filter((el) => el.userDetails.watched);
    this.#favorites = this.#filmCards.filter((el) => el.userDetails.favorite);
    this.#filterType = filterType;
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
      this.element.querySelectorAll('.main-navigation__item').forEach((el) => el.classList.remove(ACTIVE_FILTER_BUTTON_CLASS));
      evt.target.classList.add(ACTIVE_FILTER_BUTTON_CLASS);
      const listType = evt.target.dataset.listType;
      //this.#filterType = listType;
      this._callback.filterTypeChange(listType);

    }
  };
}
