import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsListSectionView from '../view/films-list-view.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import NavigationView from '../view/navigation-view.js';
import FilmCardPresenter from './film-presenter.js';
//import NavigationPresenter from './navigation-presenter.js';
import { render } from '../framework/render.js';

const FILM_CARDS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = new ShowMoreButtonView();
  #noFilmCardsSection = new NoFilmCardsView();
  #navigationBlock = null;
  #container = null;
  #cardModel = null;
  #filmCards = null;
  #filmCardsToRender = null;
  #renderedFilmCardsCount = 0;

  #renderFilmCard = (filmCard) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListSection.element);
    filmCardPresenter.init(filmCard);
  };

  #renderFilmCards = (filmCardsToRender) => {
    for (let i = this.#renderedFilmCardsCount; i < this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP; i++) {
      this.#renderFilmCard(filmCardsToRender[i]);
    }
    this.#actualizeShowMoreButton();
    this.#renderedFilmCardsCount = Math.min(this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP, filmCardsToRender.length);
  };

  #actualizeShowMoreButton = () => {
    if (this.#filmCardsToRender.length === this.#renderedFilmCardsCount) {
      this.#showMoreButton.element.remove();
    } else {
      render(this.#showMoreButton, this.#filmsListSection.element);
      this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    }
  }; //хз может лучше по-другому назвать но ничего лучше не придумалось

  #handleNavigationLinkClick = (category) => {
    this.#filmCardsToRender = this.#navigationBlock[category];
    this.#removeFilmCards();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
  };

  #renderNavigationBlock = () => {
    //const navigationPresenter = new NavigationPresenter(this.#cardModel, this.#filmCardsToRender, this.#removeFilmCards, this.#renderFilmCards, this.#actualizeShowMoreButton);
    //navigationPresenter.init();
    const mainElement = document.querySelector('.main');
    this.#navigationBlock = new NavigationView(this.#cardModel);
    render(this.#navigationBlock, mainElement, 'afterbegin');
    //this.#navigationBlock.setClickHandler(this.#handleNavigationLinkClick);
  }; //

  #updateNavigationBlock = () => {
  };

  #removeFilmCards = () => {
    this.#renderedFilmCardsCount = 0;
    this.#filmsListSection.element.querySelectorAll('.film-card').forEach((el) => el.remove());
  };

  #renderBoard = () => {
    if (this.#filmCardsToRender.length === 0) {
      render(this.#noFilmCardsSection, this.#container);
    } else {
      render(this.#filmsListSection, this.#container);
    }
  };

  #handleCardControlChange = () => {

  };

  constructor(targetContainer, filmCardModel) {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
  }

  init = () => {
    this.#filmCards = [...this.#cardModel.filmCards];
    this.#filmCardsToRender = this.#filmCards;
    this.#renderBoard();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#renderNavigationBlock();
  };
}
