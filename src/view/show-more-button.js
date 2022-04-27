import { createElement } from '../render.js';

const createNewFilterTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class NewFilterView {
  getTemplate() {
    return createNewFilterTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
