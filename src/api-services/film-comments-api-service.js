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

  addComment = async (filmId, localComment) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: RequestMethod.POST,
      body: JSON.stringify(this.#adaptToServer(localComment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (comment) => {
    const adaptedComment = {
      ...comment,
      'comment': comment.text,
    };

    delete adaptedComment.text;

    return adaptedComment;
  };
}
