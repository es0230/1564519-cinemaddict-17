import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filterType = FilterType.ALL;

  get filterType() {
    return this.#filterType;
  }

  setFilter = (updateType, filterType) => {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  };
}
