const fs = require('fs')
const path = require('path')
let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })
let lines = input.split('\n')

function parseLine(line) {
    console.log(line)
    let parts  = line.match(/([\w ]*) ([0-9]{1,3}),([0-9]{1,3}) through ([0-9]{1,3}),([0-9]{1,3})/)
    return {a: parts[1], 
        x1: Number.parseInt(parts[2]),
        y1: Number.parseInt(parts[3]),
        x2: Number.parseInt(parts[4]),
        y2: Number.parseInt(parts[5]),
    }
}

function getLightsStatus(data) {
    let grid = new Array(1000)
    for (let i = 0; i < 1000; i++) grid[i] = new Array(1000).fill(0)

    data.forEach(d => {
        for (let y = d.y1; y <= d.y2; y++) {
            for (let x = d.x1; x <= d.x2; x++) {
                if (d.a == "turn on") grid[y][x] = 1
                if (d.a == "turn off") grid[y][x] = 0
                if (d.a == "toggle") grid[y][x] = grid[y][x]==0?1:0
            }
        }
    })

    return grid.map(r => r.reduce((p,c)=> p+c, 0)).reduce( (p,c)=> p+c, 0)
}

console.log(getLightsStatus(lines.map(parseLine)))
