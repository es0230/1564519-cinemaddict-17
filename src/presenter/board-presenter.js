import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListSectionView from '../view/films-list.js';
import NoFilmCardsView from '../view/no-film-cards-view.js';
import { render } from '../render.js';

const FILM_CARDS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsListSection = new FilmsListSectionView();
  #showMoreButton = new ShowMoreButtonView();
  #noFilmCardsSection = new NoFilmCardsView();
  #container = null;
  #cardModel = null;
  #filmCards = null;
  #renderFilmCard = (filmCard) => {
    if (filmCard) {
      const filmCardComponent = new FilmCardView(filmCard);

      render(filmCardComponent, this.#container.querySelector('.films-list__container'));
    }
  };

  #renderFilmPopup = (filmCard) => {
    const bodyElement = document.querySelector('body');
    const filmPopupComponent = new FilmPopupView(filmCard);
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        filmPopupComponent.element.remove();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    render(filmPopupComponent, bodyElement);

    const closeButton = filmPopupComponent.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', () => {
      filmPopupComponent.element.remove();
    });
    document.addEventListener('keydown', onEscKeyDown);

  };

  constructor(targetContainer, filmCardModel) {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
  }

  init = () => {
    this.#filmCards = [...this.#cardModel.filmCards];
    this.#renderBoard();
  };

  #renderBoard = () => {
    let renderedFilmCardsCount = 0;

    if (this.#filmCards.length === 0) {
      render(this.#noFilmCardsSection, this.#container);
    } else {
      render(this.#filmsListSection, this.#container);

      const renderNewFilmCards = () => {
        for (let i = renderedFilmCardsCount; i < renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP; i++) {
          this.#renderFilmCard(this.#filmCards[i]);
        }
      };

      renderNewFilmCards();

      let filmCards;
      const addClickHandlersToNewCards = () => {
        filmCards = this.#container.querySelectorAll('.film-card__link');
        filmCards.forEach((filmCard, i) => {
          if (i >= renderedFilmCardsCount) {
            filmCard.addEventListener('click', () => {
              const existingPopup = document.querySelector('.film-details');
              if (existingPopup) {
                existingPopup.remove();
              }

              this.#renderFilmPopup(this.#filmCards[i]);
            });
          }
        });

        renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP < this.#filmCards.length ? renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP : this.#filmCards.length;
      };

      addClickHandlersToNewCards();

      if (this.#filmCards.length > FILM_CARDS_COUNT_PER_STEP) {
        render(this.#showMoreButton, this.#filmsListSection.element);

        this.#showMoreButton.element.addEventListener('click', (evt) => {
          evt.preventDefault();

          renderNewFilmCards();

          addClickHandlersToNewCards();

          if (this.#filmCards.length < renderedFilmCardsCount) {
            this.#showMoreButton.element.remove();
          }
        });
      }
    }
  };
}
