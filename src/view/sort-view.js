import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const ACTIVE_SORT_BUTTON_CLASS = 'sort__button--active';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active'  : ''}">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active'  : ''}">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active'  : ''}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView{
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    if (evt.target.dataset.sortType) {
      evt.preventDefault();
      this.element.querySelectorAll('.sort__button').forEach((el) => el.classList.remove(ACTIVE_SORT_BUTTON_CLASS));
      evt.target.classList.add(ACTIVE_SORT_BUTTON_CLASS);
      const sortType = evt.target.dataset.sortType;
      this._callback.click(sortType);
    }
  };
}
