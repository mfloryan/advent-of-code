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

function propagateSignal(modules, start, system, outProcessor = undefined) {
    let pulseCount = [0,0]
    let q = []
    start.next.map(_ => { return { from: start.name, name: _, pulse: false } }).forEach(_ => q.push(_))

    while (q.length > 0) {
        let nextStep = q.shift()
        let m = modules.find(_ => _.name == nextStep.name)
        pulseCount[nextStep.pulse?1:0]++
        // console.log("n:", nextStep, m)
        if (!m) {
            if (outProcessor) outProcessor(nextStep.pulse)
        } else if (m.type == '%') {
            if (!nextStep.pulse) {
                system[m.name].state = !system[m.name].state
                m.next.map(_ => { return { from: m.name, name: _, pulse: system[m.name].state } }).forEach(_ => q.push(_))
            }
        } else if (m.type == '&') {
            system[m.name].memory[nextStep.from] = nextStep.pulse
            if (Object.values(system[m.name].memory).every(_ => _)) {
                m.next.map(_ => { return { from: m.name, name: _, pulse: false } }).forEach(_ => q.push(_))
            } else {
                m.next.map(_ => { return { from: m.name, name: _, pulse: true } }).forEach(_ => q.push(_))
            }
        }
    }
    return pulseCount
}

let system = initState(modules)
let count = [0,0];
for (let i =0; i < 1000; i++) {
    count[0]++
    let c = propagateSignal(modules, broadcaster, system)
    count[0] += c[0]
    count[1] += c[1]
}
console.log(count[0] * count[1])

system = initState(modules)
let buttons = 0
let done = false
do {
    buttons++
    if (buttons % 1000000 == 0) console.log( new Date().toISOString(), buttons)
    let c = propagateSignal(modules, broadcaster, system, x => { console.log(x,i); if (!x) done=true;})
} while (!done)
console.log(buttons)
