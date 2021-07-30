/*

Write a function sortYears() that takes in an array of years, 
and, using the built-in .sort() method, 
returns that array with the years sorted in descending order.

You can test your function when you’re ready by 
passing in the years array or by making your own array of years!

*/

// Write your code here:
// the sort documentation uses a - b or b - a 
const sortYears = arr => arr.sort((a, b) => b - a)

// but it is also possible to use the comparator
const sortYears_v2 = arr => arr.sort((a, b) => a > b)

// Feel free to uncomment the below code to test your function:

const years = [1970, 1999, 1951, 1982, 1963, 2011, 2018, 1922]

console.log(sortYears(years))
console.log(sortYears_v2(years))
// Should print [ 2018, 2011, 1999, 1982, 1970, 1963, 1951, 1922 ]
