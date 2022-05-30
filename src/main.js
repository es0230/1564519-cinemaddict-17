import UserRatingView from './view/user-rank-view.js';
import FilmsSectionView from './view/films-section-view.js';
import FilmsPresenter from './presenter/board-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

const filmCardModel = new FilmCardModel();
const filterModel = new FilterModel();


render(new UserRatingView(), siteHeader);

const filmContainer = new FilmsSectionView();
render(filmContainer, siteMain);

const filmsPresenter = new FilmsPresenter(filmContainer.element, filmCardModel, filterModel);
filmsPresenter.init();

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmCardModel);
filterPresenter.init();
