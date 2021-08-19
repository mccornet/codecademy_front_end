# Managing Promise Lifecyle Actions

At this point, you can write a Redux app that uses `redux-thunk`—a middleware included in Redux toolkit—to permit asynchronous operations, such as fetching data from an API. In this lesson, we will explore some common patterns for managing asynchronous operations and the state changes they cause. We will learn about two Redux toolkit utilities—`createAsyncThunk` and the `extraReducers` option you can pass to the `createSlice` function—that simplify the process of performing asynchronous operations and reflecting their results in state.

## Promise Lifecycle Actions

In a perfect world, every network request we make would yield an immediate and successful response. But network requests can be slow, and sometimes fail. As developers, we need to account for these realities in order to create the best possible experience for our users. If we know a request is pending, we can make our application more user-friendly by displaying a loading state. Similarly, if we know a request has failed, we can display an appropriate error state.

In order to create these satisfying user experiences, we need to keep track of the state our async requests are in at any given moment so that we can reflect those states for the user. It is common to dispatch a “pending” action right before performing an asynchronous operation, and “fulfilled” or “rejected” actions depending on the results of the completed operation. Take this simple thunk action creator, `fetchUserById`.

```jsx
import { fetchUser } from './api';
 
const fetchUserById = (id) => {
  return async (dispatch, getState) => {
    const payload = await fetchUser(id);
    dispatch({type: 'users/addUser', payload: payload});
  }
}
```

Rewritten to include pending and rejected actions, it might look like this:

```jsx
import { fetchUser } from './api'
const fetchUserById = (id) => {
  return async (dispatch, getState) => {
    dispatch({type: 'users/requestPending'})
    try {
      const payload = await fetchUser(id)
      dispatch({type: 'users/addUser', payload: payload})
    } catch(err) {
      dispatch({type: 'users/error', payload: err})
    }
  }
}
```

We call these pending/fulfilled/rejected actions *promise lifecycle actions*. This pattern is so common that Redux Toolkit provides a neat abstraction, `createAsyncThunk`, for including promise lifecycle actions in your Redux apps. 

## createAsyncThunk()

`createAsyncThunk` is a function with two parameters —an action type string and an asynchronous callback— that generates a thunk action creator that will run the provided callback and automatically dispatch promise lifecycle actions as appropriate so that you don’t have to dispatch pending/fulfilled/rejected actions by hand. To use `createAsyncThunk`, you’ll first need to import it from Redux Toolkit like so:

```jsx
import { createAsyncThunk } from '@reduxjs/toolkit';
```

Next, you’ll need to call `createAsyncThunk`, passing two arguments. The first is a string representing the asynchronous action’s type. Conventionally, type strings take the form `"resourceType/actionName"`. In this case, since we are getting an individual user by their `id`, our action type will be `users/fetchUserById`. The second argument to `createAsyncThunk` is the payload creator: an asynchronous function that returns a promise resolving to the result of an asynchronous operation. Here is `fetchUserById` rewritten using `createAsyncThunk`:

```jsx
import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchUser } from './api'
const fetchUserById = createAsyncThunk(
  'users/fetchUserById', // action type
  async (arg, thunkAPI) => { // payload creator
    const response = await fetchUser(arg);
    return response.json();
  }
)
```

There are a few things worth highlighting here. First, observe that the payload creator receives two arguments—`arg` and `thunkAPI`. Second, note that the payload creator we provided doesn’t dispatch any actions at all. It just returns the result of an asynchronous operation. As you can see, `createAsyncThunk` makes defining thunk action creators more concise. All you have to write is an asynchronous thunk function; `createAsyncThunk` takes care of the rest, returning an action creator that will dispatch pending/fulfilled/rejected actions as appropriate.

**Tasks**

