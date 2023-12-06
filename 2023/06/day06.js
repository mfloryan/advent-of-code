const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(input) {
    let [t, d] = input.split('\n')
    let time = t.split(' ')
    time.shift()
    time = time.filter(_ => _ != '').map(_ => parseInt(_))
    let distance = d.split(' ')
    distance.shift()
    distance = distance.filter(_ => _ != '').map(_ => parseInt(_))

    return time.map((t, index) => { return { time: t, distance: distance[index] } })
}

let races = parse(input)

function waysToWin(time, distance) {
    let count = 0

    for (let t = 1; t < time; t++) {
        let d = t * (time - t)
        if (d > distance) count++
    }
    return count
}

function waysToWin2(time, distance) {
    let a = -1
    let b = time
    let c = (-1) * distance

    let t1 = ( - b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    let t2 = ( - b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)

    return ( Math.floor(t2) - Math.floor(t1))
}

console.log(races.map(_ => waysToWin2(_.time, _.distance)).reduce((p, c) => p * c, 1))

let time = parseInt(races.map(r => r.time).join(''))
let distance = parseInt(races.map(r => r.distance).join(''))

console.log(waysToWin2(time, distance))
