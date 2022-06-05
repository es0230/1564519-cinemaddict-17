import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmCommentsApiService extends ApiService {
  #filmCards = null;

  constructor(endPoint, authorization, filmCardModel) {
    super(endPoint, authorization);
    this.#filmCards = filmCardModel;
  }

  getComments = (filmId) =>
    this._load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse);

  updateFilmCard = async (filmCard) => {
    const response = await this._load({
      url: `movies/${filmCard.id}`,
      method: Method.PUT,
      body: JSON.stringify(filmCard),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (filmComment) => {
    const adaptedFilmComment = {
      ...filmComment,
      comment: filmComment.text,
    };

    delete adaptedFilmComment.text;

    return adaptedFilmComment;
  };
}
