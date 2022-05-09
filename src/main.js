import FilterView from './view/filters.js';
import UserRatingView from './view/user-rank.js';
import NavigationView from './view/navigation.js';
import FilmsSectionView from './view/films-section.js';
import FilmsPresenter from './presenter/board-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import { render } from './framework/render.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

const filmCardModel = new FilmCardModel();


render(new UserRatingView(), siteHeader);

render(new NavigationView(), siteMain);
render(new FilterView(), siteMain);
render(new FilmsSectionView(), siteMain);

const filmContainer = document.querySelector('.films');
const filmsPresenter = new FilmsPresenter(filmContainer, filmCardModel);

filmsPresenter.init();
