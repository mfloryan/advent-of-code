const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [a, b] = line.split(' -> ')

    let o = {
        name: a,
        next: b.split(", ")
    }
    if (a.startsWith('%')) { o.type = '%'; o.name = a.substring(1) }
    if (a.startsWith('&')) { o.type = '&'; o.name = a.substring(1) }
    return o
}

let modules = input.split('\n').map(parse)
let broadcaster = modules.find(_ => _.name == 'broadcaster')

function initState(modules) {
    let system = {}
    for (const m of modules.filter(_ => _.type == '%')) {
        system[m.name] = { state: false }
    }
    for (const m of modules.filter(_ => _.type == '&')) {
        system[m.name] = { memory: {}, state: false }
        let inputs = modules.filter(_ => _.next.includes(m.name))
        for (const input of inputs) {
            system[m.name].memory[input.name] = false
        }
    }
    return system
}

const getNextSignal = (from, name, pulse) => { return { from, name, pulse } }
const addNextSignals = (queue, next, from, pulse) => queue.push(...next.map(_ => getNextSignal(from, _, pulse)))

function propagateSignal(modules, start, system, signalProcessor = undefined) {
    let q = []
    addNextSignals(q, start.next, start.name, false)

    while (q.length > 0) {
        let nextModuleAndPulse = q.shift()
        let m = modules.find(_ => _.name == nextModuleAndPulse.name)
        if (m && m.type == '%') {
            if (!nextModuleAndPulse.pulse) {
                system[m.name].state = !system[m.name].state
                addNextSignals(q, m.next, m.name, system[m.name].state)
            }
        } else if (m && m.type == '&') {
            system[m.name].memory[nextModuleAndPulse.from] = nextModuleAndPulse.pulse
            addNextSignals(q, m.next, m.name, !Object.values(system[m.name].memory).every(_ => _))
        }

        if (signalProcessor) signalProcessor(nextModuleAndPulse)
    }
}

const gcd = (a, b) => a ? gcd(b % a, a) : b
const lcm = (a, b) => a * b / gcd(a, b)

// part 1
let system = initState(modules)
let count = [0, 0];
for (let i = 0; i < 1000; i++) {
    count[0]++
    let c = propagateSignal(modules, broadcaster, system, p => count[p.pulse ? 1 : 0]++)
}
console.log(count[0] * count[1])

// part 2
system = initState(modules)
let rxInputName = modules.find(_ => _.next.includes('rx')).name
let inputSignalsCycle = modules.filter(_ => _.next.includes(rxInputName)).map(_ => _.name).reduce((p, c) => { p[c] = undefined; return p; }, {})

let buttons = 0
let done = false
do {
    buttons++
    propagateSignal(modules, broadcaster, system, p => {
        if (p.name == rxInputName && p.pulse) {
            if (!inputSignalsCycle[p.from]) {
                inputSignalsCycle[p.from] = buttons
                if (Object.values(inputSignalsCycle).every(_ => _)) {
                    done = true
                }
            }
        }
    })
} while (!done)

console.log(Object.values(inputSignalsCycle).reduce(lcm))
