const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input=`MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX`

let map = input.split('\n').map(l => l.split(''))


let options = [
    [[1,0],[2,0],[3,0]],
    [[-1,0],[-2,0],[-3,0]],
    [[0,1],[0,2],[0,3]],
    [[0,-1],[0,-2],[0,-3]],
    [[1,1],[2,2],[3,3]],
    [[-1,1],[-2,2],[-3,3]],
    [[1,-1],[2,-2],[3,-3]],
    [[-1,-1],[-2,-2],[-3,-3]],
]

function testXmas(map, position) {
    // console.log(position)
    let pointOptions = options.map(o => o.map(p => [p[0]+position[0], p[1]+position[1]]))
    // console.log(pointOptions)
    pointOptions = pointOptions.filter(o => o.every(p => (p[0] >= 0 && p[1] >= 0 && p[0] < map.length && p[1] < map[0].length)))
    // console.log(pointOptions)
    let l = pointOptions.map(o => o.map(p => map[p[1]][p[0]])).map(w => map[position[1]][position[0]] + w.join(''))
    return l.filter(w => w == 'XMAS').length
}


// console.log(testXmas(map, [9,9]))

let count=0;
for (let y=0; y < map.length; y++) {
    for (let x =0; x < map[0].length; x++) {
        if (map[y][x] =='X') {
            count += testXmas(map, [x,y])
        }
    }
}

console.log(count)


let masOptions = [
    [[0,0],[1,1],[2,2], [2,0],[1,1],[0,2]],
    [[2,2],[1,1],[0,0], [2,0],[1,1],[0,2]],
    [[0,0],[1,1],[2,2], [0,2],[1,1],[2,0]],
    [[2,2],[1,1],[0,0], [2,0],[1,1],[0,2]],

    [[0,0],[-1,-1],[-2,-2], [-2,0],[-1,-1],[0,-2]],
    [[-2,-2],[-1,-1],[0,0], [-2,0],[-1,-1],[0,-2]],
    [[0,0],[-1,-1],[-2,-2], [0,-2],[-1,-1],[-2,0]],
    [[-2,-2],[-1,-1],[0,0], [-2,0],[-1,-1],[0,-2]],
]

function testMas(map, position) {
    // console.log(position)
    let pointOptions = masOptions.map(o => o.map(p => [p[0]+position[0], p[1]+position[1]]))
    // console.log(pointOptions)
    pointOptions = pointOptions.filter(o => o.every(p => (p[0] >= 0 && p[1] >= 0 && p[0] < map.length && p[1] < map[0].length)))
    // console.log(pointOptions)
    let l = pointOptions.map(o => o.map(p => map[p[1]][p[0]])).map(w => w.join('')).filter(w => w == 'MASMAS')
    // console.log(position, l)
    return l.length
}

count=0;
for (let y=0; y < map.length; y++) {
    for (let x =0; x < map[0].length; x++) {
        if (map[y][x] =='M') {
            count += testMas(map, [x,y])
        }
    }
}
console.log(count)