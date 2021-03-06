# React Redux Library

[React Redux](https://react-redux.js.org/) is the official Redux-UI binding package for React. This means React Redux handles the interactions between React’s optimized UI rendering and Redux’s state management. In this lesson, you will explore the benefits of using the React Redux library and then incorporate the tools provided by the library into a Redux application.

Before continuing you should note the application’s current functionality that will be replaced in the following exercises:

1. Calling `ReactDOM.render()` using `render()`.
2. Passing `store.getState()` through `<App>` component props.
3. Passing `store.dispatch` through `<App>` component props.
4. Subscribing `render()` to the Redux store so it is called after state updates.
5. Using the `props` parameter in **App.js** to pass data through the component, also known as *props drilling*.

Move to the next exercise to learn about each of these elements of the current application and how React Redux can help improve on them.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app/App.js';
import { store } from './app/store.js';

const render = () => {
  ReactDOM.render(
    <App 
      state={store.getState()}
      dispatch={store.dispatch}
    />,
    document.getElementById('root')
  )
}
store.subscribe(render);
render();
```

```jsx
import React from 'react';

import { AllRecipes } from '../features/allRecipes/AllRecipes.js';
import { SearchTerm } from '../features/searchTerm/SearchTerm.js';
import { FavoriteRecipes } from '../features/favoriteRecipes/FavoriteRecipes.js';

export function App(props) {
  const {state, dispatch} = props;

  const visibleAllRecipes = getFilteredRecipes(state.allRecipes, state.searchTerm);
  const visibleFavoriteRecipes = getFilteredRecipes(state.favoriteRecipes, state.searchTerm);
  
  return (
    <main>
      <section>
        <SearchTerm
          searchTerm={state.searchTerm}
          dispatch={dispatch}
        />
      </section>
      <section>
        <h2>Favorite Recipes</h2>
        <FavoriteRecipes
          favoriteRecipes={state.favoriteRecipes}
          dispatch={dispatch}
        />
      </section>
      <hr />
      <section>
        <h2>All Recipes</h2>
        <AllRecipes
          allRecipes={visibleAllRecipes} 
          dispatch={dispatch}
        />
      </section>
    </main>
  )
}

/* Utility Helpers */

function getFilteredRecipes(recipes, searchTerm) {
  return recipes.filter(recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()));
}
```

## Motivation for React Redux

The first issue with this implementation is passing the `state` and `dispatch` reference through props. Using props to access the `state` or to dispatch actions adds unneeded complexity. Keeping track of errors in this situation is unmanageable as the number of components increases.

Also, the `<App>` component uses *props drilling*, which means it is passing props to child components without using them. This is something React developers like to avoid in order to make components more reusable.

The last issue is subscribing `render()` to changes in the state. This creates more overhead by repeatedly calling `ReactDOM.render()`, which is not the intended implementation for rendering React components.

With React Redux you will learn how to solve these issues by:

- Giving the entire application access to the Redux store without using props and props drilling.
- Subscribing individual components to specific pieces of the application state for optimized rendering.
- Easily dispatching actions within components.

## Installing react-redux

To take advantage of React Redux within your application, you must install the `react-redux` package using `npm`, the Node Package Manager. If you’re not familiar with `npm`, you can [learn more in the documentation](https://docs.npmjs.com/about-npm). This includes understanding the directory structure, confirming installation and versions of your packages.

To install React Redux using `npm`, type the following command into your terminal and hit the “enter” key:

```
npm install react-redux
```

After installation, your application will have access to the tools provided by the React Redux package.

## The <Provider> Component

Now that the `react-redux` library is installed, it is time to start the one-way data flow by giving the top-level `<App>` component access to the Redux store.

The `<Provider>` component from the `react-redux` library gives the components of an application access to the Redux store without the need to pass the store directly to the React components through props. To implement this, wrap the `<Provider>` component around the top-level component and pass `store` through the `store` prop of the `<Provider>`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app/App.js';
import { store } from './app/store.js';
 
import { Provider } from 'react-redux'
 
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

This example demonstrates:

- Importing `Provider` from `react-redux`.
- Wrapping the `<Provider>` component around the root `<App />` component.
- Passing the `store` through the `<Provider>` component’s `store` prop.

Before moving on to the instructions, it is important to note that `ReactDOM.render()` is no longer inside a `render()` function and therefore nothing is subscribed to changes in the Redux store. This is something you will address in the next few exercises. Like many improvements in the world, you sometimes have to break the process to make it better.

## Selectors

The Redux store is provided to the React components of the application using the `<Provider>`component. Now, for each React component, you need to define which data from the store that component needs access to. This can be done by creating *selector functions*. These are not provided by the `react-redux` library but instead are user-defined.

A selector function, or *selector*, is a pure function that selects data from the Redux store’s state. Each component in an application that needs access to the state will have one or more selectors that extract only the necessary data for that component.

As pure functions, selectors should output the same data given the same input. This means that no randomness or side effects can occur inside the function.

A selector:

- Takes `state` as an argument.
- Returns what is needed by the component from `state`.

```jsx
/* 
Given a state with an array of objects, labeled 'todos', and a string, labeled 'filter':
 
state = {
  todos: [
    {id: 1, isComplete: true, text: 'Go shopping'}
    {id: 2, isComplete: false, text: 'Call home'}  
  ],
  filter: 'SHOW_ALL'
}
*/
 
