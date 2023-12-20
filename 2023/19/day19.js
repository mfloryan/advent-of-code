const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseWorkflows(line) {
    let [a, b] = line.split('{')
    let c = b.substring(0, b.length - 1).split(',')

    let last = c.pop()
    let steps = c.map(_ => {
        let o = {}
        let d = _.split(":")
        o.key = d[0][0]
        o.s = d[0][1]
        o.value = parseInt(d[0].substring(2))
        o.next = d[1]
        return o
    })
    let o = {
        label: a,
        steps,
        last
    }

    return o
}

function parseParts(line) {

    let values = line.substring(1, line.length - 1).split(',')
        .map(_ => { let [key, value] = _.split("="); return [key, parseInt(value)] })

    let d = {}
    for (const v of values) {
        d[v[0]] = v[1]
    }
    return d
}

const comp = {
    '<': (a, b) => (a < b),
    '>': (a, b) => (a > b)
}

function processWorkflow(workflow, part) {
    for (const step of workflow.steps) {
        if (comp[step.s](part[step.key], step.value)) return step.next;
    }
    return workflow.last
}

function processPart(workflowsMap, part) {
    let next = "in"
    do {
        next = processWorkflow(workflowsMap[next], part)
        if (next == 'A' || next == 'R') return next
    } while (true)
}

// input = `px{a<2006:qkq,m>2090:A,rfg}
// pv{a>1716:R,A}
// lnx{m>1548:A,A}
// rfg{s<537:gd,x>2440:R,A}
// qs{s>3448:A,lnx}
// qkq{x<1416:A,crn}
// crn{x>2662:A,R}
// in{s<1351:px,qqz}
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}

// {x=787,m=2655,a=1222,s=2876}
// {x=1679,m=44,a=2067,s=496}
// {x=2036,m=264,a=79,s=2244}
// {x=2461,m=1339,a=466,s=291}
// {x=2127,m=1623,a=2188,s=1013}`

let [section1, section2] = input.split('\n\n')

let workflows = section1.split('\n').map(parseWorkflows)
let workflowsMap = {}
for (const w of workflows) {
    workflowsMap[w.label] = w
}

let parts = section2.split('\n').map(parseParts)

let processedParts = parts.map(p => [processPart(workflowsMap, p), p])
console.log(processedParts.filter(pp => pp[0] == 'A').reduce((p, c) => p + (c[1].x + c[1].m + c[1].a + c[1].s), 0))

