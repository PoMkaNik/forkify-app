import View from './View.js';
// parcel static files load
import icons from 'url:../../img/icons.svg';

// we need to change #private fields to _protected fields
// due to Parent class is used and babel and parcel can't handle
// it right now
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully upload ;)';

  _modal = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // required due to the extension of parent Class
    super();

    // add event listener as soon as instance created
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  toggleModal() {
    this._overlay.classList.toggle('hidden');
    this._modal.classList.toggle('hidden');
  }

  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this.toggleModal.bind(this));
    this._overlay.addEventListener('click', this.toggleModal.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // get all data from the form
      // this = form as we add event to the form itself
      // in array: first el - name of the field, second - value of field
      const dataArray = [...new FormData(this)];
      // new ES2019 functionality - convert array of arrays in object
      const data = Object.fromEntries(dataArray);

      // forward the data to the controller
      // for further forwarding to the model and processing there
      handler(data);

      // clean the input fields
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
