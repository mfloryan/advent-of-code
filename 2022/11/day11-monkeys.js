const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let monkeysInput = input.split('\n\n').map(m => m.split('\n'))

function parseMonkey(monkey) {
    let m = {}
    let [_, id] = monkey[0].split(' ')
    m.id = parseInt(id)
    let [_2, items] = monkey[1].split(":")
    m.items = items.split(",").map(_ => BigInt(parseInt(_)))
    let [_3, op] = monkey[2].split(":")
    ops = op.split(" ")
    if (ops[5] == "old") {
        if (ops[4] == "+") {
            m.op = (o) => o + o
        } else if (ops[4] == "*") {
            m.op = (o) => o * o
        }
    } else {
        if (ops[4] == "+") {
            let v = BigInt(parseInt(ops[5]))
            m.op = (o) => o + v
        } else if (ops[4] == "*") {
            let v = BigInt(parseInt(ops[5]))
            m.op = (o) => o * v
        }
    }

    let [_4, test] = monkey[3].split(":")
    test = test.split(" ")
    m.test = BigInt(parseInt(test[3]))

    let [_5, condTrue] = monkey[4].split(":")
    condTrue = condTrue.split(" ")
    m.condTrue = parseInt(condTrue[4])
    let [_6, condFalse] = monkey[5].split(":")
    condFalse = condFalse.split(" ")
    m.condFalse = parseInt(condFalse[4])
    m.active = 0
    return m
}

function runTheMonkeyBusiness(monkeys, common, rounds = 10000) {

    for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < monkeys.length; i++) {
            let currentMonkey = monkeys[i]
            currentMonkey.active += currentMonkey.items.length
            while (currentMonkey.items.length > 0) {
                let item = currentMonkey.items.shift()
                item = currentMonkey.op(item)
                if (common) {
                    item = item % common
                } else {
                    item = BigInt(Math.floor(Number(item / 3n)))
                }

                var goesToMonkey = (item % currentMonkey.test == 0)?
                    currentMonkey.condTrue:
                    currentMonkey.condFalse

                monkeys[goesToMonkey].items.push(item)
            }
        }
    }
    return monkeys.map(m => m.active)
}

let monkeys = monkeysInput.map(parseMonkey)
let active = runTheMonkeyBusiness(monkeys, undefined, 20);
active.sort((a, b) => b - a)
console.log(active[0] * active[1])

monkeys = monkeysInput.map(parseMonkey)
let common = monkeys.map(m => m.test).reduce((p, c) => p * c, BigInt(1))
active = runTheMonkeyBusiness(monkeys, common, 10000);
active.sort((a, b) => b - a)
console.log(active[0] * active[1])
