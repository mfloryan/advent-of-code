const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    [a, b] = line.split(' ')
    return [a, b.split(',').map(_ => parseInt(_))]
}

function generateOptions(pattern, current = "", groups, options = [0]) {
    if (current.length == pattern.length) {
        if (validateArrangement([current, groups])) options[0]++
        return
    }

    if (current.length > 6 && !validatePartialArrangement(pattern, current, groups)) return

    let next = pattern[current.length]
    if (next == "?") {
        generateOptions(pattern, current + ".", groups, options)
        generateOptions(pattern, current + "#", groups, options)
    } else {
        generateOptions(pattern, current + next, groups, options)
    }
}

function generateOptions2(pattern) {
    let options = []
    // for (const char of pattern)
}

function countWays(row, index) {
    console.log(new Date().toISOString(), index, row[0])
    let options = [0]
    generateOptions(row[0], "", row[1], options)
    return options[0]
}

function validateArrangement(row) {
    let groups = getGroups(row[0])
    return (row[1].length == groups.length && row[1].every((_, index) => _ == groups[index]))
}

function validatePartialArrangement(pattern, springs, groups) {
    let readyGroups = getGroups(springs)
    if (readyGroups.length < 2) return true
    if (readyGroups.length > groups.length) return false
    // console.log(pattern.length - springs.length, groups.length - broken.length, pattern.length - springs.length < groups.length - broken.length)
    // if ((pattern.length - springs.length) * 2 < groups.length - broken.length) return false
    let groupsLeft = groups.slice(readyGroups.length)
    if (groupsLeft.length != 0 && groupsLeft.reduce((p,c) => p+c) > (pattern.length - springs.length)) return false
    let valid = readyGroups.slice(0, readyGroups.length - 1).every((_, index) => _ == groups[index])
    return valid
}

function unfold(row) {
    return [
        row[0] + "?" + row[0] + "?" + row[0] + "?" + row[0] + "?" + row[0],
        [...row[1], ...row[1], ...row[1], ...row[1], ...row[1]]
    ]
}

function getGroups(springs) {
    let groups = []
    let currentGroup = 0
    let in_group = false
    for (const c of springs) {
        if (c == '#') {
            if (in_group) currentGroup++;
            else {
                in_group = true
                currentGroup = 1
            }
        } else {
            if (in_group) {
                groups.push(currentGroup)
                currentGroup = 0
                in_group = false
            }
        }
    }
    if (in_group) groups.push(currentGroup)
    return groups
}

// console.log(getGroups('#.#.###'))
// console.log(getGroups('#....######..#####.'))
// console.log(getGroups('.#.###.#.######'))
// console.log(getGroups('####.#...#...'))

// return

// input = `???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1`

let data = input.split('\n').map(parse)

const sum = (p, c) => p + c
console.log(data.map((r,i) => countWays(r, i)).reduce(sum))
console.log(data.map(unfold).map((r,i) => countWays(r, i)).reduce(sum))
