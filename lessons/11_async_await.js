// approach with promises
function nativePromiseVersion() {
    returnsFirstPromise()
      .then((firstValue) => {
        console.log(firstValue);
        return returnsSecondPromise(firstValue);
      })
     .then((secondValue) => {
        console.log(secondValue);
      });
}

// approach with async / await
// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
async function asyncAwaitVersion() {
    let firstValue = await returnsFirstPromise();
    console.log(firstValue);
    let secondValue = await returnsSecondPromise(firstValue);
    console.log(secondValue);
}

// Example. `` vs '' to use string formatting
const cookBeanSouffle = require('./library.js');

// Write your code below:
const hostDinnerParty = async () => {
  try {
    let res = await cookBeanSouffle();
    console.log(`${res} is served!`)
  } catch (error) {
    console.log(error);
    console.log('Ordering a pizza!')
  }
};
hostDinnerParty()

//
let {cookBeans, steamBroccoli, cookRice, bakeChicken} = require('./library.js');

// Write your code below:
const serveDinner = async () => {
  const vegetablePromise = steamBroccoli();
  const starchPromise = cookRice();
  const proteinPromise = bakeChicken();
  const sidePromise = cookBeans();

  [res1, res2, res3, res4] = [await vegetablePromise, await starchPromise, await proteinPromise, await sidePromise]

  console.log(`We’re having ${res1}, ${res2}, ${res3}, and ${res4}.`)

};

serveDinner();

// solution ?

