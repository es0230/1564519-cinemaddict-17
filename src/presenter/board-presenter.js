import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsListSectionView from '../view/films-list-view.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmCardPresenter from './film-presenter.js';
import {updateFilmCard} from '../util.js';
//import NavigationPresenter from './navigation-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType } from '../const.js';

const FILM_CARDS_COUNT_PER_STEP = 5;
const DEFAULT_SORT_TYPE = 'default';

export default class FilmsPresenter {
  #container = null;
  #cardModel = null;

  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = new ShowMoreButtonView();
  #noFilmCardsSection = new NoFilmCardsView();
  #navigationBlock = null;
  #sortSection = null;
  #currentSortType = DEFAULT_SORT_TYPE;


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
    this.#filmCardsToRender = this.#filmCards.slice();
    this.#renderSortElement(this.#filmCards);
    this.#renderBoard();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#renderNavigationBlock(this.#cardModel);
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

  #handleShowMoreButtonClick = () => {
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
  };

  #renderNavigationBlock = (filmCards) => {
    const mainElement = document.querySelector('.main');
    this.#navigationBlock = new NavigationView(filmCards);
    render(this.#navigationBlock, mainElement, RenderPosition.AFTERBEGIN);
  }; //

  #handleNavigationLinkClick = (category) => {
    this.#filmCardsToRender = this.#navigationBlock[category];
    this.#removeFilmCards();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
  }; //

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

  #handleFilmCardChange = (updatedFilmCard) => {
    this.#filmCards = updateFilmCard(this.#filmCards, updatedFilmCard);
    this.#filmBoardPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
  };

  #renderSortElement = () => {
    this.#sortSection = new SortView();
    render(this.#sortSection, document.querySelector('.main'), RenderPosition.AFTERBEGIN);
    this.#sortSection.setClickHandler(this.#handleSortClick);
  };

  #handleSortClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    switch (sortType) {
      case SortType.DEFAULT:
        this.#filmCardsToRender = this.#filmCards.slice();
        break;
      case SortType.DATE:
        this.#filmCardsToRender.sort((a, b) => b.filmInfo.release[sortType] - a.filmInfo.release[sortType]);
        break;
      case SortType.RATING:
        this.#filmCardsToRender.sort((a, b) => b.filmInfo[sortType] - a.filmInfo[sortType]);
        break;
    }
    this.#removeFilmCards();
    this.#renderFilmCards(this.#filmCardsToRender);
    this.#actualizeShowMoreButton();
    this.#currentSortType = sortType;
  };
}
