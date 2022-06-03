import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film-data.js';


export default class FilmCardModel extends Observable{
  #filmCards = Array.from({length: 14}, generateFilm);

  get filmCards() {
    return this.#filmCards;
  }

  updateCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);

    this.#filmCards = [
      ...this.#filmCards.slice(0, index),
      update,
      ...this.#filmCards.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addCard = (updateType, update) => {
    this.#filmCards = [
      update,
      ...this.#filmCards,
    ];

    this._notify(updateType, update);
  };

  deleteCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);

    this.#filmCards = [
      ...this.#filmCards.slice(0, index),
      ...this.#filmCards.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}

