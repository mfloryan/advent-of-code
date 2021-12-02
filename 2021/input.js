const fs = require('fs')
const path = require('path')

function parseNumbers(inputLines) {
    return inputLines.map(x => Number.parseInt(x))
}

function loadLines(name = "input.txt") {
    return fs.readFileSync(path.join(__dirname, name), { encoding: 'utf8' }).split('\n')
}

exports.loadNumbers = function(name = "input.txt") {
    return parseNumbers(loadLines(name))
    }

exports.loadLines = loadLines
