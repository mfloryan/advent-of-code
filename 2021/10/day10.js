const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('10/input.txt')

let data = lines.map(l => l.split(''))
// data = `[({(<(())[]>[[{[]{<()<>>
// [(()[<>])]({[<{<<[]>>(
// {([(<{}[<>[]}>{[]{[(<()>
// (((({<>}<{<{<>}{[]{[]{}
// [[<[([]))<([[{}[[()]]]
// [{[{({}]{}}([{[{{{}}([]
// {<[[]]>}<{[{[{[]{()[[[]
// [<(<(<(<{}))><([]([]()
// <{([([[(<>()){}]>(<<{{
// <{([{{}}[<[[[<>{}]]]>[]]`.split('\n').map(l => l.split(''))

let match = {
    '{': '}',
    '<': '>',
    '(': ')',
    '[': ']',
}

let score = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

let score2 = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

let closingSequence = [];

function validateLine(line) {
    let stack = [];
    for (let i = 0; i < line.length; i++) {
        if (Object.keys(match).includes(line[i]) ) {
            stack.push(line[i])
        } else {
            if (line[i] != match[stack.pop()]) {
                return score[line[i]]
            }
        }
    }
    closingSequence.push(stack.map(c => match[c]).reverse())
    return 0
}

console.log(
    data.map(validateLine).reduce((p, c) => p + c, 0)
)

let scores2 = closingSequence.map(s => s.map(c => score2[c]).reduce((p, c) => p * 5 + c, 0))
scores2.sort((a, b) => a - b)
console.log(scores2[Math.floor(scores2.length / 2)])
