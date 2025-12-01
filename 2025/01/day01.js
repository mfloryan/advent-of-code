const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let data = input.split('\n').map(l => { return [l[0], parseInt(l.substring(1))] })

function pass1(data) {
    let heading = 50
    let pass = 0
    for (const rot of data) {
        if (rot[0] == 'L') {
            heading = (100 + (heading - rot[1])) % 100
        } else {
            heading += rot[1]
            heading = heading % 100
        }
        if (heading == 0) pass += 1
    }
    return pass
}

function pass2(data) {
    let heading = 50
    let pass = 0
    for (const rot of data) {
        for (let i = rot[1]; i > 0; i--) {
            if (rot[0] == 'L') {
                heading -= 1
            } else {
                heading += 1
            }

            if (heading < 0) heading = 99
            if (heading > 99) heading = 0

            if (heading == 0) {
                pass++
            }
        }
    }
    return pass
}

console.log(pass1(data))
console.log(pass2(data))