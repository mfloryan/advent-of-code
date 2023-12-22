const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let [earliest, services] = input.split('\n')
earliest = parseInt(earliest)
services = services.split(',').map((_,i) => [i, _]).filter(_ => _[1] != 'x').map(_ => [_[0], parseInt(_[1])])

let departures = services.map(s => [s[1], s[1] - earliest % s[1]]).toSorted((a,b) => a[1] - b[1])
console.log(departures[0][0] * departures[0][1])

