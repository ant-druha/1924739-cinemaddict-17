import {render, RenderPosition} from './framework/render.js';
import UserProfileView from './view/user-profile-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmModel from './model/film-model.js';

const header = document.querySelector('header');
const main = document.querySelector('.main');

render(new UserProfileView('Movie Buff', 'images/bitmap@2x.png'), header, RenderPosition.BEFOREEND);

const filmModel = new FilmModel();
const filmsPresenter = new FilmsPresenter(main, filmModel);

filmsPresenter.init();
