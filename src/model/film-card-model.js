import { generateFilm } from '../mock/film-data.js';


export default class FilmCardModel {
  #filmCards = Array.from({length: 13}, generateFilm);

  get filmCards() {
    return this.#filmCards;
  }
}
