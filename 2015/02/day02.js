const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })
let lines = input.split('\n')

function parseLine(line) {
    return line.split("x").map(x => Number.parseInt(x))
}

function calculateSurface(dim) {
    dim.sort((a,b) => a - b)
    return (2*dim[0]*dim[1] + 2*dim[1]*dim[2] + 2*dim[0]*dim[2]) 
        + (dim[0] * dim[1]);
}

function calculateRibbon(dim) {
    dim.sort((a,b) => a - b)
    let perimeter = 2* dim[0] + 2* dim[1]
    let ribbon = dim[0] * dim[1] * dim[2]
    return perimeter+ribbon
}

let data = 

console.log("part 01:", 
    lines
        .map(parseLine)
        .map(calculateSurface)
        .reduce( (p,c) => p+c, 0))

        console.log(calculateRibbon([1,1,10]))

console.log("part 02:", 
    lines
        .map(parseLine)
        .map(calculateRibbon)
        .reduce( (p,c) => p+c, 0))
