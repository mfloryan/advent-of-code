const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('08/input.txt')
var _ = require('lodash');

let correctDigits = [
    {d:0, c: 'abcefg'},
    {d:1, c: 'cf'},
    {d:2, c: 'acdeg'},
    {d:3, c: 'acdfg'},
    {d:4, c: 'bcdf'},
    {d:5, c: 'abcfg'},
    {d:6, c: 'abdefg'},
    {d:7, c: 'acf'},
    {d:8, c: 'abcdefg'},
    {d:9, c: 'abcdfg'},
]

function parseLine(line) {
    let [pattern, numbers] = line.split(' | ')
    return {p: pattern.split(' '), n: numbers.split(' ')}
}

// lines = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.split('\n')

let data = lines.map(parseLine)

function countDigits(data) {
    let total = 0
    for (let i=0; i < data.length; i++) {
        data[i].n.forEach( digit => {
            if (digit.length == 2 || digit.length == 4 || digit.length == 3 || digit.length == 7) { total++; }
        })
    }
    return total
}

console.log(countDigits(data))

function decodeDigits(line) {

    let digitOptions2 = {}
    line.p.forEach( p => {
        let possibleDigit = correctDigits.filter(d => d.c.length == p.length)
        possibleDigit.forEach( d => {if (!digitOptions2[d.d]) digitOptions2[d.d] = []; digitOptions2[d.d].push(p)})
    })

    digitOptions2[3] = digitOptions2[3].filter(o => _.intersection(digitOptions2[1][0].split(''), o.split('')).length == 2)
    digitOptions2[9] = digitOptions2[9].filter(o => _.intersection(digitOptions2[4][0].split(''), o.split('')).length == 4)
    digitOptions2[0] = digitOptions2[0].filter(o => o != digitOptions2[9][0])
    digitOptions2[6] = digitOptions2[6].filter(o => o != digitOptions2[9][0])
    digitOptions2[2] = digitOptions2[2].filter(o => o != digitOptions2[3][0])
    digitOptions2[5] = digitOptions2[5].filter(o => o != digitOptions2[3][0])
    digitOptions2[6] = digitOptions2[6].filter(o => _.intersection(digitOptions2[1][0].split(''), o.split('')).length != 2)
    digitOptions2[0] = digitOptions2[0].filter(o => o != digitOptions2[6][0])

    let six = digitOptions2[6][0].split('')
    digitOptions2[5] = digitOptions2[5].filter(o => _.intersection(six, o.split('')).length == 5)
    digitOptions2[2] = digitOptions2[2].filter(o => o != digitOptions2[5][0])

    let key = []
    for (const [k, v] of Object.entries(digitOptions2)) {
        let s = v[0].split('').sort()
        key[s.join('')] = k
    }

    let valueString = line.n.map(n => {
        let s = n.split('').sort()
        return key[s.join('')]
    }).join('')
    return Number.parseInt(valueString);
}

// console.log(decodeDigits(parseLine('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf')))

console.log( data.map(decodeDigits).reduce((p,c) => p+c,0) )