```jsx
/* allRecipesSlice.js

In the code editor, we’ve provided loadRecipes, the asynchronous action creator you wrote
in the last lesson. Now we’re going to refactor it using createAsyncThunk. 
To start, import createAsyncThunk from Redux toolkit 
(make sure you continue to import createSlice as well).


Refactor loadRecipes using createAsyncThunk. 
Remember, createAsyncThunk takes two arguments: 
  - an action type string
  - and a payload creator function. 
  
Your action type string should be 'allRecipes/loadRecipes'. 
Your payload creator should retrieve the recipes by calling fetchRecipes, 
which we’ve imported for you. 
Once the recipes are fetched, you should return their json data, which you can access 
by calling .json() on the response to your call to fetchRecipes. 
Note: .json() is asynchronous, so you’ll want to await the result of that call.

*/
import { fetchRecipes } from '../../app/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/* old code
const loadRecipes = () => {
  return async (dispatch) => {
    const recipes = await fetchRecipes()
    dispatch({type: 'allRecipes/addRecipes', payload: recipes})
  }
}; */
const loadRecipes = createAsyncThunk(
  'allRecipes/loadRecipes',
  async (arg, thunkAPI) => {
    const recipes = await fetchRecipes();
    const recipes_json = await recipes.json();
    return recipes_json;
  }
)

export const allRecipesSlice = createSlice({
  name: 'allRecipes',
  initialState: {
    recipes: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {
    addRecipes(state, action) {
      state.recipes = action.payload
    }
  },  
});

export default allRecipesSlice.reducer;
```

## Passing Arguments to Thunks

In the last exercise, we promised to elaborate on the two arguments that the payload creator (the asynchronous function we pass to `createAsyncThunk`) receives: `arg` and `thunkAPI`. The first argument, `arg`, will be equal to the first argument passed to the thunk action creator itself. For example, if we call `fetchUserById(7)`, then inside the payload creator, `arg` will be equal to 7.

But what if you need to pass multiple arguments to your thunk? Since the payload creator only receives the first argument passed to the thunk action creator, you’ll want to bundle multiple arguments into a single object. For example, say we want to search our app’s users by first and last name. If the thunk action creator is called `searchUsers`, we would call it like this: `searchUsers({firstName: 'Ada', lastName: 'Lovelace'})`. If you need to access these variables individually, you can use ES6 destructuring assignment to unpack the object when you declare the payload creator and pass it to `createAsyncThunk`, like this :

```
const searchUsers = createAsyncThunk(
    'users/searchUsers',
    async ({ firstName, lastName}, thunkAPI) => {
        // perform the asynchronous search request here    
    }
)
```

If your thunk requires no arguments, you can just call your thunk action creator without, and the `arg` argument will be undefined. In the event the thunk requires only one param (for example, fetching a specific resource by `id`) you should name that first param semantically. Here’s the `fetchUserById` example from the last exercise, with the `arg` parameter semantically renamed to `userId`.

```jsx
import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchUser } from './api'
const fetchUserById = createAsyncThunk(
    'users/fetchUserById', // action type
    async (userId, thunkAPI) => { // payload creator
        const response = await fetchUser(userId)
        return response.data
    }
)
```

The payload creator’s second argument, `thunkAPI`, is an object containing several useful methods, including the store’s `dispatch` and `getState`. [For an exhaustive list of methods available in the `thunkAPI` object, you can read the documentation](https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator).

**Tasks**

```jsx
/*
In the code editor, we’ve defined a thunk action creator searchRecipesByName. 
Rename arg to the semantically appropriate variable name recipeName.
*/
import { createAsyncThunk } from "@reduxjs/toolkit" 
import { searchRecipes } from './api'

// const searchRecipesByName = createAsyncThunk(
//   'recipes/searchRecipesByName',
//   (arg, thunkAPI) => {
//     const response = await searchRecipes(arg)
//     return response.data
//   }
// )

const searchRecipesByName = createAsyncThunk(
  'recipes/searchRecipesByName',
  (recipeName, thunkAPI) => { // change 1
    const response = await searchRecipes(recipeName) // change 2
    return response.data
  }
)
```

## Actions Generated by createAsyncThunk()

As you know, `createAsyncThunk` takes care of dispatching actions for each of the promise lifecycle states: pending, fulfilled, and rejected. But what exactly do these actions look like?

Building off the action type string you pass to it, `createAsyncThunk` produces an action type for each promise lifecycle states. If you pass the action type string `'resourceType/actionType'` to `createAsyncThunk`, it will produce these three action types:

- `'resourceType/actionType/pending'`
- `'resourceType/actionType/fulfilled'`
- `'resourceType/actionType/rejected'`

To use our earlier example:

```jsx
import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchUser } from './api'
 
const fetchUserById = createAsyncThunk(
  'users/fetchUserById', // action type
  async (userId, thunkAPI) => { // payload creator
    const response = await fetchUser(userId)
    return response.data
  }
)
```

When you pass `createAsyncThunk` the action type string `'users/fetchUserById'`, `createAsyncThunk` producers these three actions types:

