import {getRandomInteger} from '../util/common.js';

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
const getRandomSlice = (array, n) => array.sort(() => Math.random() - Math.random()).slice(0, n);

export {getRandomSlice, getRandomName, getRandomValue};
