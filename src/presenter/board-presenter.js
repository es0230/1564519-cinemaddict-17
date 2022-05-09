import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListSectionView from '../view/films-list.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import { render } from '../framework/render.js';

const FILM_CARDS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = new ShowMoreButtonView();
  #noFilmCardsSection = new NoFilmCardsView();
  #filmPopupComponent = null;
  #container = null;
  #cardModel = null;
  #filmCards = null;
  #renderedFilmCardsCount = 0;

  #renderFilmCard = (filmCard) => {
    if (filmCard) {
      const filmCardComponent = new FilmCardView(filmCard);
      filmCardComponent.setClickHandler(this.#handleFilmCardClick(filmCardComponent.filmCard));
      render(filmCardComponent, this.#container.querySelector('.films-list__container'));
    }
  };

  #renderFilmPopup = (filmCard) => {
    this.#filmPopupComponent = new FilmPopupView(filmCard);
    this.#filmPopupComponent.setClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    render(this.#filmPopupComponent, document.querySelector('body'));
  };

  #renderNewFilmCards = () => {
    for (let i = this.#renderedFilmCardsCount; i < this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP; i++) {
      this.#renderFilmCard(this.#filmCards[i]);
    }

    this.#renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP < this.#filmCards.length ? this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP : this.#filmCards.length;
  };

  #handleFilmCardClick = (cardData) => () => this.#renderFilmPopup(cardData);

  #handleShowMoreButtonClick = () => {
    this.#renderNewFilmCards();

    if (this.#filmCards.length < this.#renderedFilmCardsCount) {
      this.#showMoreButton.element.remove();
    }
  };

  #handlePopupClosing = () => {
    this.#filmPopupComponent.element.remove();
  };

  #renderBoard = () => {
    if (this.#filmCards.length === 0) {
      render(this.#noFilmCardsSection, this.#container);
    } else {
      render(this.#filmsListSection, this.#container);

      this.#renderNewFilmCards();

      if (this.#filmCards.length > FILM_CARDS_COUNT_PER_STEP) {
        render(this.#showMoreButton, this.#filmsListSection.element);

        this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
      }
    }
  };

  constructor(targetContainer, filmCardModel) {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
  }

  init = () => {
    this.#filmCards = [...this.#cardModel.filmCards];
    this.#renderBoard();
  };
}
