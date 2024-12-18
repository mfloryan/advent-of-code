const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let [fields, ticket, tickets] = input.split('\n\n')

fields = fields
    .split('\n')
    .map(l => l.split(': '))
    .map(v => {
        return {
            name: v[0],
            rules: v[1].split(' or ').map(r => r.split('-'))
        }
    })

ticket = ticket.split('\n')[1].split(',').map(Number)
tickets = tickets.split('\n').slice(1).map(r => r.split(',').map(Number))

function getInvalidValues(ticket, fields) {
    return ticket.filter(value => !fields.some(
        f => f.rules.some(r => value >= r[0] && value <= r[1])
    ))
}

let addArrays = (a, b) => {
    if (a.length != b.length) throw "Can't sum"
    return (a.map((v, i) => v + b[i]))
}

const multiply = (a, b) => a * b
const add = (a, b) => a + b

console.log(
    tickets.flatMap(t => getInvalidValues(t, fields)).reduce(add)
)

let validTickets = tickets.filter(t => getInvalidValues(t, fields).length == 0)

function matchFields(fields, sampleData, fieldValidation) {
    let allFields = [...fields]
    let matchedFileds = {}

    do {
        for (const f of allFields) {
            let ignorePosition = Object.keys(matchedFileds).map(Number)
            let x = sampleData.map(
                ticket => ticket.map((v, i) =>
                    (!ignorePosition.includes(i)
                        && fieldValidation(f, v)) ? 1 : 0)
            ).reduce(addArrays)
            if (x.filter(v => v == sampleData.length).length == 1) {
                matchedFileds[x.indexOf(sampleData.length)] = f
                allFields.splice(allFields.indexOf(f), 1)
                break;
            }
        }
    }
    while (Object.keys(matchedFileds).length < fields.length)

    return matchedFileds
}


let orderedFields = matchFields(fields, validTickets, (f, v) => f.rules.some(r => v >= r[0] && v <= r[1]))
let interestingFields = Object.keys(orderedFields).filter(k => orderedFields[k].name.startsWith("departure")).map(Number)
console.log(
    interestingFields.map(i => ticket[i]).reduce(multiply)
)
