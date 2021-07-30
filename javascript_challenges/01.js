// Write your code here:
let reverseArray = (arr) => {
    let res = [];
    for(let i = arr.length - 1; i >=0; i--) {
        res.push(arr[i]);
    }
    return res;
}

// When you're ready to test your code, uncomment the below and run:

const sentence = ['sense.','make', 'all', 'will', 'This'];

console.log(reverseArray(sentence)) 
// Should print ['This', 'will', 'all', 'make', 'sense.'];

