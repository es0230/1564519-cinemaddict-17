import FilmsSectionView from './view/films-section-view.js';
import FilmsPresenter from './presenter/film-board-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import FilmCommentModel from './model/film-comment-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmCardsApiService from './api-services/film-cards-api-service.js';
import FilmCommentsApiService from './api-services/film-comments-api-service.js';

import { AUTHORIZATION, END_POINT } from './const.js';
import { render } from './framework/render.js';


const siteMain = document.querySelector('.main');

const filmCommentModel = new FilmCommentModel(new FilmCommentsApiService(END_POINT, AUTHORIZATION));
const filmCardModel = new FilmCardModel(new FilmCardsApiService(END_POINT, AUTHORIZATION));
filmCardModel.init();

const filterModel = new FilterModel();

const filmContainer = new FilmsSectionView();
render(filmContainer, siteMain);

const filmsPresenter = new FilmsPresenter(filmContainer.element, filmCardModel, filmCommentModel, filterModel);
filmsPresenter.init();

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmCardModel);
filterPresenter.init();


