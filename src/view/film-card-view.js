import AbstractView from '../framework/view/abstract-view.js';
import { ACTIVE_CONTROL_ITEM_CLASS } from '../const.js';

const createFilmCardTemplate = (filmCard) => {
  const {poster, title, rating, releaseYear, duration, genre, description, commentsCount, watchlist, watched, favorite} = filmCard;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsCount}</span>
    </a>
    <div class="film-card__controls">
      <button data-control-type="watchlist" class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? ACTIVE_CONTROL_ITEM_CLASS : ''}" type="button">Add to watchlist</button>
      <button data-control-type="watched" class="film-card__controls-item film-card__controls-item--mark-as-watched ${watched ? ACTIVE_CONTROL_ITEM_CLASS : ''}" type="button">Mark as watched</button>
      <button data-control-type="favorite" class="film-card__controls-item film-card__controls-item--favorite ${favorite ? ACTIVE_CONTROL_ITEM_CLASS : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView{
  #filmCard = null;

  constructor (filmCard) {
    super();
    this.#filmCard = filmCard;
  }

  get template() {
    return createFilmCardTemplate(this.#filmCard);
  }

  get filmCard() {
    return this.#filmCard;
  }

  setCardClickHandler = (callback) => {
    this._callback.cardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#cardClickHandler);
  };

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#controlClickHandler);
  };

  #controlClickHandler = (evt) => {
    if (evt.target.dataset.controlType) {
      evt.preventDefault();
      const controlType = evt.target.dataset.controlType;
      this._callback.controlClick(controlType);
    }

  };
}
