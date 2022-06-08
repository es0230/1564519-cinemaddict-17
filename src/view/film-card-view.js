import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const ACTIVE_CONTROL_ITEM_CLASS = 'film-card__controls-item--active';

const createFilmCardTemplate = (filmCard) => {
  const {title, totalRating, poster, release, runtime, genre, description} = filmCard.filmInfo;
  const comments = filmCard.comments;
  const {watchlist, watched, favorite} = filmCard.userDetails;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(release.date).format('YYYY')}</span>
        <span class="film-card__duration">${dayjs.duration({hours: Math.floor(runtime / 60), minutes: runtime % 60}).format('H [h] m [min]')}</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > 140 ? description.slice(0, 140).concat('...') : description}</p>
      <span class="film-card__comments">${comments.length} comment${comments.length !== 1 ? 's' : ''}</span>
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
