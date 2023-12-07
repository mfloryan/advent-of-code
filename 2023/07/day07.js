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
const ranks2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse()

function getHandScore(hand) {
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

function rankPairsSameType(a, b, ranks) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return ranks.indexOf(a[i]) - ranks.indexOf(b[i])
    }
    return 0
}


function rankHands(a, b) {
    let rankA = getHandScore(a)
    let rankB = getHandScore(b)

    return ((rankA - rankB) * (ranks.length + 1) + rankPairsSameType(a, b, ranks))
}

function rankHands2(a, b) {
    return ((a[2] - b[2]) * (ranks2.length + 1) + rankPairsSameType(a[0], b[0], ranks2))
}


function buildAlternatives(hand, cards, list_of_alternatives = []) {
    if (cards.length == 5) {
        list_of_alternatives.push(cards)
        return
    }
    if (hand[cards.length] == 'J') {
        ranks2.slice(1).forEach(card => {
            let newCards = cards.slice()
            newCards.push(card)
            buildAlternatives(hand, newCards, list_of_alternatives)
        })
    } else {
        let newCards = cards.slice()
        newCards.push(hand[cards.length])
        buildAlternatives(hand, newCards, list_of_alternatives)
    }
}

function getBestType(hand) {
    let initialType = getHandScore(hand)
    if (initialType == 7) return initialType
    if (hand.includes('J')) {
        let list_of_alternatives = []
        buildAlternatives(hand, [], list_of_alternatives)
        ranked_alternatives = list_of_alternatives.map(_ => [_, getHandScore(_)])
        ranked_alternatives.sort((a, b) => b[1] - a[1])
        return ranked_alternatives[0][1]
    } else {
        return initialType
    }
}

function tallyScore(games) {
    return games.map((hand, index) => (hand[1] * (index + 1))).reduce((p, c) => p + c)
}

data.sort((a, b) => rankHands(a[0], b[0]))
console.log(tallyScore(data))

let handsWithNewRank = data.map(hand => [hand[0], hand[1], getBestType(hand[0])])
handsWithNewRank.sort(rankHands2)
console.log(tallyScore(handsWithNewRank))
