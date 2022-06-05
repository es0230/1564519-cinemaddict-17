import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';


export default class FilmCardModel extends Observable{
  #filmCards = [];
  #filmCardsApiService = null;

  constructor(filmCardsApiService) {
    super();
    this.#filmCardsApiService = filmCardsApiService;
  }

  get filmCards() {
    return this.#filmCards;
  }

  init = async () => {
    try {
      const filmCards = await this.#filmCardsApiService.filmCards;
      this.#filmCards = filmCards.map(this.#adaptToClient);
    } catch(err) {
      this.#filmCards = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateCard = async (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);

    try {
      const response = await this.#filmCardsApiService.updateFilmCard(update);
      const updatedCard = this.#adaptToClient(response);
      this.#filmCards = [
        ...this.#filmCards.slice(0, index),
        updatedCard,
        ...this.#filmCards.slice(index + 1)
      ];

      this._notify(updateType, updatedCard);
    } catch(err) {
      throw new Error('Can\'t update film card');
    }
  };

  addCard = (updateType, update) => {
    this.#filmCards = [
      update,
      ...this.#filmCards,
    ];

    this._notify(updateType, update);
  };

  deleteCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);

    this.#filmCards = [
      ...this.#filmCards.slice(0, index),
      ...this.#filmCards.slice(index + 1)
    ];

    this._notify(updateType, update);
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

