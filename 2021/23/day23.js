const { loadLines } = require('../input')
const assert = require('assert/strict')
const { create } = require('lodash')
let lines = loadLines('23/input.txt')

let energy = {
    A:1,
    B:10,
    C:100,
    D:1000
}

let creatures = [
    { type: 'A', position: { s: 'r', t: 'A', l: 2 } },
    { type: 'A', position: { s: 'r', t: 'D', l: 2 } },
    { type: 'B', position: { s: 'r', t: 'A', l: 1 } },
    { type: 'B', position: { s: 'r', t: 'C', l: 1 } },
    { type: 'C', position: { s: 'r', t: 'B', l: 1 } },
    { type: 'C', position: { s: 'r', t: 'C', l: 2 } },
    { type: 'D', position: { s: 'r', t: 'D', l: 1 } },
    { type: 'D', position: { s: 'r', t: 'B', l: 2 } },
]

creatures = [
    { type: 'A', position: { s: 'r', t: 'C', l: 1 } },
    { type: 'A', position: { s: 'r', t: 'B', l: 2 } },
    { type: 'B', position: { s: 'r', t: 'B', l: 1 } },
    { type: 'B', position: { s: 'r', t: 'D', l: 2 } },
    { type: 'C', position: { s: 'r', t: 'D', l: 1 } },
    { type: 'C', position: { s: 'r', t: 'A', l: 2 } },
    { type: 'D', position: { s: 'r', t: 'A', l: 1 } },
    { type: 'D', position: { s: 'r', t: 'C', l: 2 } },
]


function isAmphipodInFrontInTheRoom(creatures, roomType) {
    return creatures.find(o => o.position.s == 'r' && o.position.t == roomType && o.position.l == 1)
}

function evaluateAmphipodsFinalPosition(creatures) {
    creatures.forEach(c => {
        if (c.position.s == 'r' && c.position.t == c.type) {
            //it's in the right room
            if (c.position.l == 2) {
                // and is at the back of the room
                c.final = true;
            } else {
                // it's in front and the same creature is behind it
                let rightBehind = creatures.some(o => o.position.s == 'r' && o.position.t == c.type && o.type == c.type && o.position.l == 2)
                if (rightBehind) {
                    c.final = true
                } else {
                    c.final = false
                }
            }
        } else {
            c.final = false
        }
    })
}

let possibleHallwaySpaces = [1,2,4,6,8,10,11]

function checkHallwaySpace(creatures, position) {
    let possible = possibleHallwaySpaces.map(x => { return {s:'h', l:x}})
    let creaturesOut = creatures.filter(c => c.position.s == 'h')
    if (creaturesOut.length < 1)
        return possible

    let entrance = hallRoomEntrance[position.t]
    let left = possible.filter(p => p.l < entrance)
    let right = possible.filter(p => p.l > entrance)
    let leftCreature = creaturesOut.filter(c => c.position.l < entrance).map(c => c.position.l).reduce((p,c) => Math.max(p,c), 0)
    let rightCreature = creaturesOut.filter(c => c.position.l > entrance).map(c => c.position.l).reduce((p,c) => Math.min(p,c), 20)
    let r = []
    r.push(...left.filter(p => p.l > leftCreature))
    r.push(...right.filter(p => p.l < rightCreature))
    if (r.length > 0) return r
    return false
}

function canItMoveToItsRoom(creatures, type) {

    let amphipodsInTargetRoom = creatures.filter(c => c.position.s == 'r' && c.position.t == type);

    // it can move to the room if its room is empty or
    // if there is already one other in its room and that other is in its correct room

    if (amphipodsInTargetRoom.length == 0)
        return {s:'r', t:type, l: 2}

    if (amphipodsInTargetRoom.length == 1) {
        if (amphipodsInTargetRoom[0].type == type)
        return {s:'r', t:type, l: 1 }
    }

    return false
}

let hallRoomEntrance = {
    A:3,
    B:5,
    C:7,
    D:9
}

function isHallwayCreatureBlockedFromReturningToItsRoom(creatures, position, destination) {
    let creaturesInTheHall = creatures.filter(c => c.position.s == 'h' && (position.s == 'r' || c.position.l != position.l))
    if (creaturesInTheHall.length == 0)
        return false;
    //nothing between me and the room entrance
    let left = Math.min(position.l, hallRoomEntrance[destination.t])
    let right = Math.max(position.l, hallRoomEntrance[destination.t])
    return creaturesInTheHall.some(c => c.position.l > left && c.position.l < right)
}

function calculateCost(creature, destination) {
    let creatureEnergy = energy[creature.type]
    let steps = 0;

    if (creature.position.s == 'r') {
        // starting in a room
        steps += creature.position.l // one or two steps to exit the room
        if (destination.s == 'r') {
            // ending in a room
            steps += Math.abs( hallRoomEntrance[creature.position.t] - hallRoomEntrance[destination.t])
            steps += destination.l
        } else {
            // ending in a hallway
            steps += Math.abs( hallRoomEntrance[creature.position.t] - destination.l)
        }
    } else {
        // starting in a hallway
        steps += Math.abs( creature.position.l - hallRoomEntrance[destination.t])
        // ending in a room
        steps += destination.l
    }
    return creatureEnergy * steps;
}

function defineMove(creature, destination) {
    return {
        ap: creature.position,
        to: destination,
        cost: calculateCost(creature, destination)
    }
}

