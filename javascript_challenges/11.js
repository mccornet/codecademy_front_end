/*

Write a function sortSpeciesByTeeth() 
that takes in an array of species objects in the format:

{speciesName: 'shark', numTeeth: 50 }
and sorts the array in ascending order based on the average number 
of teeth that species possesses (numTeeth) .

*/

const speciesArray = [ {speciesName:'shark', numTeeth:50}, {speciesName:'dog', numTeeth:42}, {speciesName:'alligator', numTeeth:80}, {speciesName:'human', numTeeth:32}];

// Write your code here:
const sortSpeciesByTeeth = array => array.sort((a, b) => a.numTeeth - b.numTeeth)


// using comparator instead of -
const sortSpeciesByTeeth_v2 = array => array.sort((a, b) => a.numTeeth < b.numTeeth)




// Feel free to comment out the code below when you're ready to test your function!

console.log(sortSpeciesByTeeth(speciesArray))
console.log(sortSpeciesByTeeth_v2(speciesArray))

// Should print:
// [ { speciesName: 'human', numTeeth: 32 },
//   { speciesName: 'dog', numTeeth: 42 },
//   { speciesName: 'shark', numTeeth: 50 },
//   { speciesName: 'alligator', numTeeth: 80 } ]

