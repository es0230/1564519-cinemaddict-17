import Observable from '../framework/observable.js';

export default class FilmCommentModel extends Observable{
  #filmCommentsApiService = null;
  #lastRequestedFilmComments = null;

  constructor(filmCommentsApiService) {
    super();
    this.#filmCommentsApiService = filmCommentsApiService;
  }

  get lastRequestedFilmComments() {
    return this.#lastRequestedFilmComments;
  }

  getFilmComments = async (filmId) => {
    this.#lastRequestedFilmComments = await this.#filmCommentsApiService.getComments(filmId);
    return this.#lastRequestedFilmComments;
  };

  addComment = async (updateType, requestInfo) => {
    try {
      const response = await this.#filmCommentsApiService.addComment(requestInfo.filmId, requestInfo.comment);
      const updatedFilmCard = this.#adaptToClient(response.movie);
      this.#lastRequestedFilmComments = response.comments;
      this._notify(updateType, updatedFilmCard);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update, requestInfo) => {
    const isDeleteSucceeded = await this.#filmCommentsApiService.deleteComment(requestInfo.id);

    if (isDeleteSucceeded) {
      const index = this.#lastRequestedFilmComments.findIndex((comment) => comment.id === requestInfo.id);
      this.#lastRequestedFilmComments = [
        ...this.#lastRequestedFilmComments.slice(0, index),
        ...this.#lastRequestedFilmComments.slice(index + 1),
      ];
      this._notify(updateType, update);
    }
  };

  #adaptToClient = (filmCard) => {
    const adaptedFilmCard = {
      ...filmCard,
      filmInfo: filmCard['film_info'],
      userDetails: filmCard['user_details'],
    };

    delete adaptedFilmCard['film_info'];
    delete adaptedFilmCard['user_details'];

    adaptedFilmCard.filmInfo = {
      ...adaptedFilmCard.filmInfo,
      originalTitle: adaptedFilmCard.filmInfo['alternative_title'],
      totalRating: adaptedFilmCard.filmInfo['total_rating'],
      ageRating: adaptedFilmCard.filmInfo['age_rating'],
    };

    delete adaptedFilmCard.filmInfo['alternative_title'];
    delete adaptedFilmCard.filmInfo['total_rating'];
    delete adaptedFilmCard.filmInfo['age_rating'];

    adaptedFilmCard.userDetails = {
      ...adaptedFilmCard.userDetails,
      watched: adaptedFilmCard.userDetails['alredy_watched'],
      watchingDate: adaptedFilmCard.userDetails['watching_date'],
    };

    delete adaptedFilmCard.userDetails['alredy_watched'];
    delete adaptedFilmCard.userDetails['watching_date'];

    return adaptedFilmCard;
  };
}
