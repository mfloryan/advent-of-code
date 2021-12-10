const fs = require('fs')
const path = require('path')
let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let strings = input.split('\n')

function hasVowels(string) {
    const vowels = 'aeiou'.split('')
    return string.split('').filter(l => vowels.includes(l)).length >= 3
}

function hasTwiceLetter(string) {
    for (let i = 0; i < string.length - 1; i++) {
        if (string[i] == string[i+1]) return true
    }
    return false
}

function hasRestrictedTerms(string) {
    const restricted = ['ab', 'cd', 'pq', 'xy']
    return restricted.map(r => string.includes(r)).some(x => x)
}

function isNiceString(string) {
    return hasVowels(string) && hasTwiceLetter(string) && !hasRestrictedTerms(string)
}

function hasPairs(string) {
    for (let i = 0; i < string.length - 2; i++) {
        if (string.substring(i+2).includes([string[i], string[i+1]].join(''))) return true
    }
    return false
}

function hasMidRepeatTrio(string) {
    for (let i = 0; i < string.length - 2; i++) {
        if (string[i] == string[i+2]) return true
    }
    return false
}

function isNiceString2(string) {
    return hasPairs(string) && hasMidRepeatTrio(string)
}

console.log(strings.filter(s => isNiceString(s)).length)
console.log(strings.filter(s => isNiceString2(s)).length)

console.log(isNiceString2('qjhvhtzxzqqjkmpb'))
console.log(isNiceString2('xxyxx'))
console.log(isNiceString2('uurcxstgmygtbstg'))
console.log(isNiceString2('ieodomkazucvgmuy'))