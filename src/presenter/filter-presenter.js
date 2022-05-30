import FilterView from '../view/filter-view.js';
import { UpdateType } from '../const.js';
import { RenderPosition } from '../framework/render.js';

import { remove, render, replace } from '../framework/render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmCardModel = null;

  #filterComponent = null;

  constructor(container, filterModel, filmCardModel) {
    this.#filterContainer = container;
    this.#filterModel = filterModel;
    this.#filmCardModel = filmCardModel;

    this.#filmCardModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.#filmCardModel.filmCards, this.#filterModel.filterType);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleFilterTypeChange = (filterType) => {
    if (filterType === this.#filterModel.filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
