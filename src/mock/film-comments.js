import { getRandomInteger } from '../util.js';
import { MOCKTEXT, COMMENT_EMOTIONS, FIRST_NAMES, LAST_NAMES } from '../const.js';

const generateCommentText = () => `${MOCKTEXT.split('. ', getRandomInteger(1, 5)).join('. ')}.`;
const generateCommentAuthor = () => `${FIRST_NAMES[getRandomInteger(0, FIRST_NAMES.length - 1)]} ${LAST_NAMES[getRandomInteger(0, LAST_NAMES.length - 1)]}`;
const generateCommentTime = () => `${getRandomInteger(0, 23)}:${getRandomInteger(0,5)}${getRandomInteger(0,9)}`;

const generateComment = () => ({
  text: generateCommentText(),
  emotion: COMMENT_EMOTIONS[getRandomInteger(0, COMMENT_EMOTIONS.length - 1)],
  author: generateCommentAuthor(),
  date: `2022/03/20 ${generateCommentTime()}`,
});

export {generateComment};
