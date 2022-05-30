import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = (filmCount) => `<p>${filmCount} movies inside</p>`;

export default class FooterView extends AbstractView {
  #filmCount = null;

  constructor(filmCards) {
    super();
    this.#filmCount = filmCards.length;
  }

  get template() {
    return createFooterTemplate(this.#filmCount);
  }
}
