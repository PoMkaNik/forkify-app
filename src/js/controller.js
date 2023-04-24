import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
// we need to import addRecipeView to get instance of class
// and run constructor in it where events listeners are added
import addRecipeView from './views/addRecipeView.js';

// parcel polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

// load and render recipe
// from state
const controlRecipes = async function () {
  try {
    // get id from url without hash # symbol
    const id = window.location.hash.slice(1);

    if (!id) return;

    // start the spinner
    recipeView.renderSpinner();

    // update results view to mark selected search result =>
    // re-render the results and bookmarks views with new active class added
    // when the hash in URL (after recipe rendered)
    // is equal to preview recipe.id (hash)
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe after data received from model
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`${err} 🔥`);
    // deal with errors in model and pass them to render
    // in recipeView.js
    recipeView.renderError();
  }
};

// get search query, receive and render results
// from state
const controlSearchResults = async function () {
  try {
    // render spinner
    resultsView.renderSpinner();

    // get search query from view
    const query = searchView.getQuery();
    if (!query) return;

    // load data from API based on the query provided
    await model.loadSearchResults(query);

    // init rendering with search.page = 1
    // provide data to view component to render the results
    resultsView.render(model.getSearchResultsPage(1));

    // pagination buttons rendering
    paginationView.render(model.state.search);
    // /init
  } catch (err) {
    console.error(`${err} 🔥`);
    resultsView.renderError();
  }
};

// get click event from pagination
// and show prev/next search result page
// with update pagination buttons
const controlPagination = function (goToPage) {
  // show requested page with new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // re-render pagination buttons with changed state (search.page)
  paginationView.render(model.state.search);
};

// get clicks on servings change buttons
// change the servings in state
// and re-render recipe view
const controlServings = function (newServings) {
  // update recipe servings (in the state)
  model.updateServings(newServings);

  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// adding new bookmark
const controlAddBookmark = function () {
  // mark recipe as bookmarked in state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // remove bookmark if this recipe is bookmarked
  else model.deleteBookmark(model.state.recipe.id);
  // update recipe view with bookmark icon filled
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// init rendering of bookmarks from state (local storage)
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// upload recipe to API
const controlAddRecipe = async function (newRecipe) {
  try {
    // render loader
    addRecipeView.renderSpinner();

    // upload recipe and get result
    await model.uploadRecipe(newRecipe);

    // render created recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // change hash (id in URL)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // update bookmark view to add newly uploaded recipe
    // used render() not update() -> we need to ADD new element
    bookmarksView.render(model.state.bookmarks);

    // re-render search results with message
    // if we have added new recipe after search
    // in other way the recipe selected from search result
    // will be still selected in ResultView
    // but in RecipeView will be uploaded recipe already
    resultsView.renderMessage();

    // close form modal after MODAL_CLOSE_SECONDS
    setTimeout(function () {
      addRecipeView.toggleModal();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(`${err} 🔥`);
    // deal with errors in model and pass them to render
    // with our own error message
    addRecipeView.renderError(err.message);
  }
};

// publisher-subscriber pattern
// provide callback for event listeners in view
const init = function () {
  // handle load event for init rendering of bookmarks
  bookmarksView.addHandlerRender(controlBookmarks);
  // handle load event and hash change events from UI
  // also handles clicks on search results
  // as it changes the hash
  recipeView.addHandlerRender(controlRecipes);
  // handle servings change buttons clicks
  recipeView.addHandlerUpdateServings(controlServings);
  // handle clicks on bookmark button
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // handle search request from UI
  searchView.addHandlerSearch(controlSearchResults);
  // handle pagination clicks
  paginationView.addHandlerClick(controlPagination);
  // handle new recipe submission
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
