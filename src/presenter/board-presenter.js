import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsListSectionView from '../view/films-list-view.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmCardPresenter from './film-presenter.js';
import {updateFilmCard} from '../util.js';
//import NavigationPresenter from './navigation-presenter.js';
import { render, remove } from '../framework/render.js';

const FILM_CARDS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #container = null;
  #cardModel = null;

  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = new ShowMoreButtonView();
  #noFilmCardsSection = new NoFilmCardsView();
  #navigationBlock = null;
  #sortSection = null;


  #filmCards = [];
  #filmCardsToRender = null;
  #renderedFilmCardsCount = 0;
  #filmBoardPresenter = new Map();

  constructor(targetContainer, filmCardModel) {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
  }

  init = () => {
    this.#filmCards = [...this.#cardModel.filmCards];
    this.#filmCardsToRender = this.#filmCards;
    this.#renderSortElement(this.#filmCards);
    this.#renderBoard();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#renderNavigationBlock();
  };

  #renderFilmCard = (filmCard) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListSection.element.querySelector('.films-list__container'), this.#handleFilmCardChange, this.#removePopups);
    filmCardPresenter.init(filmCard);
    this.#filmBoardPresenter.set(filmCard.id, filmCardPresenter);
  };

  #renderFilmCards = (filmCardsToRender) => {
    const cardsCountLimit = Math.min(this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP, filmCardsToRender.length);
    for (let i = this.#renderedFilmCardsCount; i < cardsCountLimit; i++) {
      this.#renderFilmCard(filmCardsToRender[i]);
    }
    this.#actualizeShowMoreButton();
    this.#renderedFilmCardsCount = cardsCountLimit;
  };

  #actualizeShowMoreButton = () => {
    if (this.#filmCardsToRender.length === this.#renderedFilmCardsCount) {
      this.#showMoreButton.element.remove();
    } else {
      render(this.#showMoreButton, this.#filmsListSection.element);
      this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };


  #handleFilmCardChange = (updatedFilmCard) => {
    this.#filmCards = updateFilmCard(this.#filmCards, updatedFilmCard);
    this.#filmBoardPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
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
    this.#navigationBlock.setClickHandler(this.#handleNavigationLinkClick);
  }; //

  #handleNavigationLinkClick = (category) => {
    this.#filmCardsToRender = this.#navigationBlock[category];
    this.#removeFilmCards();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
  };

  #removeFilmCards = () => {
    this.#filmBoardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmBoardPresenter.clear();
    this.#renderedFilmCardsCount = 0;
    remove(this.#showMoreButton);
  };

  #removePopups = () => {
    this.#filmBoardPresenter.forEach((presenter) => {
      if (presenter.popupOpened) {
        presenter.removePopup();
      }
    });
  };

  #renderBoard = () => {
    if (this.#filmCardsToRender.length === 0) {
      render(this.#noFilmCardsSection, this.#container);
    } else {
      render(this.#filmsListSection, this.#container);
    }
  };

  #renderSortElement = (cardModel) => {
    this.#sortSection = new SortView(cardModel);
    render(this.#sortSection, document.querySelector('.main'), 'afterbegin');
    this.#sortSection.setClickHandler(this.#handleSortClick);
  };

  #handleSortClick = (sortType) => {
    this.#filmCardsToRender = this.#sortSection[`${sortType}FilmCardOrder`];
    this.#removeFilmCards();
    this.#renderFilmCards(this.#filmCardsToRender);
  };
}