- `'users/fetchUserById/pending'`
- `'users/fetchUserById/fulfilled'`
- `'users/fetchUserById/rejected'`

If you need to access the individual pending/fulfilled/rejected action creators, you can reference them like this:

- `fetchUserById.pending`
- `fetchUserById.fulfilled`
- `fetchUserById.rejected`

You will have to handle these action types in your reducers if you want to reflect these promise lifecycle states in your app.

**Tasks**

```jsx
/*
In the code editor, we’ve used createAsyncThunk to define a thunk action creator, loadRecipes. 
What three action type strings are generated by the call to createAsyncThunk? 
Write out the three strings in your code editor in the comments below the call to loadRecipes.
*/
import { fetchRecipes } from '../../app/api'
import { createAsyncThunk } from "@reduxjs/toolkit";

const loadRecipes = createAsyncThunk(
  'allRecipes/loadRecipes',
  (arg, thunkAPI) => {
    const response = await fetchRecipes();
    return response.data
  }
)
// The above call to createAsyncThunk will generate what three action types?
// 1. allRecipes/loadRecipes/pending
// 2. allRecipes/loadRecipes/fulfilled
// 3. allRecipes/loadRecipes/rejected
```

## Using createSlice() with Async Action Creators

In a previous lesson, you learned about `createSlice`. In this lesson, you will learn about `extraReducers`, a property you can optionally pass to `createSlice` that allows `createSlice` to respond to action types it did not generate. To refresh your memory, `createSlice` accepts a single argument, `options`, which is an object containing configuration parameters including a name, some initial state, and reducers. `createSlice` then uses these configuration parameters to generate a slice of the store, including action creators and action types for updating the state contained in that slice. Consider the following example:

```jsx
const usersSlice = createSlice({
  name: 'users',
  initialState: { users:  [] },
  reducers: {
    addUser: (state, action) => { 
      state.users.push(action.payload) 
    }        
  },
})
```

This call to `createSlice`, generates a slice of the store that responds to the action creator `usersSlice.actions.addUser`. But what if we’ve generated our action creators via calls to `createAsyncThunk`? Consider `fetchUserById`, the asynchronous action creator from earlier in this lesson:

```jsx
const fetchUserById = createAsyncThunk(
  'users/fetchUserById', // action type
  async (userId, thunkAPI) => { // payload creator
    const response = await fetchUser(arg)
    return response.data
  }
)
```

This asynchronous action creator will generate three action types: `'users/fetchUserById/pending'`, `'users/fetchUserById/fulfilled'`, and `'users/fetchUserById/rejected'`. Currently, these action types have no effect on our users slice, which only responds to the `users/addUser` action type generated by `createSlice`. How can we account for these promise lifecycle action types in our user slice? This is exactly the problem that `extraReducers`, an optional property on the configuration object passed to `createSlice`, was designed to solve. `extraReducers` allows `createSlice` to respond to action types generated elsewhere. To make the users slice respond to promise lifecycle action types, we pass them to `createSlice` in the `extraReducers` property. 

*Example Code: userSlice.js*

```jsx
const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId) => {
    const users = await fetch(`api/users${userId}`)
    const data = await users.json()
    return data
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: { 
    users:  [], 
    isLoading: false, 
    hasError: false 
  },
  reducers: {
    addUser: (state, action) => { 
      state.users.push(action.payload) 
    }        
  },
},
extraReducers: {
  [fetchUserById.pending]: (state, action) => ({
    state.isLoading = true;
    state.hasError = false;
   }),
  [fetchUserById.fulfilled]: (state, action) => ({
    state.users.push(action.payload);
    state.isLoading = false;
    state.hasError = false;
  }),
  [fetchUserById.rejected]: (state, action) => ({
    state.isLoading = false;
    state.hasError = true;
  })
})
```

Note that in addition to using the `extraReducers` property, we also added some extra fields to our state object: a boolean, `isLoading`, which will be true when a request is pending, and otherwise false, and a boolean `hasError`, which we will set to `true` if our request to fetch a user is rejected. These additions will allow us to simply track promise lifecycle states so that we can create satisfying and informative user interfaces.

**Tasks**

