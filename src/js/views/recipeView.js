import View from './View.js';

// parcel static files load
import icons from 'url:../../img/icons.svg';
// show 1 1/2 instead of 1.5 with this library
// use destructuring because it returns fraction.Fraction
import { Fraction } from 'fractional';

// we need to change #private fields to _protected fields
// due to Parent class is used and babel and parcel can't handle
// it right now
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We could not find that recipe. Please try another one!`;
  _message = `Start by searching for a recipe or an ingredient. Have fun!`;

  addHandlerRender(handler) {
    // events
    // hashchange - is change the value after '/' - hash
    // domain.com/#44234423423443214
    // hash is #44234423423443214

    // here events are only listening
    // but handled in controller
    ['load', 'hashchange'].forEach((ev) => {
      window.addEventListener(ev, handler);
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // get clicked button
      const btn = e.target.closest('.btn--update-servings');

      // return if click was made not on a button
      // as it is made through event delegation
      if (!btn) return;

      // get new servings amount
      const servingsUpdateTo = Number(btn.dataset.updateTo);

      // call handler if servings is > 0
      if (servingsUpdateTo > 0) handler(servingsUpdateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;

      handler(btn);
    });
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>

        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this.#generateMarkupIngredient).join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  #generateMarkupIngredient(ing) {
    // .map used here due to this array method returns new array
    // and then .join method used to get the string
    return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            ing.quantity ? new Fraction(ing.quantity).toString() : ''
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </li>
        `;
  }
}
// exporting as default the instance of the class
// not class itself!
// we want to have only one instance of this class
// and remove additional unrelated code from controller
export default new RecipeView();
