const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9`

let data = input.split('\n').map(line => line.split(" ").map(v => parseInt(v)))

function isSafe(report) {

    let diffs = []
    report.reduce((p, c) => { diffs.push(c - p); return c })
    if (diffs.some(d => Math.abs(d) < 1 || Math.abs(d) > 3)) return false
    if (diffs.some(d => Math.sign(d) != Math.sign(diffs[0]))) return false;
    return true
}

function isSafe2(report) {

    if (isSafe(report)) return true
    for (let i = 0; i < report.length; i++) {
        let stripped = report.toSpliced(i, 1)
        if (isSafe(stripped)) {
            return true
        }
    }
    return false
}

console.log(data.map(r => isSafe(r)).filter(v => v).length)
console.log(data.map(r => isSafe2(r)).filter(v => v).length)
