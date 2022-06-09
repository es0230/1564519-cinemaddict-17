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
    this.#filmPopupComponent = new FilmPopupView(filmCard, this.#commentModel);

    this.#filmCardComponent.setCardClickHandler(this.#handleFilmCardClick(this.#filmCardComponent.filmCard));
    this.#filmCardComponent.setControlClickHandler(this.#handleControlClick);

    this.#filmPopupComponent.setCloseClickHandler(this.#handlePopupClosing);
    this.#filmPopupComponent.setControlButtonClickHandler(this.#handleControlClick);
    this.#filmPopupComponent.setCommentDeleteButtonClickHandler(this.#handleCommentDeleteClick);
    this.#filmPopupComponent.setCommentAddHandler(this.#handleCommentAdd);

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
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
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
  };

  setCommentAddAborting = () => {
    const resetCommentState = () => {
      this.#filmPopupComponent.updateElement({
        isCommentAdding: false,
      });
      this.#filmPopupComponent.renderFilmComments(this.#filmComments);
    };
    this.#filmPopupComponent.shakeOnAdd(resetCommentState);
  };

  #handleFilmCardClick = () => () => {
    this.#filmPopupComponent.setEscKeyDownHandler(this.#handlePopupClosing);
    this.#renderFilmPopup();
  };

  #handleControlClick = (controlType) => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      this.#popupOpened ? UpdateType.PATCH : UpdateType.MINOR,
      {...this.#filmPopupComponent.filmCard, userDetails: {...this.#filmPopupComponent.filmCard.userDetails, [controlType]: !this.#filmPopupComponent.filmCard.userDetails[controlType]}}
    );
    if (this.#popupOpened) {
      this.#filmPopupComponent.renderFilmComments(this.#filmComments);
    }
  };

  #renderFilmPopup = async () => {
    this.#removePopups();
    this.#filmComments = await this.#commentModel.getFilmComments(this.#filmCard.id);
    render(this.#filmPopupComponent, document.querySelector('body'));
    this.#filmPopupComponent.renderFilmComments(this.#filmComments);
    this.#popupOpened = !this.#popupOpened;
  };

  #handlePopupClosing = (filmCardDataChanges) => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#filmCard, ...filmCardDataChanges}
    );
    this.#popupOpened = !this.#popupOpened;
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
