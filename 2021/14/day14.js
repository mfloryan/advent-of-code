const fs = require('fs')
const path = require('path')
let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' }).split("\n\n")

// input = `NNCB

// CH -> B
// HH -> N
// CB -> H
// NH -> C
// HB -> C
// HC -> B
// HN -> C
// NN -> C
// BH -> H
// NC -> B
// NB -> B
// BN -> B
// BB -> N
// BC -> B
// CC -> N
// CN -> C`.split('\n\n')

let template = input[0].split('');
let rules = input[1].split('\n').map(r => r.split(' -> '))

function getStats(polymer) {
    let pairStats = {}
    for (let i = 0; i < polymer.length - 1; i++) {
        let pair = polymer[i] + polymer[i + 1]
        if (pairStats[pair]) pairStats[pair]++; else pairStats[pair] = 1;
    }
    return pairStats
}

function applyRulesToPairs(pairStats, rules) {
    let newPairStats = {}

    for (const ps in pairStats) {
        let insertion = rules.find(r => r[0] == ps)
        let p1 = ps[0] + insertion[1]
        let p2 = insertion[1] + ps[1]
        if (newPairStats[p1]) newPairStats[p1] += pairStats[ps]; else newPairStats[p1] = pairStats[ps];
        if (newPairStats[p2]) newPairStats[p2] += pairStats[ps]; else newPairStats[p2] = pairStats[ps];
    }
    return newPairStats
}

let stats = getStats(template)

for (let i = 0; i < 40; i++) {
    stats = applyRulesToPairs(stats, rules)
    if (i == 9) console.log("part 1", calculateResultFromStats(stats))
}

console.log("part 2", calculateResultFromStats(stats))

function calculateResultFromStats(stats) {
    let elementStats = {}
    for (const ps in stats) {
        let [e1, e2] = ps.split('')
        if (elementStats[e1]) elementStats[e1] += stats[ps]; else elementStats[e1] = stats[ps]
        if (elementStats[e2]) elementStats[e2] += stats[ps]; else elementStats[e2] = stats[ps]
    }
    let q = Object.values(elementStats).map(n => Math.ceil(n / 2)).sort((a, b) => a - b)
    return q[q.length - 1] - q[0]
}
