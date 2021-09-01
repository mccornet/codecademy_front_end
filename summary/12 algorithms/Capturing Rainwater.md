# Capturing Rainwater

Learn JavaScript implementations of the capturing rainwater interview question.

A common interview question involving arrays is the “capturing rainwater” problem (also referred to as the “trapping rainwater” problem).

### The Problem

Imagine a very heavy rainstorm over a highway that has many potholes and cracks. The rainwater will collect in the empty spaces in the road, creating puddles. Each puddle can only be as high as the road around it, as any excess water will just flow away.

The capturing rainwater problem asks you to calculate how much rainwater would be trapped in the empty spaces in a histogram (a chart which consists of a series of bars). Consider the following histogram:

![histogram without water](https://content.codecademy.com/programs/cs-path/TIP-Lists/histogram%20v1.svg)

This can be represented in JavaScript as an array filled with the values `[4, 2, 1, 3, 0, 1, 2]`. Imagine that rainwater has fallen over the histogram and collected between the bars. Here’s how the previous histogram would look filled with water:

![histogram with water](https://content.codecademy.com/programs/cs-path/TIP-Lists/histogram%20v2.svg)

Like with the road, the amount of water that can be captured at any given space cannot be higher than the bounds around it. To solve the problem, we need to write a function that will take in an array of integers and calculate the total water captured. Our function would return `6` for the histogram above. There are multiple ways to solve this problem, but we are going to focus on a naive implementation and an optimized implementation.

### The Concept

The foundation to all the solutions for this problem is that the amount of rainwater at any given index is the difference between the lower of highest bars to its left and right and the height of the index itself:

```
waterAtIndex = Math.min(highestLeftBound, highestRightBound) - heightOfIndex;
```

Look at the histogram again. The amount of water at index `4` is `2`. This is because its highest left bound is `3` (element at index `3`), and its highest right bound is `2` (element at index `6`). The lower of these two values is `2`, and when we subtract the index’s height of `0`, we get our answer of `2`.

### The Naive Solution

The naive solution to the problem is to:

1. Traverse every element in the array
2. Find the highest left bound for that index
3. Find the highest right bound for that index
4. Take the lower of those two values
5. Subtract the height of that index from that minimum
6. Add the difference to the total amount of water

In JavaScript this looks like this:

```javascript
function naiveSolution(heights) {
  let totalWater = 0;
  for (let i = 1; i < heights.length - 1; i++) {
    let leftBound = 0;
    let rightBound = 0;
    // We only want to look at the elements to the left of i, which are the elements at the lower indices
    for (let j = 0; j <= i; j++) { 
      leftBound = Math.max(leftBound, heights[j]);
    }
    // Likewise, we only want the elements to the right of i, which are the elements at the higher indices
    for (let j = i; j < heights.length; j++) {
      rightBound = Math.max(rightBound, heights[j]);
    }
    totalWater += Math.min(leftBound, rightBound) - heights[i];
  }
  return totalWater;
}
```

While this is a functional solution, it requires nested `for` loops, which means it has a big O runtime of `O(n^2)`. Let’s look at a solution with a more efficient runtime.

### The Optimized Solution

The previous solution had a quadratic runtime, but it’s possible to solve this problem in `O(n)` time by using two pointers. The pointers will start at each end of the array and move towards each other. The two-pointer approach is a common approach for problems that require working with arrays, as it allows you to go through the array in a single loop and without needing to create copy arrays.

We’ll start by creating the following variables:

```pseudo
totalWater = 0
leftPointer = 0 
rightPointer = heights.length - 1
leftBound = 0
rightBound = 0
```

`leftPointer` and `rightPointer` will start at the beginning and end of the array, respectively, and move towards each other until they meet. The algorithm is as follows:

```pseudo
while leftPointer < rightPointer
  if the element at leftPointer <= the element at rightPointer
    if the element is larger than leftBound, set leftBound to the element
    add the difference between leftBound and the element at leftPointer to totalWater
    move leftPointer forward by one
  else
    if the element is larger than rightBound, set rightBound to the element
    add the difference between rightBound and the element at rightPointer to totalWater
    move rightPointer back by one 

return totalWater
```

### Takeaway: The Two Pointer Approach

The two-pointer approach is one that you can, and should, use in many interview questions. When you see a problem that requires you to iterate through an array (or string), take a moment and think about if it would be possible to iterate through it in sections at the same time instead of in separate loops. Common problems that can be solved using the two-pointer technique are the two sum problem (finding two numbers in an array that sum to a specified number) and reversing the characters in a string.

