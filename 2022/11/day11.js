const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `Monkey 0:
// Starting items: 79, 98
// Operation: new = old * 19
// Test: divisible by 23
//   If true: throw to monkey 2
//   If false: throw to monkey 3

// Monkey 1:
// Starting items: 54, 65, 75, 74
// Operation: new = old + 6
// Test: divisible by 19
//   If true: throw to monkey 2
//   If false: throw to monkey 0

// Monkey 2:
// Starting items: 79, 60, 97
// Operation: new = old * old
// Test: divisible by 13
//   If true: throw to monkey 1
//   If false: throw to monkey 3

// Monkey 3:
// Starting items: 74
// Operation: new = old + 3
// Test: divisible by 17
//   If true: throw to monkey 0
//   If false: throw to monkey 1`

let monkeysInput = input.split('\n\n').map(m => m.split('\n'))

function parseMonkey(monkey) {
    let m = {}
    let [_,id] = monkey[0].split(' ')
    m.id = parseInt(id)
    let [_2, items] = monkey[1].split(":")
    m.items = items.split(",").map(_ => parseInt(_))
    let [_3,op] = monkey[2].split(":")
    ops = op.split(" ")
    if (ops[5] == "old") {
        if (ops[4] == "+") {
            m.op = (o) => o + o
        } else if (ops[4] == "*") {
            m.op = (o) => o * o
        }
    } else {
        if (ops[4] == "+") {
            // let v = BigInt(parseInt(ops[5]))
            let v = parseInt(ops[5])
            m.op = (o) => o + v
        } else if (ops[4] == "*") {
            // let v = BigInt(parseInt(ops[5]))
            let v = parseInt(ops[5])
            m.op = (o) => o * v
        }
    }

    let [_4,test] = monkey[3].split(":")
    test = test.split(" ")
    m.test = parseInt(test[3])

    let [_5,condTrue] = monkey[4].split(":")
    condTrue = condTrue.split(" ")
    m.condTrue = parseInt(condTrue[4])
    let [_6,condFalse] = monkey[5].split(":")
    condFalse = condFalse.split(" ")
    m.condFalse = parseInt(condFalse[4])
    m.active = 0
    return m
}   

let monkeys = monkeysInput.map(parseMonkey)
// console.log(monkeys)

for (let r = 0; r < 20; r++) {
    // console.log("Round:", r)
    for (let i = 0; i < monkeys.length; i++) {
        let currentMonkey = monkeys[i]
        currentMonkey.active += currentMonkey.items.length
        while (currentMonkey.items.length > 0) {
            let item = currentMonkey.items.shift()
            item = currentMonkey.op(item)
            item = Math.floor(item / 3)
            var goesToMonkey
            if (item % currentMonkey.test == 0) {
                goesToMonkey = currentMonkey.condTrue
            } else {
                goesToMonkey = currentMonkey.condFalse
            }
            monkeys[goesToMonkey].items.push(item)
        }
    }
    if (r == 0 || r == 19 || ((r+1) % 1000) == 0) {
        console.log("r:", r+1)
    // console.log(monkeys.map(m => m.active))
    }
}

monkeys.sort((a,b) => b.active - a.active)
let a = monkeys.map(m=>m.active)
console.log(a)
console.log(a[0] * a[1])