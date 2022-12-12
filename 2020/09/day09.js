const { loadLines } = require('../input')

let lines = loadLines('09/input.txt')
let numbers = lines.map(Number)

function add(p, c) { return p + c }

function getSumsOfAllPairCombinations(numbers) {
    let pairs = []
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            pairs.push([numbers[i], numbers[j]])
        }
    }
    return pairs.map(p => p.reduce(add))
}

function getFirstBrokenNumber(numbers) {
    for (let i = 25; i < numbers.length; i++) {
        let prev25 = numbers.slice(i - 25, i)
        let pairs = getSumsOfAllPairCombinations(prev25)
        if (!pairs.includes(numbers[i])) {
            return numbers[i]
        }
    }
}

let invalidNumber = getFirstBrokenNumber(numbers)
console.log(invalidNumber)

function getContiguousSet(numbers, total) {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i+1; j < numbers.length; j++) {
            let slice = numbers.slice(i,j)
            let sum = slice.reduce(add)
            if (sum == total) {
                slice.sort((a,b) => a - b)
                return slice[0] + slice[slice.length - 1]
            }
            if (sum > total) break;
        }
    }
}

console.log(getContiguousSet(numbers, invalidNumber))