# Redux Middleware

Out of the box, Redux may meet most of your app’s state management needs. But every project is different, and so Redux provides some ways to customize its behavior. One of the ways we can customize Redux is by adding *middleware*.

You may be familiar with middleware from experiences working with other frameworks. As the name suggests, middleware is the code that runs in the middle—usually between a framework receiving a request and producing a response. Middleware is a powerful tool for extending, modifying, or customizing a framework or library’s default behavior to meet an application’s specific needs.

In Redux, middleware runs between the moment when an action is dispatched and the moment when that action is passed along to the reducer. By this point you’re familiar with the way data flows through Redux: actions are dispatched to the store, where they are processed by reducers that produce new state; that new state becomes accessible to all the components that reference it, causing those components update. 

Middleware intercepts actions after they are dispatched and before they are passed along to the reducer. Some common tasks that middleware perform include logging, caching, adding auth tokens to request headers, crash reporting, routing, and making asynchronous requests for data. You can add any of these functionalities to your apps by using popular open-source middleware. Of course, you can also write your own middleware to solve problems that are specific to your application and its architecture.

To make asynchronous requests in our recipe app, we’re using `redux-thunk`, a middleware for handling asynchronous requests. There are several popular middleware that make asynchronous functionality compatible with Redux; we chose this one because it’s one of the most widely-employed, and it is included with Redux Toolkit by default. In subsequent exercises, we will walk through how `redux-thunk` makes asynchronous requests possible; for now, you should just understand where it sits in Redux’s data flow.

## Writing own Middleware

Before we get to `redux-thunk` specifically, we want to solidify our understanding of how middleware fits into Redux’s data flow. Let’s explore how middleware actually gets invoked in Redux, so that we know how a middleware should be structured. After that, we’re going to write a simple middleware from scratch. But first, you’ll recall from the previous exercise that middleware runs after an action is dispatched and before that action is passed along to the reducer. How does this actually work? To add a middleware to our project, we use Redux’s `applyMiddleware` function like so.

```jsx
import { createStore, applyMiddleware } from 'redux';
import { middleware1, middleware2, middleware3 } from './exampleMiddlewares';
import { exampleReducer } from './exampleReducer';
import { initialState} from './initialState';
 
const store = createStore(
  exampleReducer, 
  initialState, 
  applyMiddleware(
    middleware1, 
    middleware2, 
    middleware3
  )
);
```

