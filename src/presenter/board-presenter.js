import FilmCardView from '../view/film-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListSectionView from '../view/films-list.js';
import { render } from '../render.js';

export default class FilmsPresenter {
  filmsListSection = new FilmsListSectionView();

  init = (targetContainer) => {
    this.container = targetContainer;

    render(this.filmsListSection, this.container);

    const filmsListItemsContainer = this.container.querySelector('.films-list__container');
    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), filmsListItemsContainer);
    }

    render(new ShowMoreButtonView(), this.filmsListSection.getElement());
  };
}
