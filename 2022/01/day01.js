const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let elfs = input.split('\n\n').map(l => l.split('\n').map(t => parseInt(t)).reduce((p,c) => p+c));
elfs.sort((a,b) => (b-a))

console.log(elfs[0])
console.log(elfs[0]+elfs[1]+elfs[2])
