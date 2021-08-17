# Reduc Toolkit

## Installing Redux Toolkit

Installing Redux Toolkit

Before you can take advantage of the benefits of the Redux Toolkit, you must first install the `@reduxjs/toolkit` package into your application. You can do this with the Node Package Manager. While in the root directory of the application, you’ll first need to enter the following command:

```
npm install @reduxjs/toolkit
```

## 'Slices' of State

Before we dive deeper into this lesson, let’s refresh our memory about what we’re referring to when talking about a “slice” of state. A normal Redux application has a JS object at the top of its state tree. We refer to one key/value section of that object as a “slice”. In the following example, `state.todos` and `state.visibilityFilter` are slices.

```jsx
const state = {
  todos: [
    {
      id: 0,
      text: "Learn Redux-React",
      completed: true,
    },
    {
      id: 1,
      text: "Learn Redux Toolkit",
      completed: false,
    }
  ], 
  visibilityFilter: "SHOW_ALL"
}
```

We typically define one reducer for each slice of the state. Those are called “slice reducers”. Let’s take a look at the slice reducer for the `state.todos` slice:

```jsx
/* todosSlice.js  */
const addTodo = (todo) => {
  return {
    type: 'todos/addTodo',
    payload: todo
  }
}
 
const toggleTodo = (todo) => {
  return {
    type: 'todos/toggleTodo',
    payload: todo
  }
}
 
const todos = (state = [], action) => {
 switch (action.type) {
   case 'todos/addTodo':
     return [
       ...state,
       {
         id: action.payload.id,
         text: action.payload.text,
         completed: false
       }
     ]
   case 'todos/toggleTodo':
     return state.map(todo =>
       todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo
     )
   default:
     return state
 }
}
```

Notice that this file only deals with the `state.todos` data and completely ignores the `state.visibilityFilter` slice. Managing the state one slice at a time allows us to more effectively manage the distinct logic of each individual part of our application.

In the example above, the logic for the reducer and the action creators is all written in the same file. However, in a larger application, this logic would likely be split up even further, with the reducer logic in one file and the action creators in another. In the next exercise, we’ll take a closer look at how we can take advantage of Redux Toolkit’s `createSlice()` function to further simplify the logic for us. 

**Tasks**

```jsx
/*
At the top of favoriteRecipesSlice.js in the code editor, import createSlice() from the '@reduxjs/toolkit' library.
*/

import {createSlice} from '@reduxjs/toolkit'
```

## Refactoring with createSlice()

In the last exercise, we looked at one way to define a slice reducer and the associated action creators.

```jsx
/* todosSlice.js  */
const addTodo = (todo) => {
 // logic omitted...
}
 
const toggleTodo = (todo) => {
  // logic omitted...
}
 
const todos = (state = [], action) => {
  // logic omitted...
}
```

We can do the same work, but more simply, with `createSlice()`! `createSlice()` has one parameter, `options`, which is an object with the following properties

- `name`: a string that is used as the prefix for generated action types
- `initialState`: the initial state value for the reducer
- `reducers`: an object of methods, where the keys determine the action `type` strings that can update the state, and whose methods are reducers that will be executed when that action type is dispatched. These are sometimes referred to as “case reducers”, because they’re similar to a case in a switch statement.

```jsx
/* todosSlice.js */
const options = {
 name: 'todos',
 initialState: [],
 reducers: {
   addTodo: (state, action) => {
     return [
       ...state,
       {
         id: action.payload.id,
         text: action.payload.text,
         completed: false
       }
     ]
   },
   toggleTodo: (state, action) => {
     return state.map(todo =>
       (todo.id === action.payload.id) ? { ...todo, completed: !todo.completed } : todo
     )
   }
 }
}
 
const todosSlice = createSlice(options);
```

In the `options` object passed to `createSlice()` in the snippet above, `name` is set to `'todos'`, `initialState` is set to an empty array, and we have two *case reducers*: `addTodo` and `toggleTodo`. Note that the names of the case reducer functions are conventionally written in lowerCamelCase.

With `createSlice()`…

