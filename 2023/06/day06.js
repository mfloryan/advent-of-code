const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(input) {
    let [t, d] = input.split('\n')
    let time = t.split(' ')
    time.shift()
    let distance = d.split(' ')
    distance.shift()

    return  {
        time: time.filter(_ => _ != '').map(_ => parseInt(_)),
        distance: distance.filter(_ => _ != '').map(_ => parseInt(_)),
    }
}

let data = parse(input)
let races = data.time.map((t,i) => [t, data.distance[i]])

function waysToWin(time, distance) {
    let count = 0;

    for (let t = 0; t <= time; t++) {
        let d = (t) * (time - t)
        if (d > distance) count++
    }
    return count
}

console.log(races.map(_ => waysToWin(_[0], _[1])).reduce((p,c) => p*c, 1))

let time = parseInt(races.map(r => r[0]).join(''))
let distance = parseInt(races.map(r => r[1]).join(''))

console.log(waysToWin(time, distance))
