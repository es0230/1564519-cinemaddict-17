import AbstractView from '../framework/view/abstract-view.js';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="releaseYear" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView{
  #defaultFilmCardOrder = null;
  #releaseYearFilmCardOrder = null;
  #ratingFilmCardOrder = null;

  constructor(cardModel) {
    super();
    this.#defaultFilmCardOrder = cardModel;
    this.#releaseYearFilmCardOrder = cardModel.slice().sort((a, b) => a.releaseYear - b.releaseYear);
    this.#ratingFilmCardOrder = cardModel.slice().sort((a, b) => a.rating - b.rating);
  }

  get template() {
    return createSortTemplate();
  }

  get defaultFilmCardOrder() {
    return this.#defaultFilmCardOrder;
  }

  get releaseYearFilmCardOrder() {
    return this.#releaseYearFilmCardOrder;
  }

  get ratingFilmCardOrder() {
    return this.#ratingFilmCardOrder;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    if (evt.target.dataset.sortType) {
      evt.preventDefault();
      const sortType = evt.target.dataset.sortType;
      this._callback.click(sortType);
    }
  };
}
