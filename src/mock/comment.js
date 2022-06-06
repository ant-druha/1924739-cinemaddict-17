import {getRandomInteger} from '../util/common';
import {commentEmotions} from '../const';
import {getRandomDate, getRandomName, getRandomValue} from './film';

const createCommentIdGenerator = () => {
  let id = 0;
  return function () {
    const currentId = id;
    id++;
    return currentId;
  };
};

const generateCommentId = createCommentIdGenerator();

const getRandomComment = () => {
  const names = [
    'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];

  return getRandomValue(names, getRandomInteger(0, names.length));
};

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


export {generateComment};
