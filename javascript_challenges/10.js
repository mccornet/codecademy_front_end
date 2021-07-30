/*

Write a function isTheDinnerVegan() 
that takes in an array of food objects in the format:

{name: 'cabbage', source: 'plant' }
and returns a boolean value based on whether or not every item 
in the array has entirely plant-based origins.

*/

// My Initial solution
const isTheDinnerVegan = meal => {
    for(const x of meal) {
        if(x.source !== "plant") return false;
    }
    return true;
}

// Codecademy hint, using every with a filter
const isVegan = (food) => {
    if(food.source === 'plant'){
        return true;
    }
    return false; 
}

const isTheDinnerVegan_v2 = meal => meal.every(x => isVegan(x))

// This can be made even shorter
const isTheDinnerVegan_v3 = meal => meal.every(x => x.source === "plant")


// Feel free to comment out the code below to test your function

const dinner = [{name: 'hamburger', source: 'meat'}, {name: 'cheese', source: 'dairy'}, {name: 'ketchup', source:'plant'}, {name: 'bun', source: 'plant'}, {name: 'dessert twinkies', source:'unknown'}];
const meal = [{name: 'arugula', source: 'plant'}, {name: 'tomatoes', source: 'plant'}, {name: 'lemon', source:'plant'}, {name: 'olive oil', source: 'plant'}];


console.log(isTheDinnerVegan(dinner))
console.log(isTheDinnerVegan_v2(dinner))
console.log(isTheDinnerVegan_v3(dinner))
console.log(isTheDinnerVegan_v3(meal))

// Should print false
