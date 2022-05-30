import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoFilmCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATCHLIST]: 'There are no favorite movies now',
};

const createNoFilmCardsTemplate = (filterType) => {
  const noFilmCardsTextValue = NoFilmCardsTextType[filterType];

  return  `<section class="films-list">
            <h2 class="films-list__title">${noFilmCardsTextValue}</h2>
          </section>`;
};

export default class NoFilmCardsView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFilmCardsTemplate(this.#filterType);
  }
}
