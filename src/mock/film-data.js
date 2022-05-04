import { getRandomInteger } from '../util.js';
import { MOCKTEXT } from '../const.js';

const filmPostersSrcs = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg'
];

const filmTitles = [
  'Made for Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm'
];

const filmGenres = [
  'Drama',
  'Comedy',
  'Thriller',
  'Action movie',
  'Horror movie',
  'Fantasy',
  'Sci-fi'
];

const generateFilmDescription = () => {
  const filmDescription = MOCKTEXT.split('. ', getRandomInteger(1, 5)).join('. ');
  if (filmDescription.length > 140) {
    return `${filmDescription.substring(0,139)  }...`;
  }
  return `${filmDescription}.`;
};

const generateFilm = () => {
  const filmNumber = getRandomInteger(0, filmPostersSrcs.length - 1);
  return {
    poster: `./images/posters/${filmPostersSrcs[filmNumber]}`,
    title: filmTitles[filmNumber],
    originalTitle: filmTitles[filmNumber],
    rating: `${getRandomInteger(1, 9)}.${getRandomInteger(1, 9)}`,
    director: 'Director\'s name',
    screenwriter: 'Screenwriter\'s name',
    actors: ['Actor 1', 'Actor 2', 'Actor 3'],
    releaseYear: getRandomInteger(1930, 1960),
    duration: `${getRandomInteger(1, 2)}h ${getRandomInteger(0, 59)}m`,
    genre: filmGenres[filmNumber],
    description: generateFilmDescription(),
    commentsCount: `${getRandomInteger(0, 10)} comments`,
  };
};

export {generateFilm};
