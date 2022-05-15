import AbstractView from '../framework/view/abstract-view.js';

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

const createFilmPopupTemplate = (filmCard) => {
  const {poster, title, originalTitle, rating, director, screenwriter, actors, releaseYear, duration, genre, description, commentsCount, watchlist, watched, favorite} = filmCard;

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">18+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${originalTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${screenwriter}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors[0]}, ${actors[1]}, ${actors[2]}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">30 March ${releaseYear}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${duration}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">USA</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genres</td>
                        <td class="film-details__cell">
                          <span class="film-details__genre">${genre}</span>
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
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount.split(' ')[0]}</span></h3>

                  <ul class="film-details__comments-list"></ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label"></div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class FilmPopupView extends AbstractView{
  #filmCard = null;

  constructor (filmCard) {
    super();
    this.#filmCard = filmCard;
  }

  get template() {
    return createFilmPopupTemplate(this.#filmCard);
  }

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

  setControlButtonClickHandler = (callback) => {
    this._callback.controlButtonClick = callback;
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#controlButtonClickHandler);
  };

  #controlButtonClickHandler = (evt) => {
    if (evt.target.dataset.controlType) {
      evt.preventDefault();
      const controlType = evt.target.dataset.controlType;
      this._callback.controlButtonClick(controlType);
    }
  };
}
