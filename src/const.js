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
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const RequestMethod = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;

const AUTHORIZATION = 'Basic qsdf261q3llpf099';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

export { SHAKE_ANIMATION_TIMEOUT, SHAKE_CLASS_NAME, RequestMethod, AUTHORIZATION, END_POINT, FilterType, UserAction, UpdateType, EmojiTypes, SortType};
