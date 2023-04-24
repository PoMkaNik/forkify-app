import View from './View.js';
// parcel static files load
import icons from 'url:../../img/icons.svg';

// we need to change #private fields to _protected fields
// due to Parent class is used and babel and parcel can't handle
// it right now (March, 2021)
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;
  _message = 'Start by searching for a recipe or an ingredient. Have fun!';

  _generateMarkup() {
    // .map used here due to this array method returns new array
    // and then .join method used to get the string
    return this._data.map(this.#generateMarkupRecipe).join('');
  }

  #generateMarkupRecipe(recipe) {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        recipe.id === id ? 'preview__link--active' : ''
      }" href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image}" alt="${recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          
          <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
  `;
  }
}

export default new ResultsView();
