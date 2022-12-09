const { loadLines } = require('../input')

let lines = loadLines('09/input.txt')

// lines = `R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`.split('\n')

function parseLine(line) {
    [dir,distance] = line.split(" ")
    return [dir, parseInt(distance)]
}

const moveUpdate = {
    'U' : [0,-1],
    'D' : [0, 1],
    'L' : [-1, 0],
    'R' : [1, 0]
}

function moveKnotsOfRope(rope, motions) {
    let positionsOfTail = []
    positionsOfTail.push(rope[rope.length-1].slice())
    
    for (let i = 0; i < motions.length; i++) {
        const move = motions[i]
        const shift = moveUpdate[move[0]]
        for (let s = 0; s < move[1]; s++) {
            rope[0][0] += shift[0]
            rope[0][1] += shift[1]

            for (let k = 1; k < rope.length; k++) {
                let diff = [rope[k-1][0] - rope[k][0], rope[k-1][1] - rope[k][1]]
                if (Math.abs(diff[0]) == 2 || Math.abs(diff[1]) == 2) {
                    rope[k][0] += Math.sign(diff[0])
                    rope[k][1] += Math.sign(diff[1])
                }
            }

            if (!positionsOfTail.some(p => p[0] == rope[rope.length-1][0] && p[1] == rope[rope.length-1][1])) {
                positionsOfTail.push(rope[rope.length-1].slice())
            }
        }
    }
    return positionsOfTail    
}

let motions = lines.map(parseLine)
let rope = [[0,0], [0,0]]

console.log(moveKnotsOfRope(rope, motions).length)

let rope2 = [[0,0], [0,0], [0,0], [0,0], [0,0],[0,0], [0,0], [0,0],[0,0],[0,0]]

console.log(moveKnotsOfRope(rope2, motions).length)
