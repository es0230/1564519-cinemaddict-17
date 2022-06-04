import FilmsSectionView from './view/films-section-view.js';
import FilmsPresenter from './presenter/film-board-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmCardsApiService from './film-cards-api-service.js';
import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic fsdf221q3llpf099';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteMain = document.querySelector('.main');

const filmCardModel = new FilmCardModel(new FilmCardsApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const filmContainer = new FilmsSectionView();
render(filmContainer, siteMain);

const filmsPresenter = new FilmsPresenter(filmContainer.element, filmCardModel, filterModel);
filmsPresenter.init();

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmCardModel);
filterPresenter.init();
