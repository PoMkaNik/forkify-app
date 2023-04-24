import View from './View.js';
// parcel static files load
import icons from 'url:../../img/icons.svg';

// we need to change #private fields to _protected fields
// due to Parent class is used and babel and parcel can't handle
// it right now
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _currentPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    this._currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    // page 1, and there are other pages
    if (this._currentPage === 1 && numPages > 1) {
      return this.#generateMarkupNextButton();
    }

    // last page
    if (this._currentPage === numPages && numPages > 1) {
      return this.#generateMarkupPrevButton();
    }

    // other page
    if (this._currentPage < numPages) {
      return [
        this.#generateMarkupPrevButton(),
        this.#generateMarkupNextButton(),
      ].join('');
    }

    // page 1 and there are no other page
    return '';
  }

  #generateMarkupNextButton() {
    return `
    <button class="btn--inline pagination__btn--next" data-goto="${
      this._currentPage + 1
    }">
      <span>Page ${this._currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> 
  `;
  }

  #generateMarkupPrevButton() {
    return `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          this._currentPage - 1
        }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${this._currentPage - 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
