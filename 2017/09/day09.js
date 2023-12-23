const fs = require('fs')
let line = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf8' })

function cleanGarbage(stream) {
    let cleanStream = []
    let streamArray = stream.split('')
    let inGarbage = false
    for (let i = 0; i < streamArray.length; i++) {
        if (inGarbage) {
            if (streamArray[i] == '!') {
                i++;
            } else {
                if (streamArray[i] == '>') inGarbage = false
            }
        } else {
            if (streamArray[i] == '<') {
                inGarbage = true
            } else {
                cleanStream.push(streamArray[i])
            }
        }
    }
    return cleanStream.join('')
}

function countScore(stream) {
    let streamArray = stream.split('')
    let groupScore = 0
    let totalScore = 0
    for (let i = 0; i < streamArray.length; i++) {
        let char = streamArray[i]
        if (char == '{') {
            groupScore++;
        } else if(char == '}') {
            totalScore += groupScore
            groupScore--;
        }
    }
    return totalScore
}

function countGarbage(stream) {
    let grabageCount = 0
    let streamArray = stream.split('')
    let inGarbage = false
    for (let i = 0; i < streamArray.length; i++) {
        if (inGarbage) {
            if (streamArray[i] == '!') {
                i++;
            } else {
                if (streamArray[i] == '>') inGarbage = false
                else grabageCount++;
            }
        } else {
            if (streamArray[i] == '<') {
                inGarbage = true
            }
        }
    }
    return grabageCount
}

let cleanStream = cleanGarbage(line)
console.log(countScore(cleanStream))
console.log(countGarbage(line))
