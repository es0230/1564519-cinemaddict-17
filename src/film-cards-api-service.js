import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmCardsApiService extends ApiService {
  get filmCards() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

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
}
