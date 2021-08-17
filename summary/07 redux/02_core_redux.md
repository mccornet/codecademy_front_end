# Redux Core API

What is the Redux API?

In this lesson, you will learn how to apply the core concepts of Redux to a real Redux application.

Remember, Redux applications are built upon a one-way flow of data model and are managed by the *store*:

- The *state* is the set of data values that describes the application. It is used to render the user interface (UI).
- Users interact with the UI which dispatch *actions* to the store. An action is an object that expresses a desired change to the state.
- The store generates its next state using a *reducer* function which receives the most recent action and the current state as inputs.
- Finally, the UI is re-rendered based on the new state of the store and the entire process can begin again.

Building an application that follows the core principles of Redux can be done without external libraries. However, the dedicated [Redux library](https://redux.js.org/) provides some very useful tools for handling the most common aspects of building a Redux application and helps ensure that the core Redux principles are enforced.

This lesson will focus on creating a basic Redux application with the `createStore()` method from the Redux API and the following related `store` methods:

- `store.getState()`
- `store.dispatch(action)`
- `store.subscribe(listener)`

*Note: The store method `store.replaceReducer(nextReducer)` is an advanced method and will not be covered in this course.*

## Installing Redux

What is the Redux API?

In this lesson, you will learn how to apply the core concepts of Redux to a real Redux application.

Remember, Redux applications are built upon a one-way flow of data model and are managed by the *store*:

- The *state* is the set of data values that describes the application. It is used to render the user interface (UI).
- Users interact with the UI which dispatch *actions* to the store. An action is an object that expresses a desired change to the state.
- The store generates its next state using a *reducer* function which receives the most recent action and the current state as inputs.
- Finally, the UI is re-rendered based on the new state of the store and the entire process can begin again.

Building an application that follows the core principles of Redux can be done without external libraries. However, the dedicated [Redux library](https://redux.js.org/) provides some very useful tools for handling the most common aspects of building a Redux application and helps ensure that the core Redux principles are enforced.

This lesson will focus on creating a basic Redux application with the `createStore()` method from the Redux API and the following related `store` methods:

- `store.getState()`
- `store.dispatch(action)`
- `store.subscribe(listener)`

*Note: The store method `store.replaceReducer(nextReducer)` is an advanced method and will not be covered in this course.*

```bash
npm install redux
```

```jsx
import { createStore } from 'redux';
```

## Create a Redux Store

Create a Redux Store

As you know, every Redux application uses a reducer function that describes which actions can update the state and how those actions lead to the next state.

For example, suppose you wanted to build an application for a light switch. Its reducer might look like this:

```jsx
const initialState = 'on';
const lightSwitchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggle':
      return state === 'on' ? 'off' : 'on';
    default:
      return state;
  }
}
```

This reducer handles a single action type `'toggle'` and returns the next state of the store: `'on'` if it had been `'off'` and vice-versa. If an unrecognized action is received, the current state of the store is returned.

The programmer could manually execute the reducer with the current state of the store and the desired action to perform like so:

```jsx
let state = 'on';
state = lightSwitchReducer(state, { type: 'toggle' });
console.log(state); // Prints 'off'
```

However, this is the main responsibility of the `store`. The `store` is an object that enforces the one-way data flow model that Redux is built upon. It holds the current state inside, receives action dispatches, executes the reducer to get the next state, and provides access to the current state for the UI to re-render.

Redux exports a valuable helper function for creating this `store` object called `createStore()`. The `createStore()` helper function has a single argument, a reducer function.

To create a `store` with `lightSwitchReducer`, you could write:

```jsx
import { createStore } from 'redux'
 
const initialState = 'on';
const lightSwitchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggle':
      return state === 'on' ? 'off' : 'on';
    default:
      return state;
  }
}
 
const store = createStore(lightSwitchReducer);
```

For the remainder of this lesson, you will be building a simple counter application, whose state is a single number, using the Redux library.

In the code editor, you will find the `initialState` value as well as `countReducer`, which describes how the state can be updated in response to an `'increment'` action.

## Dispatching Actions to the Store

Dispatch Actions to the Store

The `store` object returned by `createStore()` provides a number of useful methods for interacting with its state as well as the reducer function it was created with.

The most commonly used method, `store.dispatch()`, can be used to dispatch an action to the store, indicating that you wish to update the state. Its only argument is an action object, which must have a `type` property describing the desired state change.

```jsx
const action = { type: 'actionDescriptor' }; 
store.dispatch(action);
```

Each time `store.dispatch()` is called with an `action` object, the store’s reducer function will be executed with the same `action` object. Assuming that the `action.type` is recognized by the reducer, the state will be updated and returned.

Let’s see how this works in the lightswitch application from the last exercise:

```jsx
import { createStore } from 'redux';
 
const initialState = 'on';
const lightSwitchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggle':
      return state === 'on' ? 'off' : 'on';
    default:
      return state;
  }
}
 
const store = createStore(lightSwitchReducer);
 
console.log(store.getState()); // Prints 'on'
 
store.dispatch({ type: 'toggle' }); 
console.log(store.getState()); // Prints 'off'
 
store.dispatch({ type: 'toggle' });
console.log(store.getState()); // Prints 'on'
```

In this example, you can also see another `store` method, `store.getState()`, which returns the current value of the store’s state. Printing its value between each dispatched action allows us to see how the store’s state changes.

Internally, when the `store` executes its reducer, it uses `store.getState()` as the `state` argument. Though you won’t see it, you can imagine that, when an action is dispatched like this…

```jsx
store.dispatch({ type: 'toggle'});
```

…the store calls the reducer like this:

```jsx
lightSwitchReducer(store.getState(), { type: 'toggle' });
```

## Action Creators

Action Creators

As you saw in the last exercise, you are likely to dispatch actions of the same type multiple times or from multiple places. Typing out the entire action object can be tedious and creates opportunities to make an error.

For example, in the light switch application, whose reducer accepts `'toggle'` actions to turn the light `'on'` or `'off'`, you might write:

```jsx
store.dispatch({Type:'toggle'});
store.dispatch({type:'toggel'});
store.dispatch({typo:'toggle'});
```

Did you spot the errors?

In most Redux applications, *action creators* are used to reduce this repetition and to provide consistency. An action creator is simply a function that returns an action object with a `type` property. They are typically called and passed directly to the `store.dispatch()` method resulting in fewer errors and an easier-to-read dispatch statement.

The above code could be rewritten using an action creator called `toggle()` like so:

```jsx
const toggle = () => {
  return { type: "toggle" };
}
store.dispatch(toggle()); // Toggles the light to 'off'
store.dispatch(toggle()); // Toggles the light back to 'on'
store.dispatch(toggle()); // Toggles the light back to 'off'
```

Though not necessary in a Redux application, action creators save us the time needed to type out the entire action object, reduce the chances you make a typo, and improve the readability of our application.

Often, before the reducer of an application is even written, Redux programmers will write action creators as a way of planning out which actions will be available to dispatch to the store.

## Responding to State Changes

Respond to State Changes

In a typical web application, user interactions that trigger [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events) (`"click"`, `"keydown"`, etc…) can be listened for and responded to using an [event listener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

Similarly, in Redux, actions dispatched to the `store` can be listened for and responded to using the `store.subscribe()` method. This method accepts one argument: a function, often called a *listener*, that is executed in response to changes to the `store`‘s state.

```jsx
const reactToChange = () => console.log('change detected!');
store.subscribe(reactToChange);
```

In this example, each time an action is dispatched to the `store`, and a change to the state occurs, the subscribed listener, `reactToChange()`, will be executed.

Sometimes it is useful to stop the listener from responding to changes to the `store`, so `store.subscribe()` returns an `unsubscribe` function.

We can see this in action in the light switch application:

```jsx
// lightSwitchReducer(), toggle(), and store omitted...
 
const reactToChange = () => {
  console.log(`The light was switched ${store.getState()}!`);
}
const unsubscribe = store.subscribe(reactToChange);
 
store.dispatch(toggle());
// reactToChange() is called, printing:
// 'The light was switched off!'
 
store.dispatch(toggle());
// reactToChange() is called, printing:
// 'The light was switched on!'
 
unsubscribe(); 
// reactToChange() is now unsubscribed
 
store.dispatch(toggle());
// no print statement!
 
console.log(store.getState()); // Prints 'off'
```

- In this example, the listener function `reactToChange()` is subscribed to the `store`
- Each time an action is dispatched, `reactToChange()` is called and prints the current value of the light switch. It is common for callbacks subscribed to the `store` to use `store.getState()` inside them.
- After the first two dispatched actions, `unsubscribe()` is called causing `reactToChange()` to no longer be exectued in response to further dispatches made to `store`.

> *Note: It is not always required to use the `unsubscribe()` function returned by `store.subscribe()`, though it is useful to know that it exists.*

Now, take a look at **store.js** in the code editor. You will see that a few actions have been dispatched to the `store` of the counter application. Suppose you wanted to print the current value of `store.getState()` each time the state changes. While you could write something like this…

```jsx
store.dispatch(decrement());
console.log(`The count is ${store.getState()}`);
store.dispatch(increment());
console.log(`The count is ${store.getState()}`);
store.dispatch(increment());
console.log(`The count is ${store.getState()}`);
```

…we know that this approach is repetitive. Instead, you can subscribe a change listener to print out the current state in response to state changes automatically.

## Connecting Redux to UI

Connect the Redux Store to a UI

Up until now, you have built a working counting application using Redux that lacks a proper user interface (UI). Let’s change that!

The UI for this application should display the current count number and allow the user to increment or decrement this value using the buttons provided. Take a look at the connected web browser window and you can see that the elements for such an interface are present, but they haven’t been connected to the Redux store yet.

Connecting a Redux store with any UI requires a few consistent steps, regardless of how the UI is implemented:

- Create a Redux store
- Render the initial state of the application.
- Subscribe to updates. Inside the subscription callback:
  - Get the current store state
  - Select the data needed by this piece of UI
  - Update the UI with the data
- Respond to UI events by dispatching Redux actions

These same steps are followed when building an interface using React, Angular, or jQuery. For now, we’ll create a very simple user interface for the counting application using the [HTML DOM API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API).

Open up the **index.html** file and you can see the three HTML elements that are currently being rendered:

```jsx
<p id='counter'>Waiting for current state.</p>
<button id='incrementer'>+</button>
<button id='decrementer'>-</button>
```

Now, open up **store.js** where you will find the pieces of Redux code that you have built throughout this lesson: the action creators `increment()` and `decrement()`, the reducer `countReducer`, and the `store` that ties it all together. Additionally, the following values have been added:

- `counterElement`, `incrementer`, and `decrementer`: references to the HTML elements in **index.html**
- `render`: A state-change listener for responding to changes to the `store`‘s state.
- `incrementerClicked` and `decrementerClicked`: DOM event handlers for responding to the buttons being clicked by the user.

These new functions and elements will allow us to plug the Redux `store` into the UI. Let’s begin.

## React and Redux

React and Redux

As you saw in the last exercise, Redux can be used within the context of any UI framework, though it is most commonly paired with React. This makes sense considering that React and Redux were both developed by [engineers at Facebook](https://en.wikipedia.org/wiki/Redux_(JavaScript_library)#History).

We can be more specific about the common steps involved in connecting Redux to a React UI:

- A `render()` function will be subscribed to the `store` to re-render the top-level React Component.
- The top-level React component will receive the current value of `store.getState()` as a `prop` and use that data to render the UI.
- Event listeners attached to React components will dispatch actions to the `store`.

Take a look at **store.js** in the code editor. Here, you can see the completed light switch application following this pattern.

- The `render()` function is subscribed to the `store`.
- `store.getState()` is passed as a `prop` called `state` to the `<LightSwitch />` component.
- The `LightSwitch` component displays the current state of the store, either `'on'` or `'off'`, and adjusts the background colors accordingly.
- The `LightSwitch` component declares a click handler that dispatches a `toggle()` action to the `store`.

> *Note 1: The prop name `state` isn’t a special React name and can be customized as the programmer sees fit. For example, `lightSwitchState={store.getState()}` would also be valid.*

## Implementing a React + Redux app

> Now that you have implemented the counter app using the HTML DOM API, and have seen a working React+Redux application, it is time to implement it using React.
>
> Take a look at the **store.js** file and you will find the following functions and values have been defined for you:
>
> - The action creators `increment()` and `decrement()`
> - The `store` and its reducer `countReducer()`
> - A React component called `CounterApp` which declares two event handlers, `onIncrementButtonClicked` and `onDecrementButtonClicked`
> - A `render()` function which renders `CounterApp` using `ReactDOM.render()`
>
> The React component `CounterApp` and the `render()` function are entirely disconnected from the Redux store. Let’s change that!

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

// REDUX CODE
///////////////////////////////////

const increment = () => {
  return {type: 'increment'} 
}

const decrement = () => { 
  return {type: 'decrement'}
}

const initialState = 0;
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return state; 
  }
} 

const store = createStore(counterReducer);

// REACT CODE
///////////////////////////////////


/* STEP 2

The CounterApp component should display the current state of the store. Before it can display the current state, it must be given the current state value.

Within the render() function, pass a prop value to CounterApp called state. Its value should be the current state of the store. Your render() function should look something like this:

const render = () => {
  ReactDOM.render(
    <CounterApp 
      state={currentStateValueGoesHere} 
    />,
    document.getElementById('root')
  )
}

*/


const render = () => {
  ReactDOM.render(
    <CounterApp 
      state={store.getState()}
    />,
    document.getElementById('root')
  )
}

/* STEP 1. 

First, below the render() function’s definition, call render() once to render the UI with the initial state.

*/

// Render once with the initial state.
// Subscribe render to changes to the store's state.

/* STEP 5, CONFLICTS WITH CODE COMMENTS!
Well done! So far we can display the current state and dispatch action from the <CounterApp /> - all that’s left is to re-render the component every time the state changes.

At the bottom of store.js, subscribe the render function to the store.
*/
render();
store.subscribe(render);

function CounterApp(props) {
/* STEP 3

Now that the current state of the store is being passed to the CounterApp component, it can render that data in the UI.

First, at the top of the CounterApp() function, declare a variable called state. It should be assigned the value of props.state.

Then, modify the <h1> element inside the return statement of render() such that it displays the current state.

*/
  
  // OBJECT DESTRUCTURING FAILS THE BUILT IN TEST!
  //const {state} = props;
  const state = props.state;

    
 /* STEP 4
 
At this point, your user interface should be displaying the current state of the store, 0. The next step is to update the state when either of the buttons are pressed. 

First, modify the onIncrementButtonClicked event handler such that it dispatches an increment() action to the store.

Then, modify the onDecrementButtonClicked event handler such that it dispatches a decrement() action to the store.

*/
 
  const onIncrementButtonClicked = () => {
    // Dispatch an 'increment' action.
    store.dispatch(increment());
  }
 
  const onDecrementButtonClicked = () => {
    // Dispatch an 'decrement' action.
    store.dispatch(decrement());
  }
  
  return (   
    <div id='counter-app'>
      <h1> {state} </h1>
      <button onClick={onIncrementButtonClicked}>+</button> 
      <button onClick={onDecrementButtonClicked}>-</button>
    </div>
  )
}
```

## Review

Congratulations! You were able to apply the core concepts of the Redux framework by implementing an application using the Redux library.

By completing this lesson, you are now able to:

- Install the redux library into your project using `npm install redux`.
- Import the `createStore()` helper function from the `'redux'` library.
- Create a `store` object that holds the entire state of your Redux application using `createStore()`.
- Get the current state of the `store` using `store.getState()`.
- Dispatch actions to the `store` using `store.dispatch(action)`.
- Create action creators to reduce the repetitive creation of action objects.
- Register a change listener function to respond to changes to the store using `store.subscribe(listener)`.
- Recognize the pattern for connecting Redux to any user interface.
- Implement a Redux application using either the HTML DOM API or React.

Throughout this lesson, you may have thought to yourself that Redux adds a lot of unnecessary complexity to these simple applications. We implemented Redux in a very basic way, which is useful for learning but not how it’s done in the real world.

Redux shines when it is used in applications with many features and a lot of data where having a centralized store to keep it all organized is advantageous. In the next lesson, you will learn how to build and organize Redux applications with complex state.



