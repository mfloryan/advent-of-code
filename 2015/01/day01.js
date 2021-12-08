const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let instructions = input.split('')

let level = 0
for (let i=0; i < instructions.length; i++) {
    if (instructions[i] == ')') level--;
    if (instructions[i] == '(') level++;
    if (level == -1) {
        console.log(i+1);
        break;
    }
}