const { hasSubscribers } = require('diagnostics_channel')
const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..`

const map = input.split('\n').map((line,y) => { return line.split('').map((p,x) => { return {x:x,y:y,p:p}})})
let list = input.split('\n').flatMap((line,y) => { return line.split('').map((p,x) => { return {x:x,y:y,p:p}})})

let last = list[list.length - 1]
let max = {x:last.x, y:last.y}

function hasSymbol(map, max, number) {
    if (number.y1 > 0) {
        for (let x = Math.max(0, number.x1 - 1); x <= Math.min(max.x, number.x2 + 1); x++) {
            let point = map[number.y1 - 1][x].p;
            if (point != '.') return {x, y:number.y1 - 1, symbol: point}
        }
    }
    if (number.x1 > 0) {
        let point = map[number.y1][number.x1 - 1].p
        if (point != '.') return {x : number.x1 - 1, y:number.y1, symbol: point}
    }
    if (number.x2 < max.x) {
        let point = map[number.y1][number.x2 + 1].p
        if (point != '.') return {x : number.x2 + 1, y:number.y2, symbol: point}
    }
    if (number.y2 < max.y) {
        for (let x = Math.max(0, number.x1 - 1); x <= Math.min(max.x, number.x2 + 1); x++) {
            let point = map[number.y2 + 1][x].p;
            if (point != '.') return {x, y:number.y2 + 1, symbol: point}
        }
    }
    return false
}

let isNumber = false;
let numer = {}

let numbers = []

for (let y = 0; y <= max.y; y++) {
    for (let x = 0; x <= max.x; x++) {
        let point = map[y][x].p;
        let isDigit = ! isNaN(parseInt(point))
        // console.log(point, isDigit)
        if (isNumber) {
            if (!isDigit) {
                //end of number
                number.x2 = x-1
                number.y2 = y
                number.value = parseInt(number.digits.join(''))
                numbers.push(number)
                isNumber = false
                number = {}
            } else {
                number.digits.push(point)
            }
        } else {
            if (isDigit) {
                //start of number
                number = { x1:x, y1:y, digits: [point] }
                isNumber = true
            }
        }
    }
    if (isNumber) {
        number.x2 = max.x
        number.y2 = y
        number.value = parseInt(number.digits.join(''))
        numbers.push(number)
        isNumber = false
        number = {}
    }
}

let part1 = numbers.filter(n => hasSymbol(map, max, n)).map(n => n.value).reduce((p,c) => p+c,0)
console.log(part1)

let symbols = []

numbers.forEach(number => {
    let symbol = hasSymbol(map, max, number)
    if (symbol && symbol.symbol == '*') {
        let existingSymbol = symbols.find(s => s.x == symbol.x && s.y == symbol.y)
        if (existingSymbol) {
            existingSymbol.n2 = number.value
        } else {
            symbols.push({x:symbol.x, y:symbol.y, n1: number.value})
        }
    }
})

let validGears = symbols.filter(s => s.n2)

console.log(validGears.reduce((p,c) => p + (c.n1 * c.n2),0))