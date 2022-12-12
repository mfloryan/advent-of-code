const { loadLines } = require('../input')
const assert = require('assert/strict')
const { has } = require('lodash')
let lines = loadLines('22/input.txt')

lines = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`.split('\n')

function parseLine(line) {
    function parseC(c) {
        [c, v] = c.split('=')
        return v.split('..').map(x => Number.parseInt(x))
    }
    [state, coords] = line.split(' ')
    return {state, coords: coords.split(',').map(parseC)}
}

let robotSteps = lines.map(parseLine)

let cubes = new Array(101*101*101).fill(0);

function switchCubes(cubes, robotStep) {
    for (let z = Math.max(robotStep.coords[2][0],-50); z <= Math.min(robotStep.coords[2][1], 50); z++) {
        for (let y = Math.max(robotStep.coords[1][0],-50); y <= Math.min(robotStep.coords[1][1],50); y++) {
            for (let x = Math.max(robotStep.coords[0][0], -50); x <= Math.min(robotStep.coords[0][1],50); x++) {
                cubes[x+50 + 101 * (y+50) + 101*101 * (z+50)] = robotStep.state == 'on'?1:0
            }
        }
    }
}

// for (let i =0; i < robotSteps.length; i++) {
//     switchCubes(cubes, robotSteps[i])
// }

// console.log(cubes.filter( x => x == 1).length)

function getCubeSize(r) {
    return Math.abs(r.coords[2][1] - r.coords[2][0] + 1) *
    Math.abs(r.coords[1][1] - r.coords[1][0] + 1) *
    Math.abs(r.coords[0][1] - r.coords[0][0] + 1)
}

let stepsSizes = robotSteps.map( r => { 
    return {
        s: r.state == 'on'?'1':0,
        coords: r.coords,
        size: (
            Math.abs(r.coords[2][1] - r.coords[2][0]) *
            Math.abs(r.coords[1][1] - r.coords[1][0]) *
            Math.abs(r.coords[0][1] - r.coords[0][0]))
    }
})

function coordsOverlap(c1, c2) {
    let dx = Math.max(Math.min(c1[0][1], c2[0][1]) - Math.max(c1[0][0], c2[0][0]) + 1, 0);
    let dy = Math.max(Math.min(c1[1][1], c2[1][1]) - Math.max(c1[1][0], c2[1][0]) + 1, 0);
    let dz = Math.max(Math.min(c1[2][1], c2[2][1]) - Math.max(c1[2][0], c2[2][0]) + 1, 0);
    return dx * dy * dz
}

// console.log(stepsSizes.map(s => s.coords))

function calculateAllSlices(c1, c2) {

}

function tileForCubeIntersection(cube, intersection) {
    let lx = [[cube[0][0], intersection[0][0] - 1], [intersection[0][0], intersection[0][1]], [intersection[0][1] + 1, cube[0][1]]]
    let ly = [[cube[1][0], intersection[1][0] - 1], [intersection[1][0], intersection[1][1]], [intersection[1][1] + 1, cube[1][1]]]
    let lz = [[cube[2][0], intersection[2][0] - 1], [intersection[2][0], intersection[2][1]], [intersection[2][1] + 1, cube[2][1]]]

    return lx.flatMap(x => ly.map(y => [x,y] )).flatMap(sq => lz.map(z => [ sq[0], sq[1], z ]))
         .filter(c => c[0][1] - c[0][0] >= 0 && c[1][1] - c[1][0] >= 0 && c[2][1] - c[2][0] >= 0)
}

function sameCube(c1, c2) {
    return c1[0][0] == c2[0][0] && c1[0][1] == c2[0][1] && 
           c1[1][0] == c2[1][0] && c1[0][1] == c2[1][1] &&
           c1[2][0] == c2[2][0] && c1[0][1] == c2[2][1]
}

function returnExplodedCubes(existingCube, newCube) {
    let a = existingCube.coords;
    let b = newCube.coords;

    let intersection = [
        [ Math.max( a[0][0], b[0][0] ) , Math.min( a[0][1], b[0][1] ) ], //x
        [ Math.max( a[1][0], b[1][0] ) , Math.min( a[1][1], b[1][1] ) ], //y
        [ Math.max( a[2][0], b[2][0] ) , Math.min( a[2][1], b[2][1] ) ], //z
    ]

    let acs = tileForCubeIntersection(a, intersection)
    let bcs = tileForCubeIntersection(b, intersection)

    let r = {}
    if (newCube.state == 'off') {
        r.existing = acs.filter(a => !sameCube(a, intersection) ).map( x => { return {coords:x} })
        // r.new = bcs.filter(b => !sameCube(b, intersection) ).map( x => { return { coords:x, state: newCube.state } });
        r.new = []
        // return existingCube minus the overlap and the non-overlapping bits from c2
    } else {
        r.existing = acs.map( x => { return {coords:x} });
        r.new = bcs.filter(b => !sameCube(b, intersection)).map( x => { return {coords:x, state: newCube.state} })
        // return the existingCube plus the non-overlapping bits
    }
    return r;
}

function explodeOverlap(existingCubes2, newCube) {
    let nonOverlappingCubes = []
    let cubesToProcess = [newCube];
    let existingCubes = existingCubes2.slice()

    for (let i = 0; i < existingCubes.length; i++) {
        let existingCube = existingCubes[i];
        if (newCube.state == "on") {
            let newCubesToProcess = [];
            cubesToProcess.forEach(nc => {
                if (coordsOverlap(existingCube.coords, nc.coords)) {
                    let x = returnExplodedCubes(existingCube, nc)
                    nonOverlappingCubes.push(...x.existing)
                    newCubesToProcess.push(...x.new);
                } else {
                    nonOverlappingCubes.push(existingCube)
                }
            })
            cubesToProcess = newCubesToProcess
        } else {
            if (coordsOverlap(existingCube.coords, newCube.coords)) {
                let x = returnExplodedCubes(existingCube, newCube)
                nonOverlappingCubes.push(...x.existing)
            } else {
                nonOverlappingCubes.push(existingCube)
            }
        }
    }

    console.log("ctp", cubesToProcess)
    nonOverlappingCubes.push(...cubesToProcess.filter(c => c.state == "on"))

    // while (cubesToProcess.length > 0 && existingCubes.length > 0) {
    //     let cube = cubesToProcess.shift()
    //     let existingCube = existingCubes.shift()
    //     let hasOverlapped = false;

    //     if (coordsOverlap(existingCube.coords, cube.coords) > 0) {
    //         hasOverlapped = true;
    //         let x = returnExplodedCubes(existingCube, cube)
    //         nonOverlappingCubes.push(...x.existing)
    //         cubesToProcess.push(...x.new)
    //         // break;
    //     } else {
    //         existingCubes.push(existingCube)
    //         nonOverlappingCubes.push(existingCube)
    //     }
    //     if (!hasOverlapped && cube.state == 'on') nonOverlappingCubes.push(cube)
    //     // if (!hasOverlapped && cube.state == 'off')
    // }

    return nonOverlappingCubes
}

// console.log(robotSteps[0].coords, robotSteps[1].coords)
// let s = returnExplodedCubes(robotSteps[0], robotSteps[1])
// console.log(s.existing.map(getCubeSize), s.new.map(getCubeSize))

let newCubes = explodeOverlap([robotSteps[0]], robotSteps[1])
console.log(newCubes.map(c => c.coords))
console.log(newCubes.map(getCubeSize).reduce((p,c) => p+c,0))

newCubes = explodeOverlap(newCubes, robotSteps[2])
console.log(newCubes.map(c => c.coords))
console.log(newCubes.map(getCubeSize).reduce((p,c) => p+c,0))

// console.log(newCubes[1], robotSteps[2])
// let s = returnExplodedCubes(newCubes[1], robotSteps[2])
// console.log(s.existing.map(c => c.coords), s.new.map(c => c.coords))

// console.log(newCubes.map(c => c.coords))
// console.log(newCubes.map(getCubeSize).reduce((p,c) => p+c,0))


// newCubes = explodeOverlap(newCubes, robotSteps[2])
// newCubes = explodeOverlap(newCubes, robotSteps[3])
// console.log(newCubes.map(c => c.coords))

// console.log(newCubes.map(getCubeSize))
// newCubes = explodeOverlap(newCubes, robotSteps[1])
// console.log(newCubes)

// console.log(returnExplodedCubes(robotSteps[0], robotSteps[1]))