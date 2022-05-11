import FilterView from './view/filters.js';
import UserRatingView from './view/user-rank.js';
import FilmsSectionView from './view/films-section.js';
import FilmsPresenter from './presenter/board-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import { render } from './framework/render.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

const filmCardModel = new FilmCardModel();


render(new UserRatingView(), siteHeader);

render(new FilterView(), siteMain);

const filmContainer = new FilmsSectionView();
render(filmContainer, siteMain);

const filmsPresenter = new FilmsPresenter(filmContainer.element, filmCardModel); // спросить могу ли я передавать в презентер не модель напрямую а кусок вьюхи в которой лежит эта модель
filmsPresenter.init();
