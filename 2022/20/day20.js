const { loadLines } = require('../input')

let lines = loadLines('20/input.txt')
// lines = `1
// 2
// -3
// 3
// -2
// 0
// 4`.split('\n')
let data = lines.map(Number)

function scrambleArray(data) {
    let newData = data.map((v,i) => [i,v])
    for (let i = 0; i < data.length; i++) {
        let numberToMove = newData.find(e => e[0]==i)
        let index = newData.indexOf(numberToMove)
        let newIndex = (index + numberToMove[1]) % (data.length -1)
        newData.splice(index, 1)
        newData.splice(newIndex, 0, numberToMove)
    }
    return newData
}

function scrambleArray(data, number_of_mixing = 1) {
    let newData = data.map((v, i) => [i, v])
    for (let n = 0; n < number_of_mixing; n++) {
        for (let i = 0; i < data.length; i++) {
            let numberToMove = newData.find(e => e[0] == i)
            let index = newData.indexOf(numberToMove)
            let newIndex = (index + numberToMove[1]) % (data.length - 1)
            newData.splice(index, 1)
            newData.splice(newIndex, 0, numberToMove)
        }
    }
    return newData
}

function coords(newarray) {
    let indexOfZero = newarray.indexOf(0)
    return newarray[(indexOfZero + 1000) % newarray.length] + newarray[(indexOfZero + 2000) % newarray.length] + newarray[(indexOfZero + 3000) % newarray.length]
}

console.log(coords(scrambleArray(data).map(e => e[1])))
console.log(coords(scrambleArray(data.map(v => v * 811589153), 10).map(e =>e[1])))
