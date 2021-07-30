/*
const animals = ['panda', 'turtle', 'giraffe', 'hippo', 'sloth', 'human'];
 
convertToBaby(animals); 
// Should return ['baby panda', 'baby turtle', 'baby giraffe', 'baby hippo', 'baby sloth', 'baby human'];
*/

// Write your code here:
let convertToBaby = (arr) => {
    let res = [];
    for(const x of arr) {
        res.push("baby " + x);
    }
    return res;
}

// map is not allowed
// let convertToBaby = (arr) => arr.map(x => "baby " + x);


// When you're ready to test your code, uncomment the below and run:

const animals = ['panda', 'turtle', 'giraffe', 'hippo', 'sloth', 'human'];

console.log(convertToBaby(animals)) 
