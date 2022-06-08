import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';

const createFilmCommentTemplate = (commentItem) => {
  const {id, comment, emotion, author, date} = commentItem;
  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
                <button class="film-details__comment-delete" data-comment-id="${id}" >Delete</button>
              </p>
            </div>
          </li>`;
};

export default class FilmCommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get comment() {
    return this.#comment;
  }

  get template() {
    return createFilmCommentTemplate(this.#comment);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(this);
  };
}
