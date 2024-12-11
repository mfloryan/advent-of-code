const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let data = input.split(' ').map(v => parseInt(v))

function transformStone(value) {
    let ret = []
    let stringValue = value.toString()

    if (value == 0) {
        ret.push(1)
    } else if (stringValue.length % 2 == 0) {
        ret.push(parseInt(stringValue.substring(0, stringValue.length / 2)))
        ret.push(parseInt(stringValue.substring(stringValue.length / 2)))
    } else {
        ret.push(value * 2024)
    }

    return ret
}

let stones = [...data]
for (let i = 0; i < 25; i++) {
    let newStones = [];
    for (const stone of stones) {
        newStones.push(...transformStone(stone))
    }
    stones = newStones
}

console.log(stones.reduce((p,c) => p+c))

function evaluateStones(stones, blinks) {
    counts = stones.map(s => { return { 'stone': s, 'count': 1 } })
    let addToCounter = (counter, stone, count = 1) => {
        let currentValue = counter.find(v => v.stone == stone)
        if (currentValue) {
            currentValue.count += count
        } else {
            counter.push({ 'stone': stone, 'count': count })
        }
    }

    for (let i = 0; i < blinks; i++) {
        new_counts = []
        for (const stone of counts) {
            let stoneString = stone.stone.toString()
            if (stone.stone == 0) {
                addToCounter(new_counts, 1, stone.count)
            } else if (stoneString.length % 2 == 0) {
                addToCounter(new_counts, parseInt(stoneString.substring(0, stoneString.length / 2)), stone.count)
                addToCounter(new_counts, parseInt(stoneString.substring(stoneString.length / 2)), stone.count)
            } else {
                addToCounter(new_counts, stone.stone * 2024, stone.count)
            }
        }
        counts = new_counts
    }

    return counts.map(c => c.count).reduce((p, c) => p + c)
}

console.log(
    evaluateStones([...data], 75)
)