function getAllPossibleAmphipodsMoves(creatures) {
    let possibleMovers = [];

    let creaturesThatNeedToMove = creatures.filter(c => !c.final)
    for (let i = 0; i < creaturesThatNeedToMove.length; i++) {
        c = creaturesThatNeedToMove[i]
        if (c.position.s == 'r') {
            //in a room
            if (c.position.l == 1) {
                // can I go to my final room already?
                let roomMove = canItMoveToItsRoom(creatures, c.type)
                if (roomMove) {
                    if (!isHallwayCreatureBlockedFromReturningToItsRoom(creaturesThatNeedToMove, c.position, roomMove)) {
                        return [defineMove(c,roomMove)]
                    }
                }
                // check if there is space outside
                let hs = checkHallwaySpace(creaturesThatNeedToMove, c.position);
                if (hs) {
                    possibleMovers.push(...hs.map( s => defineMove(c, s)))
                }
            } else {
                let inFront = isAmphipodInFrontInTheRoom(creatures, c.position.t)
                if (!inFront) {
                    // is there space in the hallway
                    let hs = checkHallwaySpace(creaturesThatNeedToMove, c.position);
                    if (hs) {
                        possibleMovers.push(...hs.map( s => defineMove(c, s)))
                    }
                }
            }
        } else {
            // in the hallway
            let roomMove = canItMoveToItsRoom(creatures, c.type)
            if (roomMove) {
                if (!isHallwayCreatureBlockedFromReturningToItsRoom(creaturesThatNeedToMove, c.position, roomMove)) {
                    return [defineMove(c,roomMove)]
                }
            }
        }
    }
    return possibleMovers;
}

function applyMove(creatures, move) {
    //apply the move
    let movingCreature = creatures.find(c => c.position.s == move.ap.s && c.position.t == move.ap.t && c.position.l == move.ap.l);
    if (!movingCreature) {
        console.error("Wrong move?", move)
        return
    }
    movingCreature.position = move.to
}

let allMoves = [];

function findCorrectMoves(creatures, move, moves, depth = 0) {

    if (move) {
        moves.push(move)
        applyMove(creatures, move)
    }

    evaluateAmphipodsFinalPosition(creatures)

    // console.log(depth)
    // drawCreatures(creatures)

    if (creatures.every(c => c.final)) {
        // console.log('DONE')
        allMoves.push(moves)
        return
    }

    let nextMoves = getAllPossibleAmphipodsMoves(creatures)
    if (nextMoves.length == 0) {
        // console.log("DEAD END", depth, "\n")
        return
    }

    nextMoves.forEach( move => findCorrectMoves(JSON.parse(JSON.stringify(creatures)), move, moves.slice(), depth+1 ))
    // console.log("END", depth, '\n')
}

function drawCreatures(creatures) {
    let row = []
    for (let i = 1; i <= 11; i++) {
        let a = creatures.find(c => c.position.s == 'h' && c.position.l == i)
        if (a) {
            row.push(a.type)
        } else {
            row.push('.')
        }
    }
    console.log(row.join(''))
    let _ = [1,2]
    _.map(row => {
        let r = ['  ']
        let rs = ['A','B','C','D']
        rs.map(room => {
            let a = creatures.find(c => c.position.s == 'r' && c.position.l == row && c.position.t == room)
            if (a) {
                if (a.final) r.push(a.type.toLowerCase()); else r.push(a.type);
            }
            else r.push('.')
            r.push(' ')
        })
        r.push('  ')
        console.log(r.join(''))
    })
}


// drawCreatures(creatures)
// evaluateAmphipodsFinalPosition(creatures)
// let moves = getAllPossibleAmphipodsMoves(creatures)
// applyMove(creatures, moves[0])

// evaluateAmphipodsFinalPosition(creatures)
// drawCreatures(creatures)

// moves = getAllPossibleAmphipodsMoves(creatures)
// applyMove(creatures, moves[0])
// evaluateAmphipodsFinalPosition(creatures)
// drawCreatures(creatures)

// moves = getAllPossibleAmphipodsMoves(creatures)
// applyMove(creatures, moves[0])
// evaluateAmphipodsFinalPosition(creatures)
// drawCreatures(creatures)

// moves = getAllPossibleAmphipodsMoves(creatures)
// applyMove(creatures, moves[0])
// evaluateAmphipodsFinalPosition(creatures)
// drawCreatures(creatures)

// moves = getAllPossibleAmphipodsMoves(creatures)
// applyMove(creatures, moves[0])
// evaluateAmphipodsFinalPosition(creatures)
// drawCreatures(creatures)

// moves = getAllPossibleAmphipodsMoves(creatures)
// console.log(moves)

drawCreatures(creatures)

findCorrectMoves(creatures, undefined, [])
console.log(allMoves.length)
console.log(
     allMoves.map( m => m.reduce((p,c) => p + c.cost,0)).reduce((p,c) => Math.min(p,c), Number.MAX_VALUE)
)
 //15356 = too low :(

// let testCreatures = [
//     { type: 'A', position: { s: 'r', t: 'A', l: 2 } },
//     { type: 'A', position: { s: 'r', t: 'D', l: 2 } },
//     { type: 'B', position: { s: 'r', t: 'A', l: 1 } },
//     { type: 'B', position: { s: 'h', l: 4 } },
//     { type: 'C', position: { s: 'h', l: 6 } },
//     { type: 'C', position: { s: 'r', t: 'C', l: 2 } },
//     { type: 'D', position: { s: 'r', t: 'D', l: 1 } },
//     { type: 'D', position: { s: 'r', t: 'B', l: 2 } },
// ]
// evaluateAmphipodsFinalPosition(testCreatures)
// drawCreatures(testCreatures)

// console.log(
//     getAllPossibleAmphipodsMoves(testCreatures)
// )