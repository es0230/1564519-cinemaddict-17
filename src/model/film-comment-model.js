import Observable from '../framework/observable.js';

export default class FilmCommentModel extends Observable{
  #filmCommentsApiService = null;

  constructor(filmCommentsApiService) {
    super();
    this.#filmCommentsApiService = filmCommentsApiService;
  }

  getFilmComments = (filmId) => this.#filmCommentsApiService.getComments(filmId);

  addComment = (updateType, update) => {
    //переписать через запросы
    //this.#filmComments = [
    //  update,
    //  ...this.#filmComments,
    //];

    //this._notify(updateType, update);
  };

  deleteComment = async (updateType, update, commentId) => {
    const isDeleteSucceeded = await this.#filmCommentsApiService.deleteComment(commentId.id);

    if (isDeleteSucceeded) {
      this._notify(updateType, update);
    }
  };
}
