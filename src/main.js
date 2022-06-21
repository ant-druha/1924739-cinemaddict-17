import FilmsPresenter from './presenter/films-presenter.js';
import FilmModel from './model/film-model.js';
import FilterPresenter from './presenter/filter-presenter';
import FilterModel from './model/filter-model';
import CommentModel from './model/comment-model';
import FilmsApiService from './films-api.service';
import UserProfilePresenter from './presenter/user-profile-presenter';

const AUTHORIZATION = 'Basic hS2dlw45ld4dl09sk4';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const header = document.querySelector('header');
const main = document.querySelector('.main');

const filmsApiService = new FilmsApiService(END_POINT, AUTHORIZATION);

const commentModel = new CommentModel(filmsApiService);
const filmModel = new FilmModel(filmsApiService, commentModel);
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(main, filmModel, filterModel);
const filterPresenter = new FilterPresenter(main, filmModel, filterModel);
const userProfilePresenter = new UserProfilePresenter(header, filmModel);

userProfilePresenter.init();
filterPresenter.init();
filmsPresenter.init();

filmModel.init();
