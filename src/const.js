const MOCKTEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const COMMENT_EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const FIRST_NAMES = [
  'Dale',
  'Harry',
  'James',
  'Bobby',
  'Laura',
  'Donna',
  'Audrey',
  'Shelly'
];

const LAST_NAMES = [
  'Cooper',
  'Truman',
  'Hurley',
  'Briggs',
  'Palmer',
  'Heyward',
  'Horne',
  'Johnson'
];

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'totalRating',
};

const EmojiTypes = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const FilterType = {
  ALL: 'filmCards',
  WATCHLIST: 'watchlist',
  HISTORY: 'watched',
  FAVORITES: 'favorite',
};

const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_CARD: 'ADD_CARD',
  DELETE_CARD: 'DELETE_CARD',

};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { FilterType, UserAction, UpdateType, EmojiTypes, SortType, MOCKTEXT, COMMENT_EMOTIONS, FIRST_NAMES, LAST_NAMES};
