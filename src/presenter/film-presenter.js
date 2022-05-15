import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmCardPresenter {
  #container = null;
  #changeData = null;
  #removePopups = null;

  #filmCardComponent = null;
  #filmPopupComponent = null;

  #filmCard = null;

  #popupOpened = false;

  constructor (container, changeData, removePopups) {
    this.#container = container;
    this.#changeData = changeData;
    this.#removePopups = removePopups;
  }

  init = (filmCard) => {
    this.#filmCard = filmCard;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmPopupView(filmCard);

    this.#filmCardComponent.setCardClickHandler(this.#handleFilmCardClick(this.#filmCardComponent.filmCard));
    this.#filmCardComponent.setControlClickHandler(this.#handleControlClick);

    this.#filmPopupComponent.setCloseClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setControlButtonClickHandler(this.#handleControlClick);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (document.querySelector('body').contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  };

  #handleFilmCardClick = (cardData) => () => {
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    this.#renderFilmPopup(cardData);
  };

  #handleControlClick = (controlType) => {
    this.#changeData({...this.#filmCard, [controlType]: !this.#filmCard[controlType]});
  };

  #renderFilmPopup = () => {
    this.#removePopups();
    render(this.#filmPopupComponent, document.querySelector('body'));
    this.#popupOpened = !this.#popupOpened;
  };

  #handlePopupClosing = () => {
    this.#filmPopupComponent.element.remove();
    this.#popupOpened = !this.#popupOpened;
  };

  removePopup = () => {
    this.#handlePopupClosing();
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    if (this.#filmPopupComponent) {
      remove(this.#filmPopupComponent);
    }
  };

  get popupOpened() {
    return this.#popupOpened;
  }
}
