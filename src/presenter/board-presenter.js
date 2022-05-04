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

  init = (targetContainer, filmCardModel) => {
    this.#container = targetContainer;
    this.#cardModel = filmCardModel;
    this.#filmCards = [...this.#cardModel.filmCards];

    render(this.#filmsListSection, this.#container);

    const filmsListItemsContainer = this.#container.querySelector('.films-list__container');
    for (let i = 0; i < this.#filmCards.length; i++) {
      render(new FilmCardView(this.#filmCards[i]), filmsListItemsContainer);
    }

    const filmCards = filmsListItemsContainer.querySelectorAll('.film-card__link');
    filmCards.forEach((filmCard, i) => {
      filmCard.addEventListener('click', () => {
        const bodyElement = document.querySelector('body');
        render(new FilmPopupView(this.#filmCards[i],), bodyElement);
        const closeButton = document.querySelector('.film-details__close-btn');
        closeButton.addEventListener('click', () => {
          const popup = document.querySelector('.film-details');
          popup.remove();
        });
      });
    });

    render(new ShowMoreButtonView(), this.#filmsListSection.element);
  };
}
