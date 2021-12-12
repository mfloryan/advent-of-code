const fs = require('fs')
const path = require('path')

let steps = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function swapPosition(password, x, y) {
    let pa = password.split('')
    let letterX = pa[x]
    pa[x] = pa[y]
    pa[y] = letterX
    return pa.join('')
}

function swapLetter(password, x, y) {
    let pX = password.indexOf(x)
    let pY = password.indexOf(y)
    return swapPosition(password, pX, pY)
}

function rotateSteps(password, dir, x) {
    let pa = password.split('')
    let c = x;
    while (c != 0) {
        if (dir == 'left') { pa.push(pa.shift()) }
        else { pa.unshift(pa.pop())}
        c--;
    }
    return pa.join('')
}

function rotatePosition(password, x) {
    let index = password.indexOf(x);
    return rotateSteps(password, 'right', 1 + index + (index>=4?1:0))
}

function reverse(password, x, y) {
    let pa = password.split('')
    let p1 = pa.slice(0, x)
    let p2 = pa.slice(x, y+1)
    let p3 = pa.slice(y+1)
    return (p1.concat(p2.reverse()).concat(p3)).join('')
}

function move(password, x, y) {
    let pa = password.split('');
    let removed = pa.splice(x,1)[0];
    pa.splice(y,0, removed)
    return pa.join('')
}

function parseStep(step) {
    let data = step.split(' ')
    if (data[0] == 'swap') {
        if (data[1] == 'position') {
            return (p) => swapPosition(p, Number.parseInt(data[2]), Number.parseInt(data[5]) )
        }
        if (data[1] == 'letter') {
            return (p) => swapLetter(p, data[2], data[5] )
        }
    }
    if (data[0] == 'rotate') {
        if (data[1]== 'based') {
            return (p) => rotatePosition(p, data[6] )
        } else {
            return (p) => rotateSteps(p, data[1], Number.parseInt(data[2]) )
        }
    }
    if (data[0] == 'reverse') {
        return (p) => reverse(p, Number.parseInt(data[2]), Number.parseInt(data[4]) )
    }
    if (data[0] == 'move') {
        return (p) => move(p, Number.parseInt(data[2]), Number.parseInt(data[5]) )
    }
}

let instructions = steps.split('\n').map(parseStep)
console.log( instructions.reduce((p,c) => c(p), "abcdefgh") )

function getPermutations(initialArray) {
    return [initialArray]
}

const permutator = (inputArr) => {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
  }

let a = 'abcdefgh'.split('')
let permutations = permutator(a)

for (let i = 0; i < permutations.length; i++) {
    let possiblePassword = permutations[i].join('')
    // console.log("testing: ", possiblePassword)
    if (instructions.reduce((p,c) => c(p), possiblePassword) == 'fbgdceah') {
        console.log("Found: ", possiblePassword)
        break
    }
}