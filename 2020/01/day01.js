const fs = require('fs')
let sampleInput = `1721
979
366
299
675
1456`

let testInput = sampleInput.split('\n').map(x => Number.parseInt(x))


function findPair(input) {
    for (let i = 0; i < input.length; i++) {
        for (let j = i; j < input.length; j++) {
          if (input[i] + input[j] == 2020) {
              return [ input[i], input[j] ]
          }
        }
    }
}

let pair = findPair(testInput)
console.log(pair[0] * pair[1])

let input = fs.readFileSync('01/input.txt');
console.log(input)
let pair2 = findPair(input.toString().split('\n').map(x => Number.parseInt(x)))
console.log(pair2)
console.log(pair2[0]* pair2[1])