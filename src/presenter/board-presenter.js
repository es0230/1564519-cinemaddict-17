import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListSectionView from '../view/films-list.js';
import { render } from '../render.js';

export default class FilmsPresenter {
  #filmsListSection = new FilmsListSectionView();
  #container = null;
  #cardModel = null;
  #filmCards = null;
  #renderFilmCard = (filmCard) => {
    const filmCardComponent = new FilmCardView(filmCard);

    render(filmCardComponent, this.#container.querySelector('.films-list__container'));
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

  init = (targetContainer, filmCardModel) => {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
    this.#filmCards = [...this.#cardModel.filmCards];

    render(this.#filmsListSection, this.#container);

    for (let i = 0; i < this.#filmCards.length; i++) {
      this.#renderFilmCard(this.#filmCards[i]);
    }

    const filmCards = this.#container.querySelectorAll('.film-card__link');
    filmCards.forEach((filmCard, i) => {
      filmCard.addEventListener('click', () => {
        const existingPopup = document.querySelector('.film-details');
        if (existingPopup) {
          existingPopup.remove();
        }

        this.#renderFilmPopup(this.#filmCards[i]);
      });
    });

    render(new ShowMoreButtonView(), this.#filmsListSection.element);
  };
}
