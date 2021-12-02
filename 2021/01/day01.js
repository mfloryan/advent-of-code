const { loadNumbers } = require('../input')
const assert = require('assert/strict')

function countIncreases(numbers) {
    let increases  = 0
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i+1] > numbers[i]) increases++
    }
    return increases
}

function countTripletIncreases(numbers) {
    let increases = 0
    for (let i = 0; i < numbers.length - 3; i++) {
        let firstTriplet = numbers[i] + numbers[i+1] + numbers[i+2];
        let secondTriplet = numbers[i+1] + numbers[i+2] + numbers[i+3];
        if ( secondTriplet > firstTriplet) increases++
    }
    return increases
}

let textInput = `199
200
208
210
200
207
240
269
260
263`

let numbers = textInput.split('\n').map(x => Number.parseInt(x))
assert.equal(countIncreases(numbers), 7)
assert.equal(countTripletIncreases(numbers), 5)

numbers = loadNumbers("01/input.txt")
console.log("Day 01 part 1: ", countIncreases(numbers))
console.log("Day 01 part 2: ", countTripletIncreases(numbers))
