import {render, RenderPosition} from './framework/render.js';
import UserProfileView from './view/user-profile-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmModel from './model/film-model.js';
import FilterPresenter from './presenter/filter-presenter';
import FilterModel from './model/filter-model';
import CommentModel from './model/comment-model';

const header = document.querySelector('header');
const main = document.querySelector('.main');

render(new UserProfileView('Movie Buff', 'images/bitmap@2x.png'), header, RenderPosition.BEFOREEND);

const commentModel = new CommentModel();
const filmModel = new FilmModel(commentModel);
const filterModel = new FilterModel();
const filmsPresenter = new FilmsPresenter(main, filmModel, commentModel, filterModel);
const filterPresenter = new FilterPresenter(main, filmModel, filterModel);

filterPresenter.init();
filmsPresenter.init();
