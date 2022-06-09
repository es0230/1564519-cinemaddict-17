import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import he from 'he';

const createFilmCommentTemplate = (commentItem) => {
  const {id, comment, emotion, author, date, isDeleteButtonDisabled, isDeleting} = commentItem;
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
                <button class="film-details__comment-delete" data-comment-id="${id}" ${isDeleteButtonDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
              </p>
            </div>
          </li>`;
};

export default class FilmCommentView extends AbstractStatefulView {
  _state = null;

  constructor(comment) {
    super();
    this._state = FilmCommentView.parseCommentToState(comment);
  }

  get template() {
    return createFilmCommentTemplate(this._state);
  }

  get state() {
    return this._state;
  }

  static parseCommentToState = (comment) => ({
    ...comment,
    isDeleteButtonDisabled: false,
    isDeleting: false,
  });

  static parseStateToComment = (state) => {
    const comment = {...state};

    delete comment.isDeleteButtonDisabled;
    delete comment.isDeleting;
  };

  _restoreHandlers = () => {

  };

  //setDeleteClickHandler = (callback) => {
  //  this._callback.deleteClick = callback;
  //  this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteClickHandler);
  //};

  //#deleteClickHandler = (evt) => {
  //  evt.preventDefault();
  //  this._callback.deleteClick(this);
  //};
}
