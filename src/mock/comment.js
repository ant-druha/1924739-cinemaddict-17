import {getRandomName} from './film';
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

const submitComment = (text, emoji, isGlobal, date = dayjs()) => {
  const commentId = generateCommentId();
  if (isGlobal) {
    return {
      id: commentId,
      author: getRandomName(),
      comment: text,
      date: date,
      emotion: emoji
    };
  }
  return {
    id: commentId,
    comment: text,
    emotion: emoji
  };
};

export {submitComment};
