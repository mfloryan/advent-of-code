const {loadNumbers} = require('../input')
const assert = require('assert/strict')

let sampleInput = `1721
979
366
299
675
1456`

let testInput = sampleInput.split('\n').map(x => Number.parseInt(x))

function findPair(input, seed = 0) {
    for (let i = 0; i < input.length; i++) {
        for (let j = i; j < input.length; j++) {
          if (input[i] + input[j] + seed == 2020) {
              return [ input[i], input[j] ]
          }
        }
    }
}

function findTriplet(input) {
    for (let i = 0; i < input.length; i++) {
        let pair = findPair(input, input[i])
        if (pair) {
            return [pair, input[i]];
        }
    }
}

let pair = findPair(testInput)
assert.equal(pair[0] * pair[1], 514579)

let inputNumbers = loadNumbers('01/input.txt')
let pair2 = findPair(inputNumbers)
console.log(pair2)
console.log(pair2[0]* pair2[1])

let triplet = findTriplet(inputNumbers)
console.log(triplet)
console.log(triplet[0][0] * triplet[0][1] * triplet[1])