Once middleware has been added to a Redux project, calls to `dispatch` are actually calls to the middleware pipeline (the chain of all added middlewares). This means that any actions we dispatch will be passed from middleware to middleware before they hit an app’s reducers. Middlewares must conform to a specific, nested function structure in order to work as part of the pipeline (this nested structure is also called a [higher-order function](https://eloquentjavascript.net/05_higher_order.html), if you’d like to read more). That structure looks like this:

```jsx
const exampleMiddleware = storeAPI => next => action => {
  // do stuff here
  return next(action);  // pass the action on to the next middleware in the pipeline
}
```

Each middleware has access to the `storeAPI` (which consists of the `dispatch` and `getState` functions), as well as the `next` middleware in the pipeline, and the `action` that is to be dispatched. The body of the middleware function performs the middleware’s specific task before calling the next middleware in the pipeline with the current action (note that if the middleware is the last in the pipeline, then `next` is `storeAPI.dispatch` so calling `next(action)` is the same as dispatching the action to the store).

**Tasks**

```jsx
/* index.js

Since all Redux middleware have the same basic structure, start by copying this snippet:

const logger = storeAPI => next => action => {
  // do stuff here
 
  return next(action);
};


Replace the comment '// do stuff here', with a line of code that logs the contents of the store
to the console. Remember, you can access the store’s state with storeAPI.getState().


Instead of returning next(action), store the result of that function call 
in a const called nextState. Next, log nextState to the console. Finally, return nextState


Apply your custom middleware to your store by adding a third argument to the call to createStore.
This argument should be the result of calling applyMiddleware with the logger middleware 
you’ve written.


Dispatch the following action to your store:

{
  type: 'NEW_MESSAGE', 
  payload: 'I WROTE A MIDDLEWARE'
}

*/

import { createStore, applyMiddleware } from 'redux';

const messageReducer = (state = '', action) => {
  if (action.type === 'NEW_MESSAGE') {
    return action.payload;
  } else {
    return state;
  }
}

// Paste the logger function here.
const logger = storeAPI => next => action => {
  console.log(storeAPI.getState());
  const nextState = next(action);
  console.log(nextState);
  return nextState;
};

// Solution Checker is dumb and forces this on one line
const store = createStore(messageReducer, '', applyMiddleware(logger));

store.dispatch({
  type: 'NEW_MESSAGE', 
  payload: 'I WROTE A MIDDLEWARE'
})

```

**output**

```bash
{ type: 'NEW_MESSAGE', payload: 'I WROTE A MIDDLEWARE' }
```

## Thunks

Recall that our overarching goal in this lesson is to give you the tools you need to add asynchronous functionality to your Redux apps. One of the most flexible and popular ways to add asynchronous functionality to Redux involves using thunks. A thunk is a higher-order function that wraps computation we want to perform later. For example, this `add` function returns a thunk that will perform `x+y` when called.

```jsx
const add = (x,y) => {
  return () => {
    return x + y; 
  } 
}
```

Thunks are helpful because they allow us to bundle up bits of computation we want to delay into packages that can be passed around in code. Consider these two function calls, which rely on the `add` function above and note that calling `add` does not cause the addition to happen – it merely returns a function that will perform the addition when called. To perform the addition, we must called `delayedAddition`.

```jsx
const delayedAddition = add(2,2)
delayedAddition() // => 4
```

**Tasks**

```jsx
/* index.js

Consider the function remindMeTo, which we’ve defined for you in the code editor. What do you think
will happen if you run remindMeTo('call mom')? Call console.log(remindMeTo('call mom')) in the code
editor to test your suspicion.


Logging remindMeTo('call mom') caused “Remember to call mom!!!” to appear in the console. 
Now write a function, remindMeLater, that takes a string, task, and returns a thunk 
that returns the result of calling remindMeTo with the argument task.


Call remindMeLater with a task you need to complete later and store the result 
in a variable reminder.


What do you think will happen when you call reminder? 
Test your hunch by calling reminder in your code editor and logging the result to the console.
*/
const remindMeTo = task => {
  return `Remember to ${task}!!!`;
}
console.log(remindMeTo('call mom'));

const remindMeLater = (task) => {
  return () => {
    return remindMeTo(task);
  }
}

const reminder = remindMeLater('groceries');
console.log(reminder);
console.log(reminder());
```

**Output**

```bash
Remember to call mom!!!
[Function]
Remember to groceries!!!
```

## 'redux-thunk'

To appreciate how thunks can help us integrate asynchronous actions into our Redux apps, let’s review the barriers to performing asynchronous operations that exist within traditional Redux. First, asynchronous logic returns promises, and `store.dispatch` expects to receive a plain object with a `type` property. Second, asynchronous operations create side effects. And so including them in our reducers would violate a core tenet of Redux, which is that [reducers must be pure functions](https://redux.js.org/tutorials/essentials/part-2-app-structure#rules-of-reducers).

Redux recommends making code with side effects part of the action creation process. It would be great if we could write action creators that return thunks, which would handle our asynchronous operations, in addition to the plain objects we’ve returned from our action creators thus far.

As it turns out, `redux-thunk` is a middleware that lets you do exactly that. `redux-thunk` makes it simple for you to write asynchronous logic that interacts with the store by allowing you to write action creators that return thunks instead of objects. These thunks can perform asynchronous operations, and per [the redux-thunk documentation](https://github.com/reduxjs/redux-thunk#motivation), “can be used to delay dispatching an action” (for example, until after an API response is received), or “to dispatch an action only if certain conditions are met”.

For example, imagine we’ve written a simple counter whose reducer contains a single value, which is updated by a single reducer. Without `redux-thunk` we are limited to writing synchronous action creators like this one:

```jsx
const increment = () => {
  return {
    type: 'counter/increment',
  }
}
```

When we call `dispatch(increment())`, the value in our store immediately increases. With `redux-thunk`, we can extend our counter app to accommodate asynchronous action creators, like `asyncIncrement`, in addition to synchronous ones.

```jsx
const incrementLater = async () => {
  setTimeout(() => {
    dispatch(increment())    
  }, 1000)    
};
 
const asyncIncrement = () => {
  return incrementLater;
}
```

*redux-thunk* is such a popular solution for handling asynchronous logic that it is included in Redux Toolkit. It also exists as a standalone package, but you won’t need to install `redux-thunk` separately if you use Redux Toolkit. This is because Redux Toolkit’s `configureStore` function, which you learned about in a previous lesson, will apply `redux-thunk` to the store by default.

**Tasks**

```jsx
/*
Import the configureStore method from the @reduxjs/toolkit module.
*/
import { configureStore } from '@reduxjs/toolkit'
```

## Writing thunks

To better appreciate redux-thunk, let’s review the process of retrieving data from a Redux store. For example, suppose we have a list of users’ data, and want to retrieve the data corresponding to the user with a particular `id = 32`. Assuming we have that user’s data in the store, we can access the user’s data by writing a selector to retrieve the information we need.

```jsx
useSelector((state) => state.users.byId[32]);
```

But what if we don’t have that particular user in the store? Say, for example, that we need to fetch the user’s data from an API. Ideally, we would like to be able to dispatch an action creator that would first perform an asynchronous operation (fetching the data), and then dispatch a synchronous action (adding the data to the store) after the asynchronous operation completes. This is where thunks come in handy. Up to this point, we’ve only written action creators that returned plain objects. But `redux-thunk` allows us to write action creators that return thunks, within which we can perform any asynchronous operations we like. Consider the following asynchronous action creator:

```jsx
import { fetchUser } from './api'
const getUser = (id) => {
  return async (dispatch, getState) => {
    const payload = await fetchUser(id);
    dispatch({type: 'users/addUser', payload: payload});
  }
}
```

`getUser` has two key parts: the synchronous outer function (otherwise known as the thunk action creator) which returns the inner, asynchronous thunk. The thunk receives `dispatch` and `getState` as arguments, and dispatches a synchronous action after the asynchronous operation (`fetchUser`) completes. To get the user with `id = 32`, we can call `dispatch(getUser(32))`. Note that the argument to `dispatch` is not an object, but an asynchronous function that will first fetch the user’s data and then dispatch a synchronous action once the user’s information has been retrieved.

**Tasks**

```jsx
/*
In your code editor, we’ve imported the function fetchRecipes, which makes an asynchronous request
to fetch all the recipes to be displayed in our familiar app. 
Write a thunk action creator called loadRecipes that asynchronously fetches the recipes 
and dispatches a synchronous action with type = allRecipes/addRecipes and payload equal 
to the payload you get when the asynchronous request completes.

*/
import { fetchRecipes } from '../../app/api'
import { createSlice } from "@reduxjs/toolkit";

// TO DO: write loadRecipes here!
const loadRecipes = () => {
  return async (dispatch, getState) => {
    const payload = await fetchRecipes();
    dispatch({type: 'allRecipes/addRecipes', payload: payload})
  }
}

export const allRecipesSlice = createSlice({
  name: "allRecipes",
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

## 'redux-thunk' Source Code

At this point, you are ready to use thunks to define asynchronous operations in Redux. But you may be curious about how `redux-thunk` works. In order to allow us to write action creators that return thunks in addition to plain objects, the `redux-thunk` middleware performs a simple check to the argument passed to `dispatch`. If `dispatch` receives a function, the middleware invokes it; if it receives a plain object, then it passes that action along to reducers to trigger state updates.

```jsx
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

Recall `getUser`, the thunk action creator from the previous exercise:

```jsx
const getUser = (id) => {
  return async (dispatch, getState) => {
    const payload = await fetchUser(id)
    dispatch({type: 'users/addUser', payload: payload})
  }
}
```

Suppose we were to call `dispatch(getUser(7))` with the thunk middleware applied. We know that `getUser(7)` returns a thunk, so on line 3 of the thunk middleware, `typeof action === 'function'` will evaluate to `true`. On line 4, the middleware will then invoke `getUser(7)` with the arguments `dispatch` and `getState`. This invocation will initiate the asynchronous fetching performed by the thunk. When that asynchronous fetching is complete, the thunk will dispatch the synchronous action `{type: ‘users/addUser’, payload: payload}`.

For contrast, let’s walk through what happens when we dispatch that synchronous action. Since the action is a plain object, `typeof action === 'function'` will evaluate to `false`. The `redux-thunk` middleware therefore skips to line 7, and invokes the next middleware in the pipeline, passing the action along.

## Review

In this lesson you:

- Learned about Redux middleware and wrote your own simple logging middleware
- Encountered thunks and learned about how valuable thunks are for deferring computation

```jsx
const remindMeLater = task => { 
  return () => {
    remindMeTo(task)
  } 
} 
```

- Discovered `redux-thunk`, a middleware that allows you to write asynchronous action creators that return thunks instead of objects
- Automatically enabled `redux-thunk` by using `configureStore`

```
import { configureStore } from '@reduxjs/toolkit;
```

- Took a deep dive into the middleware’s source code, in order to understand how the middleware actually works
- Wrote your own asynchronous action creators in the format that `redux-thunk` expects

```jsx
const getUser = (id) => {
  return async (dispatch, getState) => {
    const payload = await fetchUser(id)
    dispatch({type: 'users/addUser', payload: payload})
  }
}
```

If you’d like to learn more, you can read the [`redux-thunk` documentation](https://github.com/reduxjs/redux-thunk) and [visit the Redux Toolkit site to see how `configureStore` includes `redux-thunk` by default](https://redux-toolkit.js.org/api/getDefaultMiddleware#getdefaultmiddleware).

