import {getRandomFloat, getRandomInteger} from '../util/common.js';
import {commentEmotions} from '../const.js';
import dayjs from 'dayjs';

const createCommentIdGenerator = () => {
  let id = 0;
  return function () {
    const currentId = id;
    id++;
    return currentId;
  };
};

const generateCommentId = createCommentIdGenerator();

const getRandomValue = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomName = () => {
  const names = [
    'Anthony Mann',
    'Anne Wigton',
    'Heinz Herald',
    'Ilya O\'Reilly'
  ];

  return getRandomValue(names, getRandomInteger(0, names.length));
};

const getRandomComment = () => {
  const names = [
    'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];

  return getRandomValue(names, getRandomInteger(0, names.length));
};

const getRandomDate = () => dayjs()
  .set('year', getRandomInteger(1965, 2021))
  .set('month', getRandomInteger(1, 12))
  .set('date', getRandomInteger(0, 30))
  .set('hour', getRandomInteger(1, 24))
  .set('minute', getRandomInteger(0, 60))
  .set('second', getRandomInteger(0, 60));

const generateComment = () => {
  const isGlobal = Boolean(getRandomInteger(0, 2));
  const commentId = generateCommentId();
  if (isGlobal) {
    return {
      id: commentId,
      author: getRandomName(),
      comment: getRandomComment(),
      date: getRandomDate(),
      emotion: getRandomValue(commentEmotions)
    };
  }
  return {
    id: commentId,
    comment: getRandomComment(),
    emotion: getRandomValue(commentEmotions)
  };
};

const generateDescription = () => {
  const descriptions = [
    'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  ];

  return getRandomValue(descriptions);
};
const generateTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Man with the Golden Arm',
    'The Great Flamarion',
  ];

  return getRandomValue(titles);
};

const generatePoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return `images/posters/${getRandomValue(posters)}`;
};

const getRandomSlice = (array, n) => array.sort(() => Math.random() - Math.random()).slice(0, n);

const generateWriters = () => {
  const writers = [
    'Takeshi Kitano',
    'Anne Wigton',
    'Heinz Herald'
  ];

  return getRandomSlice(writers, getRandomInteger(0, writers.length));
};

const generateGenres = () => {
  const genres = [
    'Drama',
    'Film-Noir',
    'Mystery',
    'Comedy',
    'Fantasy'
  ];

  return getRandomSlice(genres, Math.ceil(getRandomInteger(1, 3) / 2));
};

const generateActors = () => {
  const actors = [
    'Morgan Freeman',
    'Erich von Stroheim',
    'Dan Duryea',
    'Mary Beth Hughes'
  ];

  return getRandomSlice(actors, getRandomInteger(0, actors.length));
};

export const filmComments = new Map();

export const generateFilm = () => {
  const comments = [];
  for (let i = 0; i < getRandomInteger(0, 16); i++) {
    const comment = generateComment();
    comments.push(comment);
    filmComments.set(comment.id, comment);
  }

  return {
    id: 0,
    comments: comments.map((c) => c.id),
    filmInfo: {
      title: generateTitle(),
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: getRandomFloat(1, 5),
      poster: generatePoster(),
      ageRating: 0,
      director: getRandomName(),
      writers: generateWriters(),
      actors: generateActors(),
      release: {
        date: '2019-05-11T00:00:00.000Z',
        releaseCountry: 'Finland'
      },
      runtime: getRandomInteger(50, 135),
      genre: generateGenres(),
      description: generateDescription()
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: Boolean(getRandomInteger(0, 1))
    }
  };
};

export {getRandomSlice};
