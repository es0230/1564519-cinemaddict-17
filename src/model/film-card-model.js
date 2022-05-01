import { generateFilm } from '../mock/film-data.js';


export default class FilmCardModel {
  filmCards = Array.from({length: 5}, generateFilm);

  getFilmCards = () => this.filmCards;
}
