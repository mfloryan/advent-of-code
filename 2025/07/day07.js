const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function splitBeams(diagram) {
    let beams = []
    beams.push(diagram[0].indexOf('S'))
    let splits = 0
    for (let i = 1; i < diagram.length; i++) {
        let newBeams = new Set()
        for (const beam of beams) {
            if (diagram[i][beam] == '^') {
                splits++
                newBeams.add(beam - 1)
                newBeams.add(beam + 1)
            } else {
                newBeams.add(beam)
            }
        }
        beams = [...newBeams]
    }

    return splits
}

function splitTime(memory, diagram, i, beam) {
    let key = `${i}-${beam}`
    if (memory.has(key)) return memory.get(key)

    if (i == diagram.length) { return 1 }

    if (diagram[i][beam] == '^') {
        let ret =
            splitTime(memory, diagram, i + 1, beam - 1) +
            splitTime(memory, diagram, i + 1, beam + 1)
        memory.set(key, ret)
        return ret
    } else {
        let ret = splitTime(memory, diagram, i + 1, beam)
        memory.set(key, ret)
        return ret
    }
}

let diagram = input.split('\n').map(r => r.split(''))
console.log(splitBeams(diagram))

console.log(splitTime(new Map(), diagram, 1, diagram[0].indexOf('S')))
