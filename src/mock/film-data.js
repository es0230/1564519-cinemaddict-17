import { getRandomInteger, getRandomName } from '../util.js';
import { MOCKTEXT, FIRST_NAMES, LAST_NAMES } from '../const.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { generateComment } from './film-comments.js';

dayjs.extend(duration);

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

const countries = [
  'USA',
  'Canada',
  'USSR',
  'United Kingdom',
  'France',
  'Italy'
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
  const randomDate = `${getRandomInteger(1940, 1970)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)}`;
  return {
    id: nanoid(),
    comments: Array.from({length: getRandomInteger(0, 9)}, generateComment),
    filmInfo: {
      title: filmTitles[filmNumber],
      originalTitle: filmTitles[filmNumber],
      totalRating: `${getRandomInteger(1, 9)}.${getRandomInteger(1, 9)}`,
      poster: `./images/posters/${filmPostersSrcs[filmNumber]}`,
      ageRating: getRandomInteger(0, 6) * 3,
      director: getRandomName(FIRST_NAMES, LAST_NAMES),
      writers: Array.from({length: 2}, () => getRandomName(FIRST_NAMES, LAST_NAMES)),
      actors: Array.from({length: 4}, () => getRandomName(FIRST_NAMES, LAST_NAMES)),
      release: {
        date: dayjs(randomDate).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'),
        releaseCountry: countries[getRandomInteger(0, 5)]
      },
      runtime: getRandomInteger(50, 120),
      genre: [filmGenres[filmNumber]],
      description: generateFilmDescription(),
    },
    userDetails: {
      watchlist: Boolean(Math.round(getRandomInteger())),
      watched: Boolean(Math.round(getRandomInteger())),
      favorite: Boolean(Math.round(getRandomInteger())),
    },
  };
};

export {generateFilm};
