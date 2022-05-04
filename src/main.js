import {render, RenderPosition} from './render.js';
import HeaderProfileView from './view/header-profile-view.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilmModel from './model/film-model.js';

const header = document.querySelector('header');
const main = document.querySelector('.main');

render(new HeaderProfileView('Movie Buff', 'images/bitmap@2x.png'), header, RenderPosition.BEFOREEND);

const filmModel = new FilmModel();
const filmsPresenter = new FilmsListPresenter(main, filmModel);

filmsPresenter.init();
