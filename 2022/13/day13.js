const fs = require('fs')
const { isArray, isNumber } = require('lodash')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `[1,1,3,1,1]
// [1,1,5,1,1]

// [[1],[2,3,4]]
// [[1],4]

// [9]
// [[8,7,6]]

// [[4,4],4,4]
// [[4,4],4,4,4]

// [7,7,7,7]
// [7,7,7]

// []
// [3]

// [[[]]]
// [[]]

// [1,[2,[3,[4,[5,6,7]]]],8,9]
// [1,[2,[3,[4,[5,6,0]]]],8,9]`

let pairs = input.split("\n\n").map(p => p.split("\n").map(parsePair))

function parsePair(pair) {
    return eval(pair)
}

function comparePairs(p1, p2) {

    let result = undefined
    while (p1.length > 0 || p2.length > 0) {
        let left = p1.shift()
        let right = p2.shift()

        if (left === undefined && right !== undefined) {
            return true
        } else if (left !== undefined && right === undefined) {
            return false
        } else if (isNumber(left) && isNumber(right)) {
            if (left > right) return false
            else if (left < right) return true
        } else if (isArray(left) && isArray(right)) {
            let result = comparePairs(left, right)
            if (result != undefined) return result
        } else if (isNumber(left) && isArray(right)) {
            let result = comparePairs([left], right)
            if (result != undefined) return result
        } else if (isArray(left) && isNumber(right)) {
            let result = comparePairs(left, [right])
            if (result != undefined) return result
        } 
    }
    return result
}


let result = pairs.map((p, i) => [i + 1, comparePairs(JSON.parse(JSON.stringify(p[0])), JSON.parse(JSON.stringify(p[1])))])
console.log(result.filter(i => i[1] == true).reduce((p, c) => p + c[0], 0))

let flatListOfPairs = pairs.flatMap(p =>p)
let divider1 = [[2]]
let divider2 = [[6]]
flatListOfPairs.push(divider1)
flatListOfPairs.push(divider2)

flatListOfPairs.sort((a,b) => comparePairs(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)))?-1:+1)

let i1 = flatListOfPairs.indexOf(divider1)+1
let i2 = flatListOfPairs.indexOf(divider2)+1
console.log(i1 * i2)
