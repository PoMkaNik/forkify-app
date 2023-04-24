// parcel static files load
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (eg recipe)
   * @returns {} undefined or render the Error message
   * @this {Object} View instance
   */
  render(data) {
    // check if no data received
    // or if data is array (for search results) than it is empty
    // than render the error message
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // keep data available for all functions in class
    this._data = data;
    // generate markup to render
    const markup = this._generateMarkup();
    // clear parent element (remove spinner or prev recipe)
    this.#clear();
    // render requested data
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // keep data available for all functions in class
    this._data = data;
    // generate new markup to render
    const newMarkup = this._generateMarkup();
    // convert markup string in virtual DOM obj
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // create array from virtual DOM obj
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // get array of current DOM elements
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*'),
    );
    // compare newElements and currentElements
    // and change data only where changes was made
    newElements.forEach((newEl, i) => {
      const currentEl = currentElements[i];

      // change only where text changed and
      // where text is first node
      if (
        !newEl.isEqualNode(currentEl) &&
        // below is the requirement that only text node should be
        // the first child node
        // if it is undefined -> false
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEl.textContent = newEl.textContent;
      }

      // change attributes
      // required for servings change buttons
      // where data-* is used to provide newServings
      // for controller function
      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          currentEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  // render spinner (public method)
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    // clear parent element (remove spinner or prev recipe)
    this.#clear();
    // render requested data
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // render error msg
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    // clear parent element (remove spinner or prev recipe)
    this.#clear();
    // render requested data
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // render success msg
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    // clear parent element (remove spinner or prev recipe)
    this.#clear();
    // render requested data
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this._parentElement.innerHTML = '';
  }
}
