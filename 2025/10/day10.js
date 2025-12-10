const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseInput(row) {
    let x = row.split(' ')
    let f = x.shift()
    f = f.substring(1, f.length - 1)
    let l = x.pop()
    l = l.substring(1, l.length - 1).split(',').map(v => Number.parseInt(v))
    let y = x.map(v => v.substring(1, v.length).split(',').map(v => Number.parseInt(v)))
    return [f, y, l]
}

let machines = input.split('\n').map(r => parseInput(r))

function applyDigitalButton(lights, buttons) {
    return lights ^ buttons
}

function getDigitalMinPresses(machine) {
    var minPresses = Infinity

    function tryPresses(machine, pattern, presses = 0) {
        if (pattern == machine[0]) {
            minPresses = Math.min(presses, minPresses)
            return
        }
        if (presses > 8) return
        if (presses > minPresses) return
        for (let i = 0; i < machine[1].length; i++) {
            tryPresses(machine, applyDigitalButton(pattern, machine[1][i]), presses + 1)
        }
    }
    tryPresses(machine, 0)
    return minPresses
}


function incrementCounters(counters, buttonPress) {
    let newCounters = counters.slice()
    buttonPress.forEach(b => newCounters[b]++)
    return newCounters
}

function getMinCounterIncrements(machine) {
    var minPresses = Infinity

    function tryPresses(machine, counters, presses = 0) {

        let allCorrect = true
        for (let i = 0; i < counters.length; i++) {
            if (machine[2][i] != counters[i]) allCorrect = false;
            if (counters[i] > machine[2][i]) return
        }
        if (allCorrect) {
            minPresses = Math.min(presses, minPresses)
            console.log(presses)
            return
        }

        if (presses > minPresses) return
        for (let i = 0; i < machine[1].length; i++) {
            tryPresses(machine, incrementCounters(counters, machine[1][i]), presses + 1)
        }
    }
    tryPresses(machine, new Array(machine[2].length).fill(0))
    console.log(minPresses)
    return minPresses
}


function lightsToValue(lights) {
    return Number.parseInt(lights.replaceAll('.', '0').replaceAll('#', 1).split('').reverse().join(''), 2)
}

function buttonToValue(buttons) {
    let binary = new Array(getMax(buttons)).fill(0)
    buttons.forEach(b => binary[b] = 1)
    return Number.parseInt(binary.reverse().join(''), 2)
}

function getMax(buttons) {
    return buttons.flatMap(v => v).reduce((p, c) => Math.max(p, c), 0)
}


digitalMachines = machines.map(m => [lightsToValue(m[0]), m[1].map(v => buttonToValue(v)), m[2]])
console.log(
    digitalMachines.map(m => getDigitalMinPresses(m)).reduce((p, c) => p + c)
)
