const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [a, b] = line.split(' ', 2)
    return [a.split(''), parseInt(b)]
}

// input = `32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483`

let data = input.split('\n').map(parse)

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse()

function getHandType(hand) {
    stats = []
    hand.forEach(card => {
        let cardStat = stats.find(s => s.card == card)
        if (cardStat) cardStat.count++
        else stats.push({ card, count: 1 })
    })

    if (stats.find(c => c.count == 5)) return 7
    if (stats.find(c => c.count == 4)) return 6
    if (stats.find(c => c.count == 3)) {
        if (stats.find(c => c.count == 2)) return 5
        else return 4
    }
    if (stats.find(c => c.count == 2)) {
        let pairs = stats.filter(c => c.count == 2).length
        if (pairs == 2) return 3
        else return 2
    }
    return 1
}

function rankPairsSameType(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return ranks.indexOf(a[i]) - ranks.indexOf(b[i])
    }
    return 0
}

function rankHands(a, b) {

    let rankA = getHandType(a)
    let rankB = getHandType(b)

    if (rankA == rankB) return rankPairsSameType(a, b)
    return rankA - rankB
}

data.sort((a,b) => rankHands(a[0], b[0]))

console.log(data.map((hand, index) => (hand[1] * (index + 1))).reduce((p,c) => p+c))
