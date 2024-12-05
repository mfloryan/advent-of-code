const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13

// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`

let [p1, p2] = input.split('\n\n')

let rules = p1.split('\n').map(l => l.split('|').map(v => parseInt(v)))
let orders = p2.split('\n').map(l => l.split(',').map(v => parseInt(v)))

function isCorrectOrder(order, rules) {
    for (const rule of rules) {
        if (order.includes(rule[0]) && order.includes(rule[1])) {
            let first = order.indexOf(rule[0])
            let second = order.indexOf(rule[1])

            if (second < first) return false
        }
    }
    return true
}

function fixOrder(order, rules) {
    let relevantRules = rules.filter(r => order.includes(r[0]) && order.includes(r[1]))
    return order.toSorted((a, b) => {
        rule = relevantRules.find(r => r.includes(a) && r.includes(b))
        return rule.indexOf(a) - rule.indexOf(b)
    })
}

let part1 = orders
    .filter(p => isCorrectOrder(p, rules))
    .map(a => a[Math.floor(a.length/2)])
    .reduce((p,c) => p+c)
console.log(part1)

let part2 = orders
    .filter(p => !isCorrectOrder(p, rules))
    .map(o => fixOrder(o, rules))
    .map(a => a[Math.floor(a.length/2)])
    .reduce((p,c) => p+c)

console.log(part2)
