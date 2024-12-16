
function evaluateBuffer(spins) {
    let buffer = [0]

    let pos = 0
    for (let i = 1; i <= 2017; i++) {
        pos += spins
        pos %= buffer.length
        buffer.splice(pos + 1, 0, i)
        pos++
    }
    return buffer
}

function evaluateBuffer2(spins) {
    let position = 0
    let lastValue = 0
    for (let i = 1; i <= 50000000; i++) {
        position = ((position + spins) % i) + 1;
        if (position == 1)
            lastValue = i
    }
    return lastValue
}

let input = 366

let buffer = evaluateBuffer(input)
console.log(buffer[buffer.indexOf(2017) + 1])
console.log(evaluateBuffer2(input))
