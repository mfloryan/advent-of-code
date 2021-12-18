
const { loadLines } = require('../input')
let lines = loadLines('17/input.txt')

function parseTarget(input) {
    function parseCoord(ci) {
        let [_, n]  = ci.split('=')
        let [n1, n2] = n.split('..')
        return [ Number.parseInt(n1), Number.parseInt(n2)]
    }
    let [a,b] = input.split(':',2)
    let [x,y] = b.split(', ')
    return [parseCoord(x), parseCoord(y)]
}

// let start = [0, 0]
// let target = parseTarget('target area: x=20..30, y=-10..-5');

// let v1 = [6,9]
// let r = simulateProbe(start, v1, target)
// console.log(r)

function simulateProbe(start, initialVelocity, target) {
    let position = start
    let velocity = initialVelocity.slice()
    let done = false;
    let maxY = 0;
    let ret
    let distance = Math.abs(target[0][1] - position[0]) + Math.abs(target[1][1] - position[1])
    let od = distance
    let dd
    do {
        position[0] += velocity[0]
        position[1] += velocity[1]

        distance = Math.abs(target[0][1] - position[0]) + Math.abs(target[1][1] - position[1])
        dd = Math.abs(distance - od);
        od = distance;

        if (position[1] > maxY) maxY = position[1]

        if (position[0] >= target[0][0] && position[0] <= target[0][1] &&
            position[1] <= target[1][1] && position[1] >= target[1][0] ) {
                ret = {initialVelocity, position, maxY}
                done = true
        }

        if (velocity[0] > 0) velocity[0]--;
        if (velocity[0] < 0) velocity[0]++;
        velocity[1]--;
        if (dd > 200) done = true
    } while (!done)

    return ret
}

function startShooting(target) {
    let count = 0;
    let maxY = 0;
    for (vx = 0; vx <= 500; vx++) {
        for (vy = -500; vy <= 500; vy++) {
            let sr = simulateProbe([0,0], [vx,vy], target);
            if (sr) {
                count++
                if (sr.maxY > maxY) {
                    maxY = sr.maxY
                    
                }
            }
        }
    }
    return {maxY, count}
}

console.log(startShooting( parseTarget('target area: x=20..30, y=-10..-5')))
console.log(startShooting( parseTarget(lines[0])))