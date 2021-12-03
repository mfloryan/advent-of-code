const { loadLines, loadNumbers } = require('../input')

let lines = loadLines('03/input.txt')

let numbers = lines.map(l => l.split(''))

function generateStats(numbers) {
    let stats = Array(numbers[0].length)

    for (s = 0; s < stats.length; s++) stats[s] = { 0: 0, 1: 0 }
    for (i = 0; i < numbers.length; i++) {
        let number = numbers[i]
        for (j = 0; j < number.length; j++) {
            let digit = number[j]
            stats[j][digit] = stats[j][digit] + 1
        }
    }
    return stats
}

let gamma = Number.parseInt(generateStats(numbers).map(s => s[0] > s[1] ? 0 : 1).join(''), 2)
let epsilon = Number.parseInt(generateStats(numbers).map(s => s[0] < s[1] ? 0 : 1).join(''), 2)
console.log("Day 03 - part 1:", gamma * epsilon)

function findRating(numbers, rule) {
    let localNumbers = numbers;

    let index = 0
    while (localNumbers.length > 1) {
        let stats = generateStats(localNumbers);
        localNumbers = localNumbers.filter(n => n[index] == rule(stats[index]) )
        index++
    }
    return Number.parseInt(localNumbers[0].join(''),2)
}

const oxygenRatingRule = (digitStats) => digitStats[0] > digitStats[1] ? 0 : 1
const co2RatingRule = (digitStats) => digitStats[0] <= digitStats[1] ? 0 : 1

console.log("Day 03 - part 2:", 
    findRating(numbers, oxygenRatingRule) *
    findRating(numbers, co2RatingRule)
)
