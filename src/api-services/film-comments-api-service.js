import ApiService from '../framework/api-service.js';
import { RequestMethod } from '../const.js';

const SUCCESSFUL_RESPONSE_STATUS = 200;

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

    return response.status === SUCCESSFUL_RESPONSE_STATUS;
  };

  addComment = async (filmId, localComment) =>
    await this._load({
      url: `comments/${filmId}`,
      method: RequestMethod.POST,
      body: JSON.stringify(this.#adaptToServer(localComment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse);

  #adaptToServer = (comment) => {
    const adaptedComment = {
      ...comment,
      'comment': comment.text,
    };

    delete adaptedComment.text;

    return adaptedComment;
  };
}
