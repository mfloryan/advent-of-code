const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [card, numbers] = line.split(":")
    id = parseInt(card.substring(4).trim())
    let [l, r] = numbers.split("|")

    return {
        id,
        winning: l.split(" ").filter(_ => _ != "").map(_ => parseInt(_)),
        your: r.split(" ").filter(_ => _ != "").map(_ => parseInt(_)),
    }
}

// input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

let cards = input.split('\n').map(parse)

function countMatchingNumbers(card) {
    let total = 0;
    card.your.forEach(n => {
        if (card.winning.includes(n)) {
            total++
        }
    })
    return total
}

function score(card) {
    let count = countMatchingNumbers(card)
    if (count > 0)
        return Math.pow(2, count - 1)
    else return 0;
}

console.log(cards.map(c => score(c)).reduce((p, c) => p + c, 0))

function expandCards(cards) {
    let expansions = {}

    cards.forEach((card, index) => {
        let matchingNumbers = countMatchingNumbers(card)
        if (!expansions[index]) expansions[index] = 1; else expansions[index]++;
        if (matchingNumbers > 0) {
            let copies = expansions[index];

            for (let i = Math.min(index + 1, cards.length - 1); i <= Math.min(index + matchingNumbers, cards.length - 1); i++) {
                if (!expansions[i]) expansions[i] = 0
                expansions[i] += copies
            }
        }
    })

    return Object.values(expansions).reduce((p, c) => p + c, 0)
}

console.log(expandCards(cards))
