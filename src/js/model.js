import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

// export the state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// recipe conversion
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  // restructure recipe obj
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // key required for own created/uploaded recipes
    // and will be received after uploading to the server
    // if only recipe.key exist we return obj with key: recipe.key
    // and spread it as key: recipe.key
    ...(recipe.key && { key: recipe.key }),
  };
};

// fill in the state

// with recipe
// export loadRecipe function
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    // restructure recipe obj
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    // re-throw the error to handle it in controller.js
    throw err;
  }
};

// with search query and results
// export loadSearchResults function
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    // re-throw the error to handle it in controller.js
    throw err;
  }
};

// return search results for requested page
export const getSearchResultsPage = function (page = state.search.page) {
  // keep current page in state
  state.search.page = page;
  // start point for requested page
  const start = (page - 1) * state.search.resultsPerPage;
  // end point for requested page
  const end = page * state.search.resultsPerPage;
  // return results for requested page
  return state.search.results.slice(start, end);
};

// change number of servings and quantity of ingredients
// required for new amount of servings
export const updateServings = function (newServings) {
  // change quantity of ingredients
  state.recipe.ingredients.forEach(
    (ingredient) =>
      (ingredient.quantity =
        (ingredient.quantity * newServings) / state.recipe.servings),
  );

  // update number of servings
  state.recipe.servings = newServings;
};

// save bookmarks to local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// add current recipe as bookmarked
export const addBookmark = function (recipe) {
  // add provided recipe to the state.bookmarks
  state.bookmarks.push(recipe);

  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  // re-save bookmarks in local storage
  persistBookmarks();
};

// remove bookmark from current recipe
export const deleteBookmark = function (id) {
  // find recipe in bookmarks array
  const index = state.bookmarks.findIndex((el) => el.id === id);

  // remove recipe from bookmarks array
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  // re-save bookmarks in local storage
  persistBookmarks();
};

// upload new recipe to the server
export const uploadRecipe = async function (newRecipe) {
  try {
    // take raw data and transform it to required format
    // create ingredients array
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => {
        return entry[0].startsWith('ingredient') && entry[1] !== '';
      })
      .map((ing) => {
        // split in words and than trim each to remove pre- and post-spaces
        const ingArr = ing[1].split(',').map((el) => el.trim());
        // if ingredient field is filled incorrectly
        // (not all part separated with (,))
        // throw the Error
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)',
          );

        // distraction the ingredients data array
        const [quantity, unit, description] = ingArr;

        return {
          // convert to number or null if no data provided for quantity
          quantity: quantity ? Number(quantity) : null,
          unit, // the same as unit: unit
          description,
        };
      });

    // create recipe obj in correct format
    const recipe = {
      // id: recipe.id,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      ingredients,
    };

    // send recipe to the server and get response
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // get data and store it in the state to render to the user
    state.recipe = createRecipeObject(data);

    // marked as bookmarked
    addBookmark(state.recipe);
  } catch (err) {
    // re-throw the error to handle it in controller.js
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
