import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsListSectionView from '../view/films-list-view.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import SortView from '../view/sort-view.js';
import FilmCardPresenter from './film-presenter.js';
import FooterView from '../view/footer-view.js';
import dayjs from 'dayjs';
import { render, remove, RenderPosition, replace } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

const FILM_CARDS_COUNT_PER_STEP = 5;
const DEFAULT_SORT_TYPE = 'default';

export default class FilmsPresenter {
  #container = null;
  #cardModel = null;
  #filterModel = null;

  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = null;
  #noFilmCardsSection = null;
  #sortSection = null;
  #currentSortType = DEFAULT_SORT_TYPE;
  #filterType = FilterType.ALL;
  #footerSection = null;
  #footerContainer = document.querySelector('.footer__statistics');

  #renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
  #filmBoardPresenter = new Map();

  constructor(targetContainer, filmCardModel, filterModel) {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
    this.#filterModel = filterModel;

    this.#cardModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filmCards() {
    this.#filterType = this.#filterModel.filterType;
    const filmCards = this.#cardModel.filmCards;
    const filteredFilmCards = filmCards.filter((el) => {
      if (this.#filterType === 'filmCards') {
        return true;
      }
      return el.userDetails[this.#filterType];
    });

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilmCards.sort((a, b) => dayjs(a.filmInfo.release[this.#currentSortType]).isBefore(dayjs(b.filmInfo.release[this.#currentSortType])) ? 1 : -1);
      case SortType.RATING:
        return filteredFilmCards.sort((a, b) => b.filmInfo[this.#currentSortType] - a.filmInfo[this.#currentSortType]);
    }
    return filteredFilmCards;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderBoard = () => {
    const filmCards = this.filmCards;
    const filmCardsCount = filmCards.length;

    if (filmCards.length === 0) {
      this.#renderNoFilmCards();
      return;
    }

    this.#renderSortElement();

    render(this.#filmsListSection, this.#container);
    this.#renderFilmCards(filmCards.slice(0, Math.min(filmCardsCount, this.#renderedFilmCardsCount)));
    if (filmCardsCount > this.#renderedFilmCardsCount) {
      this.#renderShowMoreButton();
    }

    if (!this.#footerSection) {
      this.#footerSection = new FooterView(this.#cardModel.filmCards);
      render(this.#footerSection, this.#footerContainer);
    }

  };

  #renderFilmCards = (filmCardsToRender) => {
    filmCardsToRender.forEach((task) => this.#renderFilmCard(task));
  };

  #renderFilmCard = (filmCard) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListSection.element.querySelector('.films-list__container'), this.#handleViewAction, this.#removePopups);
    filmCardPresenter.init(filmCard);
    this.#filmBoardPresenter.set(filmCard.id, filmCardPresenter);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton = new ShowMoreButtonView();
    this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButton, this.#filmsListSection.element);
  };

  #handleShowMoreButtonClick = () => {
    const filmCardsCount = this.filmCards.length;
    const cardsCountLimit = Math.min(this.#renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP, this.filmCards.length);
    const filmCards = this.filmCards.slice(this.#renderedFilmCardsCount, cardsCountLimit);

    this.#renderFilmCards(filmCards);
    this.#renderedFilmCardsCount = cardsCountLimit;

    if (this.#renderedFilmCardsCount === filmCardsCount) {
      remove(this.#showMoreButton);
    }
  };

  #removePopups = () => {
    this.#filmBoardPresenter.forEach((presenter) => {
      if (presenter.popupOpened) {
        presenter.removePopup();
      }
    });
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#cardModel.updateCard(updateType, update);
        break;
      case UserAction.ADD_CARD:
        this.#cardModel.addCard(updateType, update);
        break;
      case UserAction.DELETE_CARD:
        this.#cardModel.deleteCard(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmBoardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCardsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #clearBoard = ({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) => {
    const filmCardsCount = this.filmCards.length;

    this.#filmBoardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmBoardPresenter.clear();

    remove(this.#showMoreButton);

    if (this.#noFilmCardsSection) {
      remove(this.#noFilmCardsSection);
    }

    if (resetRenderedFilmCardsCount) {
      this.#renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCardsCount = Math.min(filmCardsCount, this.#renderedFilmCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderSortElement = () => {
    const prevSortSection = this.#sortSection;

    this.#sortSection = new SortView(this.#currentSortType);
    this.#sortSection.setClickHandler(this.#handleSortClick);

    if (prevSortSection === null) {
      render(this.#sortSection, document.querySelector('.main'), RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#sortSection, prevSortSection);
    remove(prevSortSection);
  };

  #handleSortClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCardsCount: true});
    this.#renderBoard();
  };

  #renderNoFilmCards = () => {
    this.#noFilmCardsSection = new NoFilmCardsView(this.#filterType);
    render(this.#noFilmCardsSection, this.#filmsListSection.element, RenderPosition.AFTERBEGIN);
  };
}
