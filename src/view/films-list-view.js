import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListSectionTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsListSectionView extends AbstractView{
  get template() {
    return createFilmsListSectionTemplate();
  }
}
