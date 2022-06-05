import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmCommentModel extends Observable{
  #filmComments = new Set();
  #filmCommentsApiService = null;

  constructor(filmCommentsApiService) {
    super();
    this.#filmCommentsApiService = filmCommentsApiService;
  }

  get filmComments() {
    return this.#filmComments;
  }

  getFilmComments = (filmId) => this.#filmCommentsApiService.getComments(filmId);

  addComment = (updateType, update) => {
    this.#filmComments = [
      update,
      ...this.#filmComments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#filmComments.findIndex((filmCard) => filmCard.id === update.id);

    this.#filmComments = [
      ...this.#filmComments.slice(0, index),
      ...this.#filmComments.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  #adaptToClient = (filmComment) => {
    const adaptedFilmComment = {
      ...filmComment,
      text: filmComment.comment,
    };

    delete adaptedFilmComment.comment;

    return adaptedFilmComment;
  };
}
