import AbstractView from '../framework/view/abstract-view.js';

const ACTIVE_CONTROL_ITEM_CLASS = 'film-card__controls-item--active';

const createFilmCardTemplate = (filmCard) => {
  const {poster, title, rating, releaseYear, duration, genre, description, commentsCount, isInWatchlist, isAlreadyWatched, isFavorite} = filmCard;

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
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isInWatchlist ? ACTIVE_CONTROL_ITEM_CLASS : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isAlreadyWatched ? ACTIVE_CONTROL_ITEM_CLASS : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${isFavorite ? ACTIVE_CONTROL_ITEM_CLASS : ''}" type="button">Mark as favorite</button>
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

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
