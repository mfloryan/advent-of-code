const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [a, b] = line.split(' @ ')
    return {
        loc: a.split(', ').map(v => Number(v)),
        speed: b.split(', ').map(v => Number(v)),
    }
}

function findIntersection(ls1, ls2) {
    let x1 = ls1.loc[0]
    let y1 = ls1.loc[1]
    let x2 = ls1.loc[0] + ls1.speed[0]
    let y2 = ls1.loc[1] + ls1.speed[1]

    let x3 = ls2.loc[0]
    let y3 = ls2.loc[1]
    let x4 = ls2.loc[0] + ls2.speed[0]
    let y4 = ls2.loc[1] + ls2.speed[1]

    // Calculate the slopes of each line
    var m1 = (y2 - y1) / (x2 - x1);
    var m2 = (y4 - y3) / (x4 - x3);

    // Check if the lines are parallel
    if (m1 === m2) {
        return null; // No intersection (or lines are coincident)
    }

    // Calculate the y-intercepts of each line
    var b1 = y1 - m1 * x1;
    var b2 = y3 - m2 * x3;

    // Calculate the intersection point
    var x = (b2 - b1) / (m1 - m2);
    var y = m1 * x + b1;

    // test for future or past
    if (ls1.speed[0] > 0 && x < ls1.loc[0]) return false
    if (ls1.speed[0] < 0 && x > ls1.loc[0]) return false
    if (ls1.speed[1] > 0 && y < ls1.loc[1]) return false
    if (ls1.speed[1] < 0 && y > ls1.loc[1]) return false

    if (ls2.speed[0] > 0 && x < ls2.loc[0]) return false
    if (ls2.speed[0] < 0 && x > ls2.loc[0]) return false
    if (ls2.speed[1] > 0 && y < ls2.loc[1]) return false
    if (ls2.speed[1] < 0 && y > ls2.loc[1]) return false

    return { x: x, y: y };
}


// input = `19, 13, 30 @ -2,  1, -2
// 18, 19, 22 @ -1, -1, -2
// 20, 25, 34 @ -2, -2, -4
// 12, 31, 28 @ -1, -2, -1
// 20, 19, 15 @  1, -5, -3`

let data = input.split('\n').map(parse)

let test = [[200000000000000, 400000000000000], [200000000000000, 400000000000000]]

let count = 0
for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
        let cross = findIntersection(data[i], data[j])
        if (cross) {
            if (cross.x >= test[0][0] && cross.x <= test[0][1] &&
                cross.y >= test[1][0] && cross.y <= test[1][1]
            ) count++
        }
    }
}

console.log(count)
