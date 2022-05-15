import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render } from '../framework/render.js';
import { ACTIVE_CONTROL_ITEM_CLASS, ACTIVE_CONTROL_BUTTON_CLASS } from '../const.js';

export default class FilmCardPresenter {
  #container = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #filmCard = null;
  #watchlist = null;
  #watched = null;
  #favorite = null;

  constructor (container) {
    this.#container = container;
  }

  init = (filmCard) => {
    if (filmCard) {
      this.#filmCard = filmCard;
      this.#watchlist = filmCard.watchlist;
      this.#watched = filmCard.watched;
      this.#favorite = filmCard.favorite;
      this.#filmCardComponent = new FilmCardView(filmCard);
      this.#filmCardComponent.setCardClickHandler(this.#handleFilmCardClick(this.#filmCardComponent.filmCard));
      this.#filmCardComponent.setControlClickHandler(this.#handleControlClick);
      render(this.#filmCardComponent, this.#container.querySelector('.films-list__container'));
    }
  };

  #handleFilmCardClick = (cardData) => () => this.#renderFilmPopup(cardData);

  #handleControlClick = (controlType) => {
    this.#filmCard[controlType] = !this.#filmCard[controlType];
    this.#filmCardComponent.element.querySelector(`button[data-control-type="${controlType}"]`).classList.toggle(ACTIVE_CONTROL_ITEM_CLASS);
    this.#filmPopupComponent.element.querySelector(`button[data-control-type="${controlType}"]`).classList.toggle(ACTIVE_CONTROL_BUTTON_CLASS);
  };

  #renderFilmPopup = (filmCard) => {
    if (this.#filmPopupComponent) {
      this.#handlePopupClosing();
    }
    this.#filmPopupComponent = new FilmPopupView(filmCard);
    this.#filmPopupComponent.setCloseClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setControlButtonClickHandler(this.#handleControlClick);
    render(this.#filmPopupComponent, document.querySelector('body'));
  };

  #handlePopupClosing = () => this.#filmPopupComponent.element.remove();

  get watchlist() {
    return this.#watchlist;
  }

  set watchlist(newValue) {
    this.#watchlist = newValue;
  }

  get watched() {
    return this.#watched;
  }

  set watched(newValue) {
    this.#watched = newValue;
  }

  get favorite() {
    return this.#favorite;
  }

  set favorite(newValue) {
    this.#favorite = newValue;
  }
}