- We can write the case reducers as functions inside of an object, instead of having to write a switch/case statement.
- Action creators that correspond to each case reducer function we provide will be automatically generated, so we don’t need to worry about defining those ourselves.
- No default handler needs to be written. The reducer generated by `createSlice()` will automatically handle all other action types by returning the current state, so we don’t have to list that ourselves.

**Tasks**

```jsx
/*
Take a look at oldFavoriteRecipesSlice.js to see the old way of creating a reducer and action
creators for the state.favoriteRecipes slice. Your job is to rewrite this code using createSlice
within favoriteRecipesSlice.js.

First, createSlice() will need an options object to be passed in as an argument. 
At the top of the file and below the import statements, declare a variable called options. 
For now, assign to it an empty object.

Next, add the following three properties and corresponding values to the options object:
- name: 'favoriteRecipes'
- initialState: an empty array
- reducers: an empty object (for now).

The options.reducers property should hold an object containing the case reducers for the slice.

Each value in the options.reducers object should be a function whose name corresponds 
to an action type that the slice can handle. Each case reducer should have two parameters,
state and action, and return the next state. Using the logic defined in the
oldFavoriteRecipesSlice.js file to guide you, add the two methods below to 
the options.reducers object:
- addRecipe
- removeRecipe

The final step is to call createSlice() with the options object as an argument and export the result.

Below the options object,
- Declare a new variable called favoriteRecipesSlice
- Call createSlice() with options as the only argument and assign the result to favoriteRecipes
- Export favoriteRecipesSlice
*/
import { createSlice } from '@reduxjs/toolkit';
import { selectSearchTerm } from '../searchTerm/searchTermSlice.js';

/* Create your Slice object here. */
const options = {
  name: 'favoriteRecipes',
  initialState: [],
  reducers: {
    addRecipe: (state, action) => {
      /* old code:     
      case 'favoriteRecipes/addRecipe':
        return [...state, action.payload] */
      return [...state, action.payload]
    },
    removeRecipe: (state, action) => {
      /* old code:
      case 'favoriteRecipes/removeRecipe':
        return state.filter(recipe => recipe.id !== action.payload.id) */ 
      return state.filter(recipe => recipe.id !== action.payload.id)
    },
  }
};

export const favoriteRecipesSlice = createSlice(options)

/* Do not delete the code below...*/
export const selectFavoriteRecipes = (state) => state.favoriteRecipes;
export const selectFilteredFavoriteRecipes = (state) => {
  const favoriteRecipes = selectFavoriteRecipes(state);
  const searchTerm = selectSearchTerm(state);

  return favoriteRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
```

## Writing 'Mutable' Code

Because Redux reducers must never mutate state, we often write immutable updates by using JavaScript’s array and object spread operators and other functions that return copies of the original values. However, accidentally mutating state in reducers is the single most common mistake Redux users make!

