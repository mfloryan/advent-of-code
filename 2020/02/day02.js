const { loadLines } = require('../input')

let sampleInput = 
`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`

function parseLine(line) {
    let [policy, password] = line.split(":")
    let [minmax, letter] = policy.split(" ")
    let [min, max] = policy.split("-").map(x => Number.parseInt(x))
    return [{ min, max, letter }, password.trim()]
}

function validatePassword(policy, password) {
    let stats = passwordStats(password)
    return (stats[policy.letter] >= policy.min) && (stats[policy.letter] <= policy.max)
}

function xor(a,b) {
    return ( a || b ) && !( a && b );
}

function validatePasswordTwo(policy, password) {
    return xor(password[policy.min - 1] == policy.letter,
           password[policy.max - 1] == policy.letter)
}

function passwordStats(password) {
    return password.split('')
        .reduce((p,c) => {
            p[c] = p[c]?p[c]+1:1;
            return p;
        }, {});
}

console.log(
    sampleInput.split('\n')
        .map(parseLine)
        .map(x => validatePassword(x[0],x[1]))
        .filter(x => x)
        .length
)

console.log(
    sampleInput.split('\n')
        .map(parseLine)
        .map(x => validatePasswordTwo(x[0],x[1]))
        .filter(x => x)
        .length
)

console.log(
    loadLines('02/input.txt')
        .map(parseLine)
        .map(x => validatePassword(x[0],x[1]))
        .filter(x => x)
        .length
)

console.log(
    loadLines('02/input.txt')
        .map(parseLine)
        .map(x => validatePasswordTwo(x[0],x[1]))
        .filter(x => x)
        .length
)
