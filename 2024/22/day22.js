const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })


function mix(number, value) {
    return number ^ value
}

function prune(number) {
    return number % 16777216n
}

function nextSecret(secret) {
    let newSecret
    newSecret = prune(mix(secret, secret * 64n))
    newSecret = prune(mix(newSecret, newSecret / 32n))
    newSecret = prune(mix(newSecret, newSecret * 2048n))
    return newSecret
}

function predict(secret, times) {
    let result = secret
    for (let i = 0; i < times; i++) {
        result = nextSecret(result)
    }
    return result
}

function getSecrets(secret, times = 2000) {
    let result = []
    let newSecrt = secret
    result.push(newSecrt)
    for (let i = 0; i < times; i++) {
        newSecrt = nextSecret(newSecrt)
        result.push(newSecrt)
    }
    return result
}

// input = `1
// 10
// 100
// 2024`

function price(secret) {
    return secret % 10n
}

// input = `1
// 2
// 3
// 2024`

let data = input.split('\n').map(Number).map(n => BigInt(n))
console.log(data.map(n => predict(n, 2000)).reduce((p, c) => p + c))

let changes = (sequence) => {
    let diffs = []
    sequence.reduce((p, c) => {
        diffs.push(c - p)
        return c
    })
    return diffs
}

let exchange = data.map(n => [getSecrets(n).map(s => price(s)), changes(getSecrets(n).map(s => price(s)))])

let allSequences = new Set()

for (const buyer of exchange) {
    let sequenceIndexes = new Map()
    for (let i = 1; i < buyer[0].length - 4; i++) {
        let sequence = buyer[1].slice(i, i + 4).join(',')
        allSequences.add(sequence)
        if (!sequenceIndexes.has(sequence)) sequenceIndexes.set(sequence, buyer[0][i + 4]) //only add first time the sequence is present
    }
    buyer.push(sequenceIndexes)
}

let maxPrice = 0n
for (const s of allSequences) {
    let price = exchange.map(b => b[2].get(s) || 0n).reduce((p, c) => p + c)
    if (price > maxPrice) {
        maxPrice = price
    }
}

console.log(Number(maxPrice))
