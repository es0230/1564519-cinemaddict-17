import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class FilmCardPresenter {
  #container = null;
  #changeData = null;
  #removePopups = null;
  #commentModel = null;

  #filmCardComponent = null;
  #filmPopupComponent = null;

  #filmCard = null;
  #filmComments = null;

  #popupOpened = false;
  #lastPopupScrollPosition = null;

  constructor (container, changeData, removePopups, commentModel) {
    this.#container = container;
    this.#changeData = changeData;
    this.#removePopups = removePopups;
    this.#commentModel = commentModel;
  }

  get filmPopupComponent () {
    return this.#filmPopupComponent;
  }

  init = (filmCard) => {
    this.#filmCard = filmCard;
    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmPopupView(filmCard, this.#commentModel, this.restoreScrollPosition);

    this.#filmCardComponent.setCardClickHandler(this.#handleFilmCardClick(this.#filmCardComponent.filmCard));
    this.#filmCardComponent.setControlClickHandler(this.#handleControlClick);

    this.#filmPopupComponent.setControlButtonClickHandler(this.#handleControlClick);
    this.#filmPopupComponent.setCommentDeleteButtonClickHandler(this.#handleCommentDeleteClick);
    this.#filmPopupComponent.setCommentAddHandler(this.#handleCommentAdd);
    this.#filmPopupComponent.setScrollHandler(this.#handlePopupScrolling);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (document.querySelector('body').contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    if (this.#popupOpened) {
      this.#filmPopupComponent.renderFilmComments(this.#commentModel.lastRequestedFilmComments);
      this.restoreScrollPosition();
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  };

  restoreScrollPosition = () => {
    this.#filmPopupComponent.element.scrollTo(0, this.#lastPopupScrollPosition);
  };

  #handleCommentDeleteClick = (targetCommentId) => {
    const targetCommentComponent = this.#filmPopupComponent.state.commentViewList.find((commentView) => commentView.state.id === targetCommentId);
    targetCommentComponent.updateElement({
      isDeleteButtonDisabled: true,
      isDeleting: true,
    });

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...this.#filmPopupComponent.filmCard, comments: [...this.#filmPopupComponent.filmCard.comments.filter((commentId) => targetCommentId !== commentId)]},
      {id: targetCommentId},
    );
    this.#filmComments = this.#filmComments.filter((comment) => comment.id !== targetCommentId);
    this.#filmPopupComponent.renderFilmComments(this.#filmComments);
  };

  setCommentDeleteAborting = (targetCommentId) => {
    const targetCommentComponent = this.#filmPopupComponent.state.commentViewList.find((commentView) => commentView.state.id === targetCommentId.id);
    const resetCommentState = () => {
      targetCommentComponent.updateElement({
        isDeleteButtonDisabled: false,
        isDeleting: false,
      });
    };

    targetCommentComponent.shake(resetCommentState);
  };

  #handleCommentAdd = (filmCardId, comment) => {
    this.#filmPopupComponent.updateElement({
      isCommentAdding: true,
    });
    this.#filmPopupComponent.renderFilmComments(this.#filmComments);
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {},
      {filmId: filmCardId, comment: comment,}
    );
    this.#filmPopupComponent.element.scrollTo(0, this.#lastPopupScrollPosition);
  };

  setCommentAddAborting = () => {
    const resetCommentState = () => {
      this.#filmPopupComponent.updateElement({
        isCommentAdding: false,
      });
      this.#filmPopupComponent.renderFilmComments(this.#filmComments);
      this.#filmPopupComponent.element.scrollTo(0, this.#lastPopupScrollPosition);
    };
    this.#filmPopupComponent.shakeOnAdd(resetCommentState);
  };

  #handleFilmCardClick = () => () => {
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setCloseClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setScrollHandler(this.#handlePopupScrolling);
    this.#renderFilmPopup();
  };

  #handlePopupScrolling = (scrollPosition) => {
    this.#lastPopupScrollPosition = scrollPosition;
  };

  #handleControlClick = (controlType) => {
    this.#filmCardComponent.element.querySelectorAll('.film-card__controls-item').forEach((button) => {button.disabled = true;});
    this.#filmPopupComponent.element.querySelectorAll('.film-details__control-button').forEach((button) => {button.diabled = true;});

    this.#changeData(
      UserAction.UPDATE_CARD,
      this.#popupOpened ? UpdateType.PATCH : UpdateType.MINOR,
      {...this.#filmPopupComponent.filmCard, userDetails: {...this.#filmPopupComponent.filmCard.userDetails, [controlType]: !this.#filmPopupComponent.filmCard.userDetails[controlType]}},
      controlType,
    );

    if (this.#popupOpened) {
      this.#filmPopupComponent.scrollTop = this.#lastPopupScrollPosition;
      this.#filmPopupComponent.renderFilmComments(this.#filmComments);
    }
  };

  setControlToggleAborting = (controlType) => {
    const enableControlButtons = () => {
      this.#filmCardComponent.element.querySelectorAll('.film-card__controls-item').forEach((button) => {button.disabled = false;});
      this.#filmPopupComponent.element.querySelectorAll('.film-details__control-button').forEach((button) => {button.diabled = false;});
    };

    if (this.#popupOpened) {
      this.#filmPopupComponent.shakeOnControlToggle(enableControlButtons, controlType);
    } else {
      this.#filmCardComponent.shake(enableControlButtons, controlType);
    }
  };

  #renderFilmPopup = async () => {
    this.#removePopups();
    this.#filmComments = await this.#commentModel.getFilmComments(this.#filmCard.id);
    render(this.#filmPopupComponent, document.querySelector('body'));
    this.#filmPopupComponent.renderFilmComments(this.#filmComments);
    this.#popupOpened = !this.#popupOpened;
  };

  #handlePopupClosing = () => {
    this.#filmPopupComponent.element.remove();
    this.#popupOpened = !this.#popupOpened;
    this.#lastPopupScrollPosition = 0;
  };

  removePopup = () => {
    this.#handlePopupClosing();
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    if (this.#filmPopupComponent) {
      remove(this.#filmPopupComponent);
    }
  };

  get popupOpened() {
    return this.#popupOpened;
  }
}
