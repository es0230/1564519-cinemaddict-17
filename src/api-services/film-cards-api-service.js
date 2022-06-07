import ApiService from '../framework/api-service.js';
import { RequestMethod } from '../const.js';

export default class FilmCardsApiService extends ApiService {

  get filmCards() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilmCard = async (filmCard) => {
    const response = await this._load({
      url: `movies/${filmCard.id}`,
      method: RequestMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(filmCard)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (filmCard) => {
    const adaptedFilmCard = {
      ...filmCard,
      'film_info': filmCard.filmInfo,
      'user_details': filmCard.userDetails,
    };

    delete adaptedFilmCard.filmInfo;
    delete adaptedFilmCard.userDetails;

    adaptedFilmCard['film_info'] = {
      ...adaptedFilmCard['film_info'],
      ['alternative_title']: adaptedFilmCard['film_info'].originalTitle,
      ['total_rating']: adaptedFilmCard['film_info'].totalRating,
      ['age_rating']: adaptedFilmCard['film_info'].ageRating,
    };

    delete adaptedFilmCard['film_info'].originalTitle;
    delete adaptedFilmCard['film_info'].totalRating;
    delete adaptedFilmCard['film_info'].ageRating;

    adaptedFilmCard['user_details'] = {
      ...adaptedFilmCard['user_details'],
      ['alredy_watched']: adaptedFilmCard['user_details'].watched,
      ['watching_date']: adaptedFilmCard['user_details'].watchingDate,
    };

    delete adaptedFilmCard['user_details'].watched;
    delete adaptedFilmCard['user_details'].watchingDate;

    return adaptedFilmCard;
  };
}
