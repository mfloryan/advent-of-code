const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `shiny gold bags contain 2 dark red bags.
// dark red bags contain 2 dark orange bags.
// dark orange bags contain 2 dark yellow bags.
// dark yellow bags contain 2 dark green bags.
// dark green bags contain 2 dark blue bags.
// dark blue bags contain 2 dark violet bags.
// dark violet bags contain no other bags.`

// input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.`

function parseLine(line) {
    [bag, nextBags] = line.slice(0, -1).split(' bags contain ')
    let node = { bag: bag, bags: [] }
    if (nextBags != "no other bags") {
        bags = nextBags.split(', ')
        node.bags.push(...bags.map(b => {
            let parts = b.split(" ")
            return {
                count: parseInt(parts.shift()),
                bag: parts.slice(0, -1).join(' ')
            }
        }))
    }
    return node
}

let graph = input.split('\n').map(l => parseLine(l))

function canHoldGold(node, graph) {
    if (node.bags.length == 0) return false
    if (node.bags.map(b => b.bag).includes('shiny gold')) {
        return true
    } else {
        return node.bags.map(b => canHoldGold(graph.find(n => n.bag == b.bag), graph)).reduce((p, c) => p || c)
    }
}

console.log(graph.filter(n => canHoldGold(n, graph)).length)

function countBags(node, graph, multiplier = 1, level = 0) {
    if (node.bags.length == 0) return 0
    let count =
        multiplier * node.bags.reduce((p, c) => p + c.count, 0) +
        multiplier * node.bags.map(b => countBags(graph.find(n => n.bag == b.bag), graph, b.count, level++)).reduce((p, c) => p + c)
    return count
}

console.log(countBags(graph.find(n => n.bag == 'shiny gold'), graph))
