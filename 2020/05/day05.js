const { loadLines } = require('../input')

let lines = loadLines('05/input.txt')

function decodeSeat(line) {
    let seatCode = line.split('')
    let seat = {
        r: Number.parseInt(seatCode.slice(0,7).map(x => x== 'F'?0:1).join(''), 2) ,
        c: Number.parseInt(seatCode.slice(7,10).map(x => x== 'L'?0:1).join(''), 2) ,
    }
    seat.id = seat.r * 8 + seat.c
    return seat
}

console.log("Day 05 - part 1:",
    lines.map(decodeSeat).reduce((p,c) => (Math.max(p,c.id)), 0)
)

let x = lines.map(decodeSeat).sort( (a,b) => a.id - b.id).reduce( (p,c) => {
    if (p.id +1 < c.id) console.log(p,c)
    return c
 })