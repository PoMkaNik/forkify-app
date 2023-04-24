// we can leave #private fields due to no Parent class is used
class SearchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    // get query value
    const query = this.#parentElement.querySelector('.search__field').value;
    // clear the input field
    this.#clearInput();
    // return query value
    return query;
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
