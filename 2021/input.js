const fs = require('fs')
const path = require('path')

function parseNumbers(inputString) {
    return inputString.split('\n').map(x => Number.parseInt(x))
}

exports.loadNumbers = function(name = "input.txt") {
    let fileInput =  fs.readFileSync(path.join(__dirname, name), { encoding: 'utf8' })
    return parseNumbers(fileInput)
}