```jsx
/*
In allRecipesSlice.js, we’ve used createAsyncThunk to define loadRecipes, an asynchronous action
creator that fetches all our app’s recipes, and createSlice to define a slice of recipes in our
app’s store.

Add two booleans — isLoading and hasError — to the initialState property passed to createSlice. 
What should their initial values be? 
When the app first runs there is no error or loading going on: false


Using the extraReducers property, add reducers for each of the promise lifecycle action types generated by createAsyncThunk.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../favoriteRecipes/favoriteRecipesSlice";
import { selectSearchTerm } from "../search/searchSlice";
export const loadRecipes = createAsyncThunk(
  "allRecipes/getAllRecipes",
  async () => {
    const data = await fetch("api/recipes?limit=10");
    const json = await data.json();
    return json;
  }
);

const extraReducers = {
  [loadRecipes.pending]: (state, action) => {
    state.isLoading = true;
    state.hasError = false;
  },
  [loadRecipes.fulfilled]: (state, action) => {
    state.recipes = action.payload;
    state.isLoading = false;
    state.hasError = false;
  },
  [loadRecipes.rejected]: (state, action) => {
    state.isLoading = false;
    state.hasError = true;
  }
}

const sliceOptions = {
  name: "allRecipes",
  initialState: {
    recipes: [],
    isLoading: false,
    hasError: false
  },
  reducers: {},
  extraReducers: extraReducers
}

export const allRecipesSlice = createSlice(sliceOptions);

export const selectAllRecipes = (state) => state.allRecipes.recipes;

export const selectFilteredAllRecipes = (state) => {
  const allRecipes = selectAllRecipes(state);
  const searchTerm = selectSearchTerm(state);

  return allRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export default allRecipesSlice.reducer;

```

> What about the app’s behavior has changed? While the recipes are being fetched, the app displays a loading spinner. And if the recipes fail to fetch, the app displays an error message.
>
> Why does the app behave differently when you pass extra Reducers to `createSlice`? Adding the extra reducers to the recipes slice causes the store to update in response to each of the pending/fulfilled/rejected actions dispatched by `loadRecipes`. These changes are reflected in the app’s UI.

## Review

In this lesson you:

- Learned the three *promise lifecycle actions*: pending, fulfilled, and rejected
- Learned how to use `createAsyncThunk`, which abstracts the process of handling promise lifecycle states according to best practices/common design paradigms
- Imported `createAsyncThunk` from the Redux Toolkit:

```
import { createAsyncThunk } from '@reduxjs/toolkit';
```

- Refactored existing asynchronous action creators using `createAsyncThunk`.
- Made your reducers respond to pending/fulfilled/rejected promise lifecycle actions by supplying the extraReducers property to `createSlice`.

> For comparison we’ve included the “old” way of doing things–manually handling the promise lifecycle actions–in **oldAllRecipesSlice.js** and the “new” way of doing things–with `createAsyncThunk()` and the `extraReducers` property in `createSlice()`–in **allRecipesSlice.js**. Take a moment to review these two files and cement your understanding of the difference between them.

**Old**

```jsx
// Without createAsyncThunk, we have to dispatch pending/fulfilled/rejected actions ourself.
export const loadRecipes = () => {
  return async (dispatch, getState) => {
    dispatch({type: "allRecipes/getAllRecipes/pending"})
    try {
      const data = await fetch("api/recipes?limit=10");
      const json = await data.json(); 
      dispatch({type: "allRecipes/getAllRecipes/fulfilled", payload: json})
    } catch (err) {
      dispatch({type: "allRecipes/getAllRecipes/rejected", payload: err})
    }   
  }
}
```

**New**

```jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../favoriteRecipes/favoriteRecipesSlice";
import { selectSearchTerm } from "../search/searchSlice";

// createAsyncThunk simplifies our Redux app by returning an action creator that dispatches promise lifecycle actions for us so we don't have to dispatch them ourselves.
export const loadRecipes = createAsyncThunk(
  "allRecipes/getAllRecipes",
  async () => {
    const data = await fetch("api/recipes?limit=10");
    const json = await data.json();
    return json;
  }
);

const sliceOptions = {
  name: "allRecipes",
  initialState: {
    recipes: [],
    isLoading: false,
    hasError: false
  },
  reducers: {},
  extraReducers: {
    [loadRecipes.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [loadRecipes.fulfilled]: (state, action) => {
      state.recipes = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [loadRecipes.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    }
  }
}

export const allRecipesSlice = createSlice(sliceOptions);

export const selectAllRecipes = (state) => state.allRecipes.recipes;

export const selectFilteredAllRecipes = (state) => {
  const allRecipes = selectAllRecipes(state);
  const searchTerm = selectSearchTerm(state);

  return allRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export default allRecipesSlice.reducer;
```

