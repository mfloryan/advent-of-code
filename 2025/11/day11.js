const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseLine(line) {
    let d = line.split(' ')
    let f = d.shift()
    f = f.substring(0, f.length - 1)
    return [f, d]
}

let data = input.split('\n').map(l => parseLine(l))

let paths = 0
function findPath(g, start, end, visited = new Set()) {
    if (start == end) {
        paths++
        return
    }
    visited.add(start)

    let next = g.find(n => n[0] == start)
    for (const n of next[1]) {
        if (!visited.has(n)) findPath(g, n, end, visited)
    }
    visited.delete(start)
}

function countPaths(g, start, end, memo = new Map()) {
    if (start === end) return 1n

    if (memo.has(start)) return memo.get(start)

    const next = g.find(n => n[0] === start)
    if (!next) return 0n  // dead-end

    let count = 0n
    for (const child of next[1]) {
        count += countPaths(g, child, end, memo)
    }

    memo.set(start, count)
    return count
}

findPath(data, 'you', 'out')
console.log(paths)

const pathsToFft = countPaths(data, 'svr', 'fft')
const pathsFftToDac = countPaths(data, 'fft', 'dac')
const pathsDacToOut = countPaths(data, 'dac', 'out')

const total = pathsToFft * pathsFftToDac * pathsDacToOut
console.log(total)