// Select the current filter
export const selectFilter = state => state.filter;
 
// Select the `text` from each todo in an array.
export const selectTodoText = state => state.todos.map(
  todo => todo.text);
 
// Select the id values of completed todos in an array.
export const selectIsCompleteIDs = state => state.todos.filter(
  todo => todo.isComplete).map(todo => todo.id)
```

1. The first selector `selectFilter` returns the string `state.filter`.
2. `selectTodoText` returns an array of the `.text` value for each todo object .
3. `selectIsCompleteIDs` returns an array of the `id` values from the todo objects where `isCompleted` is `true`.

It is a convention to give selectors a name that starts with `select` and that represents the specific piece of data they retrieve.

**Tasks**

```jsx
/*
Towards the bottom of allRecipesSlice.js, implement selectAllRecipes and test the code:
- Start with an export statement
- Define selectAllRecipes with state as the only argument
- Return the allRecipes piece of the state
- To test the selector, uncomment the call to testSelectAllRecipes() at the bottom of the file

now implement a new selector that retrieves the recipes based on the searchTerm in the state. 
Below the selectAllRecipes selector:
- Start with an export statement
- Define selectFilteredAllRecipes with state as the only argument
- For now, leave the function body empty ({})

use the selectAllRecipes and selectSearchTerm to retrieve data for selectFilteredAllRecipes.
Inside the function body of selectFilteredAllRecipes, create two variables:
- allRecipes and assign the return value of selectAllRecipes(state)
- searchTerm and assign the return value of selectSearchTerm(state)

Now you have an array of the recipes in allrecipes and the current search term string in searchTerm.
To get a filtered list of recipes based on the search term you will use the JavaScript array 
filter() method.
Inside selectFilteredAllRecipes, call allRecipes.filter() with the following callback function 
as the argument:

	recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
	
Then, return the result.
*/

import allRecipesData from '../../../data.js'
import { selectSearchTerm } from '../searchTerm/searchTermSlice.js';

export const loadData = () => {
  return {
    type: 'allRecipes/loadData',
    payload: allRecipesData
  }
}

const initialState = [];
export const allRecipesReducer = (allRecipes = initialState, action) => {
  switch (action.type) {
    case 'allRecipes/loadData':
      return action.payload;
    case 'favoriteRecipes/addRecipe':
      return allRecipes.filter(recipe => recipe.id !== action.payload.id);
    case 'favoriteRecipes/removeRecipe':
      return [...allRecipes, action.payload]
    default:
      return allRecipes;
  }
}

// Implement the selectors below.
export const selectAllRecipes = (state) => {
  return state.allRecipes;
};

