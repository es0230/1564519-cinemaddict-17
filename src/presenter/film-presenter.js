import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render } from '../framework/render.js';

export default class FilmCardPresenter {
  #container = null;
  #filmPopupComponent = null;
  #filmCard = null;

  constructor (container) {
    this.#container = container;
  }

  init = (filmCard) => {
    this.#filmCard = filmCard;
    if (filmCard) {
      const filmCardComponent = new FilmCardView(filmCard);
      filmCardComponent.setClickHandler(this.#handleFilmCardClick(filmCardComponent.filmCard));
      render(filmCardComponent, this.#container.querySelector('.films-list__container'));
    }
  };

  #handleFilmCardClick = (cardData) => () => this.#renderFilmPopup(cardData);

  #renderFilmPopup = (filmCard) => {
    if (this.#filmPopupComponent) {
      this.#handlePopupClosing();
    }
    this.#filmPopupComponent = new FilmPopupView(filmCard);
    this.#filmPopupComponent.setClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    render(this.#filmPopupComponent, document.querySelector('body'));
  };

  #handlePopupClosing = () => this.#filmPopupComponent.element.remove();
}
