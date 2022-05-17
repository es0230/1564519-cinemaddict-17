
import UserRatingView from './view/user-rank-view.js';
import FilmsSectionView from './view/films-section-view.js';
import FilmsPresenter from './presenter/board-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import { render } from './framework/render.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

const filmCardModel = new FilmCardModel();


render(new UserRatingView(), siteHeader);

const filmContainer = new FilmsSectionView();
render(filmContainer, siteMain);

const filmsPresenter = new FilmsPresenter(filmContainer.element, filmCardModel);
filmsPresenter.init();
