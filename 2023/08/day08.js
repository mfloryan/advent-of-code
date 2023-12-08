const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
  let [a, b] = line.split(" = ")
  let c = b.split(', ')
  return {
    node:a, 'L':c[0].substring(1), 'R':c[1].substring(0,3)
  }
}

let [a,b] = input.split('\n\n')
let turns = a.split('')
let map = b.split('\n').map(parse)


function findEnd(map, turns, start, endCondition) {
    let steps = 0
    let position = start

    while (!endCondition(position)) {
        let node = map.find(n => n.node == position)
        let turn = turns[steps % turns.length]
        position = node[turn]
        steps++
    }

    return steps
}

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

console.log(findEnd(map, turns, 'AAA', p => p == 'ZZZ'))

let ghosts = map.filter(_ => _.node.endsWith('A')).map(_ => _.node).map(_ => findEnd(map, turns, _, p => p.endsWith('Z')))

console.log(ghosts.reduce(lcm))
