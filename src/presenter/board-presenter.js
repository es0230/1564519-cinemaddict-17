import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListSectionView from '../view/films-list.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import NavigationView from '../view/navigation.js';
import { render } from '../framework/render.js';

const FILM_CARDS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = new ShowMoreButtonView();
  #noFilmCardsSection = new NoFilmCardsView();
  #navigationBlock = null;
  #filmPopupComponent = null;
  #container = null;
  #cardModel = null;
  #filmCards = null;
  #filmCardsToRender = null;
  #renderedFilmCardsCount = 0;

  #renderFilmCard = (filmCard) => {
    if (filmCard) {
      const filmCardComponent = new FilmCardView(filmCard);
      filmCardComponent.setClickHandler(this.#handleFilmCardClick(filmCardComponent.filmCard));
      render(filmCardComponent, this.#container.querySelector('.films-list__container'));
    }
  };

  #renderFilmPopup = (filmCard) => {
    if (this.#filmPopupComponent) {
      this.#handlePopupClosing();
    }
    this.#filmPopupComponent = new FilmPopupView(filmCard);
    this.#filmPopupComponent.setClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    render(this.#filmPopupComponent, document.querySelector('body'));
  };

  #renderNewFilmCards = () => {
    for (let i = this.#renderedFilmCardsCount; i < this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP; i++) {
      this.#renderFilmCard(this.#filmCardsToRender[i]);
    }

    if (this.#filmCardsToRender.length > FILM_CARDS_COUNT_PER_STEP) {
      render(this.#showMoreButton, this.#filmsListSection.element);

      this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    }

    this.#renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP < this.#filmCardsToRender.length ? this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP : this.#filmCardsToRender.length;

    if (this.#filmCardsToRender.length <= this.#renderedFilmCardsCount) {
      this.#showMoreButton.element.remove();
    }
  };

  #handleNavigationLinkClick = (category) => {
    this.#filmCardsToRender = this.#navigationBlock[category];
    this.#renderedFilmCardsCount = 0;
    this.#filmsListSection.element.querySelectorAll('.film-card').forEach((el) => el.remove());
    this.#renderNewFilmCards();
  };

  #handleFilmCardClick = (cardData) => () => this.#renderFilmPopup(cardData);

  #handleShowMoreButtonClick = () => {
    this.#renderNewFilmCards();

    if (this.#filmCardsToRender.length <= this.#renderedFilmCardsCount) {
      this.#showMoreButton.element.remove();
    }
  };

  #handlePopupClosing = () => {
    this.#filmPopupComponent.element.remove();
  };

  #renderNavigationBlock = () => {
    const mainElement = document.querySelector('.main');
    this.#navigationBlock = new NavigationView(this.#cardModel);
    render(this.#navigationBlock, mainElement, 'afterbegin');
    this.#navigationBlock.setClickHandler(this.#handleNavigationLinkClick);
  };

  #renderBoard = () => {
    if (this.#filmCardsToRender.length === 0) {
      render(this.#noFilmCardsSection, this.#container);
    } else {
      render(this.#filmsListSection, this.#container);

      this.#renderNewFilmCards();
    }
  };

  constructor(targetContainer, filmCardModel) {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
  }

  init = () => {
    this.#filmCards = [...this.#cardModel.filmCards];
    this.#filmCardsToRender = this.#filmCards;
    this.#renderBoard();
    this.#renderNavigationBlock();
  };
}
