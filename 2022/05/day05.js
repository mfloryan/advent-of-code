const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let [stacksInput,movesInput] = input.split('\n\n').map(l=>l.split('\n'))

function parseStacks(stacks) {
    let ids = stacks[stacks.length-1].split('  ').map(i => parseInt(i))
    let crates = stacks.slice(0,-1)
    let stackState = {}
    ids.forEach(id => {
        let indexOfId = stacks[stacks.length-1].indexOf(id)
        let idCrates = crates.map(c => c.charAt(indexOfId)).filter(i => i != ' ')
        let localStack = idCrates
        stackState[id] = localStack
    });
    return stackState
}

function parseMove(moveLine) {
    let b = moveLine.split(' ')
    return { count: parseInt(b[1]), from: parseInt(b[3]), to: parseInt(b[5])}
}

let stacks = parseStacks(stacksInput)
let moves = movesInput.map(l => parseMove(l))

moves.forEach(move => {
  for (let i = 0; i < move.count; i++) {
    stacks[move.to].unshift(stacks[move.from].shift())
  }  
})

console.log(Object.values(stacks).map(a=>a[0]).join(''))

stacks = parseStacks(stacksInput)
moves.forEach(move => {
    let cratesToMove = []
    for (let i = 0; i < move.count; i++) {
        cratesToMove.push(stacks[move.from].shift())
    }
    stacks[move.to].unshift(...cratesToMove)
  })  

  console.log(Object.values(stacks).map(a=>a[0]).join(''))
