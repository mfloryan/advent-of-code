const { isNumber } = require('lodash')
const { loadLines } = require('../input')

let lines = loadLines('21/input.txt')

function parseLine(line) {
    let [a, b] = line.split(": ")
    let r = b.split(' ')
    if (r.length == 1) {
        return [a, Number(b)]
    } else {
        return [a, ...r]
    }
}

// lines = `root: pppw + sjmn
// dbpl: 5
// cczh: sllz + lgvd
// zczc: 2
// ptdq: humn - dvpt
// dvpt: 3
// lfqf: 4
// humn: 5
// ljgn: 2
// sjmn: drzm * dbpl
// sllz: 4
// pppw: cczh / lfqf
// lgvd: ljgn * ptdq
// drzm: hmdt - zczc
// hmdt: 32`.split('\n')

let data = lines.map(parseLine)
let monkeys = {}
for (const monkey of data) {
    monkeys[monkey[0]] = monkey.slice(1)
}

function generateEquation(monkeys, start = 'root') {
    let monkey = monkeys[start]
    if (monkey.length == 1) return monkey[0]

    let a = generateEquation(monkeys, monkeys[start][0])
    let b = generateEquation(monkeys, monkeys[start][2])
    if (!isNumber(a) && !a.includes('h')) {
        a = eval(a)
    }
    if (!isNumber(b) && !b.includes('h')) {
        b = eval(b)
    }
    return `(${a} ${monkeys[start][1]} ${b})`
}

function bisect(left, right, test) {
    while (true) {
        let mid = (left + right) / 2
        if (left == right) return
        let midL = Math.floor(mid)
        let midH = Math.ceil(mid)
        let result = test(midL)
        if (result == 0) return midL;
        if (result > 0) {
            left = midH
        } else {
            right = midL
        }
    }
}

console.log(eval(generateEquation(monkeys)))

monkeys['root'][1] = '=='
monkeys['humn'][0] = 'h'
let eq = generateEquation(monkeys)

let [l, r] = eq.split("==")
l = l.substring(1)
r = r.substring(0, r.length - 1)
// console.log(l, r)
console.log(bisect(0, Math.pow(10, 13), v => Math.sign(eval(l.replace("h", v)) - Number(r))))
