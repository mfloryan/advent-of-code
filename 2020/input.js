const fs = require('fs')
const path = require('path')

function parseNumbers(inputLines) {
    return inputLines.map(x => Number.parseInt(x))
}

function loadLines(dir = __dirname, name = "input.txt") {
    return fs.readFileSync(path.join(dir, name), { encoding: 'utf8' }).split('\n')
}

exports.loadNumbers = function(dir = __dirname, name = "input.txt") {
    return parseNumbers(loadLines(dir, name))
}

exports.loadLines = loadLines
