const { loadLines } = require('../input')

let lines = loadLines('06/input.txt')

let buffer = lines[0].split('');

function getPositionOfFirstUniqueSequence(buffer, sequenceLen) {
    for (let i = sequenceLen; i < buffer.length; i++) {
        let four = buffer.slice(i-sequenceLen,i)
        let unique = new Set(four)
        if (unique.size == sequenceLen) {
            console.log(i)
            break
        }
    }    
}

getPositionOfFirstUniqueSequence(buffer, 4)
getPositionOfFirstUniqueSequence(buffer, 14)
