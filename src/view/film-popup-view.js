import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import FilmCommentView from '../view/film-popup-comment-view.js';
import { render } from '../framework/render.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { EmojiTypes } from '../const.js';

dayjs.extend(duration);

const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;

const ACTIVE_CONTROL_BUTTON_CLASS = 'film-details__control-button--active';

const WATCHLIST_CONTROL_BUTTON_TEXT = {
  INACTIVE: 'Add to watchlist',
  ACTIVE: 'Already in watchlist'
};

const WATCHED_CONTROL_BUTTON_TEXT = {
  INACTIVE: 'Add to watched',
  ACTIVE: 'Already watched'
};

const FAVORITE_CONTROL_BUTTON_TEXT = {
  INACTIVE: 'Add to favorites',
  ACTIVE: 'Already favorite'
};

const createFilmPopupTemplate = (filmCardState) => {
  const {title, originalTitle, totalRating, poster, ageRating, director, writers, actors, release, runtime, genre, description} = filmCardState.filmInfo;
  const {watchlist, watched, favorite} = filmCardState.userDetails;
  const {currentEmotion, newCommentText, commentIds, isCommentAdding} = filmCardState;

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${originalTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${totalRating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${dayjs(release.date).format('DD MMMM YYYY')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${dayjs.duration({hours: Math.floor(runtime / 60), minutes: runtime % 60}).format('H [h] m [m]')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">USA</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${genre.length === 1 ? 'Genre' : 'Genres'}</td>
                        <td class="film-details__cell">
                          <span class="film-details__genre">${genre.join(', ')}</span>
                        </td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" data-control-type="watchlist" class="film-details__control-button film-details__control-button--watchlist ${watchlist ? ACTIVE_CONTROL_BUTTON_CLASS : ''}" id="watchlist" name="watchlist">${watchlist ? WATCHLIST_CONTROL_BUTTON_TEXT.ACTIVE : WATCHLIST_CONTROL_BUTTON_TEXT.INACTIVE}</button>
                  <button type="button" data-control-type="watched" class="film-details__control-button film-details__control-button--watched ${watched ? ACTIVE_CONTROL_BUTTON_CLASS : ''}" id="watched" name="watched">${watched ? WATCHED_CONTROL_BUTTON_TEXT.ACTIVE : WATCHED_CONTROL_BUTTON_TEXT.INACTIVE}</button>
                  <button type="button" data-control-type="favorite" class="film-details__control-button film-details__control-button--favorite ${favorite ? ACTIVE_CONTROL_BUTTON_CLASS : ''}" id="favorite" name="favorite">${favorite ? FAVORITE_CONTROL_BUTTON_TEXT.ACTIVE : FAVORITE_CONTROL_BUTTON_TEXT.INACTIVE}</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentIds.length}</span></h3>

                  <ul class="film-details__comments-list">

                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">
                      ${currentEmotion === null ? '' : `<img src="images/emoji/${currentEmotion}.png" width="55" height="55" alt="emoji-${currentEmotion}"></img>`}
                    </div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isCommentAdding ? 'disabled' : ''}>${newCommentText !== null ? newCommentText : ''}</textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img data-emoji-type="${EmojiTypes.SMILE}" src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img data-emoji-type="${EmojiTypes.SLEEPING}" src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img data-emoji-type="${EmojiTypes.PUKE}" src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img data-emoji-type="${EmojiTypes.ANGRY}" src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class FilmPopupView extends AbstractStatefulView{
  _state = null;
  #commentModel = null;

  constructor (filmCard, commentModel) {
    super();
    this._state = FilmPopupView.parseCardToState(filmCard);
    this.#commentModel = commentModel;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._state);
  }

  get state() {
    return this._state;
  }

  get filmCard() {
    return FilmPopupView.parseStateToCard(this._state);
  }

  static parseCardToState = (filmCard) => ({...filmCard,
    currentEmotion: null,
    newCommentText: null,
    commentViewList: null,
    commentIds: filmCard.comments,
    comments: null,
    isCommentAdding: false,
  });

  static parseStateToCard = (filmCardState) => { // при закрытии
    const filmCard = {...filmCardState};
    filmCard.comments = filmCardState.commentIds;

    delete filmCard.currentEmotion;
    delete filmCard.newCommentText;
    delete filmCard.commentViewList;
    delete filmCard.commentIds;
    delete filmCard.isCommentAdding;

    return filmCard;
  };

  #renderFilmComment = (commentView) => {
    render(commentView, this.element.querySelector('.film-details__comments-list'));
  };

  renderFilmComments (comments) {
    this._state.comments = comments;
    if (this._state.commentViewList === null) {
      this._state.commentViewList = Array.from({length: this._state.comments.length}, (el, i) => new FilmCommentView(this._state.comments[i]));
    }
    this._state.commentViewList.forEach((comment) => this.#renderFilmComment(comment));
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      newCommentText: evt.target.value,
    });
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    const clickedEmojiType = evt.target.dataset.emojiType;
    if (clickedEmojiType) {
      this.updateElement({
        currentEmotion: clickedEmojiType
      });
      this.renderFilmComments(this._state.comments);
    }
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setEscKeyDownHandler = (callback) => {
    this._callback.escKeyDown = callback;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._callback.escKeyDown();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  setCommentDeleteButtonClickHandler = (callback) => {
    this._callback.commentDeleteButtonClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#commentDeleteButtonClickHandler);
  };

  #commentDeleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'BUTTON') {
      this._callback.commentDeleteButtonClick(evt.target.dataset.commentId);
    }
  };

  setCommentAddHandler = (callback) => {
    this._callback.commentAdd = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentAddHandler);
  };

  #commentAddHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      this._callback.commentAdd(this._state.id, this.#getNewCommentInfo());
    }
  };

  setControlButtonClickHandler = (callback) => {
    this._callback.controlButtonClick = callback;
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#controlButtonClickHandler);
  };

  #controlButtonClickHandler = (evt) => {
    if (evt.target.dataset.controlType) {
      evt.preventDefault();
      const clickedControlType = evt.target.dataset.controlType;
      this._callback.controlButtonClick(clickedControlType);
    }
  };

  #getNewCommentInfo = () => ({
    text: this._state.newCommentText,
    emotion: this._state.currentEmotion,
  });

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#commentAddHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setControlButtonClickHandler(this._callback.controlButtonClick);
  };

  shakeOnAdd(callback) {
    this.element.querySelector('.film-details__new-comment').classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.element.querySelector('.film-details__new-comment').classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
