import ApiService from '../framework/api-service.js';
import { RequestMethod } from '../const.js';

export default class FilmCommentsApiService extends ApiService {
  #filmCards = null;

  getComments = async (filmId) => {
    const response = await this._load({url: `comments/${filmId}`});
    return ApiService.parseResponse(response);
  };


  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: RequestMethod.DELETE,
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response.status === 200;
  };

  addComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: RequestMethod.POST,
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response.status === 200;
  };
}