export const selectFilteredAllRecipes = (state) => {
  const allRecipes = selectAllRecipes(state);
  const searchTerm = selectSearchTerm(state);

  const searchResult = allRecipes.filter(
    recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return searchResult;
};

// This code is for testing the seletors only.
const testState = {
  allRecipes: allRecipesData,
  searchTerm: 'ch'
}

const testSelectAllRecipes = () => {
  console.log('All Recipes')
  console.log(selectAllRecipes(testState));
}

const testSelectFilteredAllRecipes = () => {
  console.log('\nRecipes filtered by searchTerm')
  console.log(selectFilteredAllRecipes(testState));
}

// Uncomment these to test each selector.
testSelectAllRecipes();
testSelectFilteredAllRecipes(); 
```

## The useSelector() hook

With selectors, you have given your application the instructions to access data from the Redux store. To use these instructions the `useSelector()` hook is provided by `react-redux`. `useSelector()` accomplishes two things:

- It returns data from the Redux store using selectors
- It subscribes a child component of `<Provider />` to changes in the store. React, not Redux, will re-render the component if the data from the selector changes.

These tasks are both accomplished by calling `useSelector()` inside a component definition and assigning its returned value to a variable.

```jsx
// Todos.js
import { useSelector } from 'react-redux';
import { selectTodos } from 'todosSlice.js';
 
export const Todos = () => {
  const todos = useSelector(selectTodos);
 
  return (
    <p>{todos}</p>
  )
};
```

In the above example, `useSelector()` takes the imported selector function `selectTodos` as an argument. The returned value is the selected data from the Redux store and is assigned to `todos`.

Calling `useSelector()`inside the component definition also subscribes the `Todos` component to re-render if any changes occur in the `todos` portion of the Redux store. This optimizes the performance of the application by only re-rendering components that have had their data change and not the entire application.

`useSelector()` can also use an inline selector as an argument:

```jsx
const todos = useSelector(state => state.todos);
```

Inline selectors can be useful if you need to use props for data retrieval.

```jsx
export const Todo = (props) => {
  const todo = useSelector(state => state.todos[props.id]);
```

This final example uses `props.id` to extract a single element from an array or object in the Redux store.

`useSelector()` completes the 3 step process for accessing data from the Redux store using `react-redux`.

1. The `<Provider>` component is used to provide the Redux store to the nested application.
2. Selectors are created to give instructions on retrieving data from the store.
3. `useSelector()` is called within a child component of `<Provider>` for executing selector instructions to retrieve data and subscribe to re-rendering.

**tasks**

```jsx
/*
To access Redux store data with useSelector(), you first need to import it from react-redux.
In AllRecipes.js import useSelector from react-redux.

Along with useSelector() you need access to the selectFilteredAllRecipes selector defined 
in the previous exercise.
In AllRecipes.js add selectFilteredAllRecipes to the allRecipesSlice.js import statement.

With both import statements complete, you are now able to access the data using the 
selector function and useSelector().

Inside the AllRecipes() component function:
- Define a variable allRecipes.
- Assign it the value returned by useSelector().
- Pass selectFilteredAllRecipes to useSelector().
In this exercise, the data was initialized with recipes so when you run the code 
you should see the recipe data rendered in the browser.

*/
import React, { useEffect } from 'react';
// Implement the import statements below.
import { useSelector } from 'react-redux';

// Add the selector to the below import statement 
import { loadData, selectFilteredAllRecipes  } from './allRecipesSlice.js';
import { addRecipe } from '../favoriteRecipes/favoriteRecipesSlice.js';
import FavoriteButton from "../../components/FavoriteButton";
import Recipe from "../../components/Recipe";
const favoriteIconURL = 'https://static-assets.codecademy.com/Courses/Learn-Redux/Recipes-App/icons/favorite.svg';

export const AllRecipes = () => {
  // Implement allRecipes variable below.
  const allRecipes = useSelector(selectFilteredAllRecipes);
  
  const onFirstRender = () => {
    // dispatch(loadData());
  }
  useEffect(onFirstRender, []);

  const onAddRecipeHandler = (recipe) => {
    // dispatch(addRecipe(recipe));
  };

  return (
    <div className="recipes-container">
      {allRecipes.map((recipe) => (
        <Recipe recipe={recipe} key={recipe.id}>
          <FavoriteButton
            onClickHandler={() => onAddRecipeHandler(recipe)}
            icon={favoriteIconURL}
          >
            Add to Favorites
          </FavoriteButton>
        </Recipe>
      ))}
    </div>
  );
};
```



## The useDispatch() hook

With the `<Provider>` component, selectors, and `useSelector()` implemented, you are now able to access the application state and subscribe component rendering to data changes. In this exercise, you are going to look at the final step: dispatching actions.

Without the `react-redux` library, you needed to create a reference to `store.dispatch` and pass it through the application’s props. With `react-redux` you can now access this reference from each component with `useDispatch()`.

```jsx
import { useDispatch } from 'react-redux';
 
// within component definition
const dispatch = useDispatch() 
dispatch({type: 'addTodo'});
```

The above example:

- Imports `useDispatch` from `react-redux`.
- Calls `useDispatch()` to obtain a reference to the Redux store `dispatch()` function and assigns it to `dispatch`.
- Dispatches an action using `dispatch()` with an action object as the argument.

Here is a complete example with action creators and a Component definition:

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { selectTodo } from './todoSlice.js';
import { removeTodo } from './todoSlice.js';
 
const Todo = () => {
  const todo = useSelector(selectTodo);
  const dispatch = useDispatch();
 
  return (
    <button onClick={() => dispatch(removeTodo(todo))}>
      {todo}
    </button>
  )
}
```

This example demonstrates:

- Importing `useDispatch` (alongside `useSelector`).
- Importing the `removeTodo` action creator from `./todoSlice.js`
- Creating the `dispatch` variable that holds the reference to the Redux store dispatch function.
- Dispatching an action using `dispatch()` with `removeTodo`.

The `useDispatch` hook allows you to dispatch actions from any component that is a descendent of the `<Provider>` component, therefore avoiding passing a reference to `store.dispatch` through props. Both approaches accomplish the same thing but `useDispatch()` avoids props drilling.

**Tasks**

```jsx
/*
In AllRecipes.js:

- Add useDispatch to the react-redux import statement.
- Create a variable dispatch inside the AllRecipes component and assign 
  it the reference returned by useDispatch().

*/

import React, { useEffect } from 'react';
// Add useDispatch to the import statement below.
import { useSelector, useDispatch } from 'react-redux';

import { addRecipe } from '../favoriteRecipes/favoriteRecipesSlice.js';
import { loadData, selectFilteredAllRecipes } from './allRecipesSlice.js';
import FavoriteButton from "../../components/FavoriteButton";
import Recipe from "../../components/Recipe";
const favoriteIconURL = 'https://static-assets.codecademy.com/Courses/Learn-Redux/Recipes-App/icons/favorite.svg';

export const AllRecipes = () => {
  const allRecipes = useSelector(selectFilteredAllRecipes);
  // Implement dispatch variable below.
  const dispatch = useDispatch();
  
  const onFirstRender = () => { dispatch(loadData()); }
  useEffect(onFirstRender, []);
  
  const onAddRecipeHandler = (recipe) => {
    dispatch(addRecipe(recipe));
  };

  return (
    <div className="recipes-container">
      {allRecipes.map((recipe) => (
        <Recipe recipe={recipe} key={recipe.id}>
          <FavoriteButton
            onClickHandler={() => onAddRecipeHandler(recipe)}
            icon={favoriteIconURL}
          >
            Add to Favorites
          </FavoriteButton>
        </Recipe>
      ))}
    </div>
  );
};
```

```jsx
/*

In FavoriteRecipes.js, useDispatch has been added to the import statement and the dispatch 
reference has been defined. 
Use dispatch to dispatch the action inside one of the handler functions.

Inside the onRemoveRecipeHandler function:
- Dispatch an action using dispatch()
- Pass the removeRecipe() action creator to dispatch().
- Pass recipe to the action creator.

When you run the application you should be able to remove items from your favorite list. 
The SearchTerm component action dispatching has also been implemented so you can now 
filter both recipe lists using the text box.
*/

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { removeRecipe, selectFilteredFavoriteRecipes } from './favoriteRecipesSlice.js';
import FavoriteButton from "../../components/FavoriteButton";
import Recipe from "../../components/Recipe";
const unfavoriteIconUrl = 'https://static-assets.codecademy.com/Courses/Learn-Redux/Recipes-App/icons/unfavorite.svg';

export const FavoriteRecipes = () =>{
  const favoriteRecipes = useSelector(selectFilteredFavoriteRecipes);
  const dispatch = useDispatch();

  const onRemoveRecipeHandler = (recipe) => {
    // Dispatch the action below.
    dispatch(removeRecipe(recipe));
  };

  return (
    <div className="recipes-container">
      {favoriteRecipes.map(createRecipeComponent)}
    </div>
  );

  // Helper Function
  function createRecipeComponent(recipe) {
    return (
      <Recipe recipe={recipe} key={recipe.id}>
        <FavoriteButton
          onClickHandler={() => onRemoveRecipeHandler(recipe)}
          icon={unfavoriteIconUrl}
        >
          Remove Favorite
        </FavoriteButton>
      </Recipe>
    )
  } 
};
```

## Review

Congratulations on finishing this lesson on the [`react-redux`](https://react-redux.js.org/) library! Let’s review what you’ve learned:

- React and Redux work well together but need more to support React’s UI optimization and Redux’s one-way data flow.
- The `react-redux` library provides React application components access to the Redux store
- The `<Provider>` component wraps around the root component to give its descendants access to the - Redux `store` without props drilling
- Selectors are pure function used to access all or part of the `state` in the Redux `store`
- `useSelector()` retrieves the application `state` through selectors. It must be called from within a component
- `useSelector()` subscribes components to data retrieved from the selectors. React, not Redux, re-renders those components when the selected data changes
- `useDispatch()` returns a reference to Redux store `dispatch()` function

## Project - Matching Memory

When introducing Redux to a React application, you transfer the responsibility of state management over to Redux. This is great because Redux is really good at state management, but this also hinders React’s optimized UI rendering. That is why `react-redux` was created to bind the UI rendering of React to the state management of Redux.

This project explores where `react-redux` fits into an application by finishing off the implementation of a one-player matching game.

The application consists of 5 React components:

1. `App`: The root component, `App` renders the `Score` and `Board` components.
2. `Score`: Child of the `App` component, `Score` will display the number of matched cards.
3. `Board`: Child of the `App` component, `Board` will create the card grid for gameplay.
4. `CardRow`: Child of the `Board` component, `CardRow` renders a row of `Card` components.
5. `Card`: Child of the `CardRow` component, `Card` displays the card content when flipped over.

One goal of this project will be to show that a nested component like `Card` can access data and dispatch actions as easily as a higher-level component like `App` or `Score`.

Most of the Redux store logic is implemented in **boardSlice.js**. This includes initializing the `state`, the reducers, and the action creators.

The application `state` is an array of 12 objects with each object representing a card:

```
// card object
{
  id: uniqueID, 
  contents: wordString, 
  visible: visibleBoolean, 
  matched: matchedBoolean
}
```

There are 3 actions needed to run the game:

- `setGame`: randomize the card array and set `visible` and `matched` of all cards to `false`
- `flipCard`: set `visible` of the specified card `id` to `true`
- `resetCards` set `visible` to `false` on unmatched cards

To complete this project you will add a `<Provider />` component, implement selectors, retrieve data from the `store` with `useSelector()`, and dispatch actions with the help of `useDispatch()`. With all of this ahead of you, explore the starting code of the application and then move on to the first task to begin implementing the matching game.

**Tasks**



