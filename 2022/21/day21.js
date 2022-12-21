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

function yelling(monkeys) {
    let work = false
    do {
        work = false
        for (const monkeyName in monkeys) {
            monkey = monkeys[monkeyName]
            if (monkey.length > 1) {
                work = true
                let left = monkeys[monkey[0]]
                let right = monkeys[monkey[2]]
                if (monkeys[monkey[0]].length == 1 && monkeys[monkey[2]].length == 1) {
                    switch (monkey[1]) {
                        case '*':
                            monkeys[monkeyName] = [Number(monkeys[monkey[0]]) * Number(monkeys[monkey[2]])]
                            break;
                        case '+':
                            monkeys[monkeyName] = [Number(monkeys[monkey[0]]) + Number(monkeys[monkey[2]])]
                            break;
                        case '-':
                            monkeys[monkeyName] = [Number(monkeys[monkey[0]]) - Number(monkeys[monkey[2]])]
                            break;
                        case '/':
                            monkeys[monkeyName] = [Number(monkeys[monkey[0]]) / Number(monkeys[monkey[2]])]
                            break;
                        case '=':
                            monkeys[monkeyName] = [Number(monkeys[monkey[0]]) == Number(monkeys[monkey[2]])]
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    } while (work)
    return monkeys['root']
}

console.log(yelling(monkeys))

// for (let i = 0; i < 100000; i++) {
//     monkeys = {}
//     for (const monkey of data) {
//         monkeys[monkey[0]] = monkey.slice(1)
//     }
//     monkeys['root'][1] = '='
//     monkeys['humn'] = [ i ]
//     if (yelling(monkeys) == true) console.log(i)
// }

function recuseRootPath(monkeys, start = 'root', path = []) {
    let monkey = monkeys[start]
    // if (!monkey) console.log("error", start)
    if (monkey.length == 1) {
        if (start == 'humn') return "h"; else return monkey[0]
    } else {
        let a = recuseRootPath(monkeys, monkeys[start][0])
        let b = recuseRootPath(monkeys, monkeys[start][2])
        if (!isNumber(a) && !a.includes('h')) {
            a = eval(a)
        }
        if (!isNumber(b) && !b.includes('h')) {
            b = eval(b)
        }

        return `(${a} ${monkeys[start][1]} ${b})`
    }
}

monkeys = {}
for (const monkey of data) {
    monkeys[monkey[0]] = monkey.slice(1)
}
monkeys['root'][1] = '=='

let eq = recuseRootPath(monkeys)

let [l,r] = eq.split("==")
l = l.substring(1)
r = r.substring(0,r.length-1)
console.log(l,"==",r)

let start = 3*Math.pow(10,12) + 5*Math.pow(10,10) + 9* Math.pow(10,9) + 3*Math.pow(10,8) +6*Math.pow(10,7)
for (let i = start ; i < Math.pow(10,13); i++) {
 if (eval(eq.replace("h", i)) == true) {
    console.log(i)
    break;
 }
}
// let eq2 = eq.replace("h",100)
