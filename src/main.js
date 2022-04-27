import NewFilmCardView from './view/film-card.js';
import { render } from './render.js';

const main = document.querySelector('.main');
const filmsListContainer = document.querySelector('.films-list__container');

render(new NewFilmCardView(), main);
