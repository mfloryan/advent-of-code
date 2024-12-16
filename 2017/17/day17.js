let input = 366

let buffer = [0]

let pos = 0
for (let i=1; i <= 2017; i++) {
    pos += input
    pos %= buffer.length
    buffer.splice(pos+1,0,i)
    pos++
}

console.log(buffer[buffer.indexOf(2017)+1])