While you still have the option of writing immutable updates the old fashioned way, Redux Toolkit’s `createSlice()` function uses a library called [Immer](https://immerjs.github.io/immer/docs/introduction) inside of it which helps avoid this mistake. Immer uses a special JS object called a Proxy to wrap the data you provide and lets you write code that “mutates” that wrapped data. Immer does this by tracking all the changes you’ve made and then uses that list of changes to return an immutably updated value as if you’d written all the immutable update logic by hand. So, instead of this:

```jsx
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      return [
        ...state,
        {
          ...action.payload,
          completed: false
        }
      ]
    },
    toggleTodo: (state, action) => {
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo
      )
    }
  }
})
```

You can write code that looks like this:

```jsx
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ 
        ...action.payload, 
        completed: false 
      })
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload.id)
      if (todo) {
        todo.completed = !todo.completed
      }
    }
  }
})
```

`addTodo` is calling `state.push()` here, which is normally bad because the `array.push()` function mutates the existing array. Similarly, `toggleTodo` is simply finding the matching todo object, and then mutating it by reassigning its value. Thanks to Immer, however, this code will work just fine! You don’t need to learn the Immer library. All you do need to know is that `createSlice()` takes advantage of it, allowing us to safely “mutate” our state. You may find it useful to look through some of the common [update patterns used with Immer](https://immerjs.github.io/immer/docs/update-patterns).

**Tasks**

```jsx
/*
Inside of the options object, rewrite the logic for the addRecipe case reducer so that it uses 
.push() instead of the spread operator to add a new recipe.
*/

/* Modify the options.reducers.addRecipe method. */
/* Modify the options.reducers.addRecipe method. */
const options = {
  name: "favoriteRecipes",
  initialState: [],
  reducers: {
    addRecipe: (state, action) => {
      state.push(action.payload)
    },
    removeRecipe: (state, action) => {
      return state.filter(recipe => recipe.id !== action.payload.id)
    },
  },
}
```

## Return Object - Actions

So far we’ve taken a look at the object that is passed to `createSlice()`, but what exactly does it return? Using `todosSlice` from the previous exercise as an example, `createSlice()` would return an object that looks like this:

```jsx
const todosSlice = createSlice({
 name: 'todos',
 initialState: [],
 reducers: {
   addTodo(state, action) {
     const { id, text } = action.payload
     state.push({ id, text, completed: false })
   },
   toggleTodo(state, action) {
     const todo = state.find(todo => todo.id === action.payload)
     if (todo) {
       todo.completed = !todo.completed
     }
   }
 }
})
 
/* Object returned by todosSlice */
{
 name: 'todos',
 reducer: (state, action) => newState,
 actions: {
   addTodo: (payload) => ({type: 'todos/addTodo', payload}),
   toggleTodo: (payload) => ({type: 'todos/toggleTodo', payload})
 },
 // case reducers field omitted
}
```

Let’s break this down:

- `name` holds the value of the string that is used as the prefix for the generated action types.
- `reducer` is the complete reducer function (we’ll take a closer look at this in the next exercise).
- `actions` holds the the auto-generated action creators.

So, what do these auto-generated action objects look like? By default, the action creator accepts one argument, which it puts into the action object as `action.payload`. The `action.type` string is generated for us by combining the slice’s `name` field with the name of the case reducer function.

```jsx
console.log(todosSlice.actions.addTodo('walk dog'))
// {type: 'todos/addTodo', payload: 'walk dog'}
```

You’ll need to use the action creators in other files, so at a minimum you could export the entire slice object returned by `createSlice()`. However, we’ll use a Redux community code convention called the [“ducks” pattern](https://redux.js.org/style-guide/style-guide#structure-files-as-feature-folders-or-ducks), which suggests that we use named exports for the action creators and export them separately from the reducer.

```jsx
export const { addTodo, toggleTodo } = todosSlice.actions
```

**Tasks**

```jsx
/*
In favoriteRecipesSlice.js in the code editor, print the name of the slice to the console.

Using a for…in loop, print out the actions in the actions object.

Export the actions. Remember to use named exports for these
*/
console.log(favoriteRecipesSlice.name)
for (const action in favoriteRecipesSlice.actions) console.log(action)
export const { addRecipe, removeRecipe } = favoriteRecipesSlice.actions
```

## Return Object - Reducers

Let’s now take a closer look at `reducer` in the return object of `createSlice()`.

```jsx
const options = {
  // options fields omitted.
}
const todosSlice = createSlice(options);
 
/* Object returned by todosSlice */
{
 name: 'todos',
 reducer: (state, action) => newState,
 actions: {
   addTodo: (payload) => ({type: 'todos/addTodo', payload}),
   toggleTodo: (payload) => ({type: 'todos/toggleTodo', payload})
 },
 // case reducers field omitted
}
```

`todosSlice.reducer` is the complete reducer function, a.k.a the “slice reducer”.

When an action with the type `'todos/addTodo'` is dispatched, `todosSlice` will execute `todosSlice.reducer()` to check if the dispatched action’s `type` matches one of `todos.actions` case reducers. If so, it will run the matching case reducer function and if not, it will return the current state. This is exactly the same pattern that we had previously implemented with `switch`/`case` statements!

Finally, `todosSlice.reducer` needs to be exported so that it can be passed to the store and be used as the `todos` slice of state. While the `todosSlice.actions` are exported as named exports, the `todosSlice.reducer` value is used as the default export.

```jsx
export const { addTodo, toggleTodo } = todosSlice.actions;
export default todosSlice.reducer
```

**tasks**

```jsx
/*
In the code editor, print the entire object returned by createSlice(). 
Note how each action type corresponds to the name of a case reducer.


At the bottom of favoriteRecipesSlice.js, export the reducer as the default export.
*/
import { createSlice } from '@reduxjs/toolkit';
import { selectSearchTerm } from './searchTermSlice.js';

export const favoriteRecipesSlice = createSlice({
  name: "favoriteRecipes",
  initialState: [],
  reducers: {
    addRecipe: (state, action) => {
      state.push(action.payload);
    },
    removeRecipe: (state, action) => {
      return state.filter(recipe => recipe.id !== action.payload.id)
    },
  },
});

export const selectFavoriteRecipes = (state) => state.favoriteRecipes;

export const selectFilteredFavoriteRecipes = (state) => {
  const favoriteRecipes = selectFavoriteRecipes(state);
  const searchTerm = selectSearchTerm(state);

  return favoriteRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const {addRecipe, removeRecipe} = favoriteRecipesSlice.actions;

// Begin writing code here.
console.log(favoriteRecipesSlice)
export default favoriteRecipesSlice.reducer
```

Output task 1

```bash
{ name: 'favoriteRecipes',
  reducer: [Function],
  actions: 
   { addRecipe: 
      { [Function: actionCreator]
        toString: [Function],
        type: 'favoriteRecipes/addRecipe',
        match: [Function] },
     removeRecipe: 
      { [Function: actionCreator]
        toString: [Function],
        type: 'favoriteRecipes/removeRecipe',
        match: [Function] } },
  caseReducers: 
   { addRecipe: [Function: addRecipe],
     removeRecipe: [Function: removeRecipe] } }
```

## Converting the Store to Use `configureStore()`

Redux Toolkit has a `configureStore()` method that simplifies the store setup process. `configureStore()` wraps around the Redux library’s `createStore()` method and the `combineReducers()` method, and handles most of the store setup for us automatically.

For example, take a look at this file which creates and exports a `rootReducer`…

```jsx
// rootReducer.js
 
import { combineReducers } from 'redux'
 
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'
 
const rootReducer = combineReducers({
 // Define a top-level state field named `todos`, handled by `todosReducer`
 todos: todosReducer,
 visibilityFilter: visibilityFilterReducer
})
 
export default rootReducer
```

… and this file which creates and exports the `store`.

```jsx
// store.js
 
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
 
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
 
const store = createStore(rootReducer, composedEnhancer)
export default store
```

Now, let’s take a look at how we can refactor these two files using `configureStore()`. `configureStore()` accepts a single configuration object parameter. The input object should have a `reducer` property that defines either a function to be used as the root reducer, or an object of slice reducers which will be combined to create a root reducer.

[There are many properties available in this object](https://redux-toolkit.js.org/api/configureStore), but for the purposes of this lesson, just the `reducer` property will be sufficient.

```jsx
import { configureStore } from '@reduxjs/toolkit'
 
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'
 
const store = configureStore({
 reducer: {
   // Define a top-level state field named `todos`, handled by `todosReducer`
   todos: todosReducer,
   filters: filtersReducer
 }
})
 
export default store
```

Note all the work that this one call to `configureStore()` does for us:

- It combines `todosReducer` and `filtersReducer` into the root reducer function, which will handle a root state that looks like `{todos, filters}`, removing the need to call `combineReducers()`
- It creates a Redux store using that root reducer, removing the need to call `createStore()`
- It automatically adds the thunk middleware (which you will learn about in the next lesson!)
- It automatically adds more middleware to check for common mistakes like accidentally mutating the state
- It automatically sets up the Redux DevTools Extension connection

Because of how much boilerplate code we’re able to bypass with `configureStore()`, we can just import the individual slice reducers straight into this file instead of creating a separate file for the root reducer and having to export/import it. Since this is as simple as switching out the store setup code, all of the application’s existing feature code will work just fine!