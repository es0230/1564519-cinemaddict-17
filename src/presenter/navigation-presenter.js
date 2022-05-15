import NavigationView from '../view/navigation-view.js';

import { render } from '../framework/render.js';

export default class NavigationPresenter {
  #navigationBlock = null;
  #cardModel = null;
  #filmCardsToRender = null;
  #removeFilmCards = null;
  #renderFilmCards = null;
  #actualizeShowMoreButton = null;

  constructor(cardModel, filmCardsToRender, filmCardsRemover, filmCardsRenderer, showMoreButtonActualizer) {
    this.#cardModel = cardModel;
    this.#filmCardsToRender = filmCardsToRender;
    this.#removeFilmCards = filmCardsRemover;
    this.#renderFilmCards = filmCardsRenderer;
    this.#actualizeShowMoreButton = showMoreButtonActualizer;
  }

  init = () => {
    const mainElement = document.querySelector('.main');
    this.#navigationBlock = new NavigationView(this.#cardModel);
    render(this.#navigationBlock, mainElement, 'afterbegin');
    this.#navigationBlock.setClickHandler(this.#handleNavigationLinkClick);
  };

  #handleNavigationLinkClick = (category) => {
    this.#cardModel.filmCardsToRender = this.#navigationBlock[category];
    this.#filmCardsToRender = this.#cardModel.filmCardsToRender;
    this.#removeFilmCards();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
  };
}
