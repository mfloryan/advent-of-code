
const { loadLines } = require('../input')
const assert = require('assert/strict')
const { isArray } = require('lodash')
const exp = require('constants')
let lines = loadLines('18/input.txt')

function smartSplit(line) {
    let code = eval(line);

    let result = ['[']
    function parse(code) {
        if (isArray(code[0])) {
            result.push('[')
            parse(code[0])
            result.push(']')
        } else {
            result.push(Number.parseInt(code[0]))
        }
        result.push(',')
        if (isArray(code[1])) {
            result.push('[')
            parse(code[1])
            result.push(']')
        } else {
            result.push(Number.parseInt(code[1]))
        }
    }
    parse(code)
    result.push(']')
    return result
}

function canExplode(number) {
    let parts = smartSplit(number)
    let level = 0;
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] == '[') level++
        if (parts[i] == ']') level--
        if (level == 5) return true
    }
    return false
}

function explode(line) {
    let newLine = []
    let parts = smartSplit(line)
    let level = 0;
    let exploded = 0;
    let explodedPair = [];
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        if (part == '[') level++;
        if (part == ']') level--;

        if (level == 5 && !exploded) {
            exploded = i;
            explodedPair = [parts[i+1],parts[i+3]]
            i+= 4;
            part = 0
            level--;
        }
        newLine.push(part)
    }

    if (exploded) {
        for (let i = exploded-1; i > 0; i--) {
            if (typeof newLine[i] === 'number') {
                newLine[i] = newLine[i] + explodedPair[0];
                break;
            }
        }
        for (let i = exploded+1; i < newLine.length; i++) {
            if (typeof newLine[i] === 'number') {
                newLine[i] = newLine[i] + explodedPair[1];
                break;
            }
        }
    }

    return [exploded != 0,  newLine.join('')]
}

function canSplit(number) {
    let parts = smartSplit(number)
    return parts.some(p => (typeof p === 'number' && p > 9))
}

function split(line) {
    let newLine = []
    let hasSplit = false;
    let parts = smartSplit(line)
    for (let i = 0; i < parts.length; i++) {
        if (typeof parts[i] === 'number') {
            if (parts[i] > 9 && !hasSplit) {
                newLine.push('[')
                newLine.push(Math.floor(parts[i]/2))
                newLine.push(',')
                newLine.push(Math.ceil(parts[i]/2))
                newLine.push(']')
                hasSplit = true
            } else {
                newLine.push(parts[i])
            }
        } else {
            newLine.push(parts[i])
        }
    }
    return [hasSplit, newLine.join('') ]
}

function add(n1, n2) {
    return '['+n1+ ',' + n2 + ']'
}

function reduce(n) {
    let r = [false, n]
    do {
        if (canExplode(r[1])) {
            r = explode(r[1])
        }
        else 
        if (canSplit(r[1])) {
            r = split(r[1])
        } else {
            r[0] = false
        }
    } while (r[0])
    return r[1]
}

function addAndReduce(n1, n2) {
    let n = add(n1, n2);
    return reduce(n)
}

function calculateMagnitude(n) {
    if (!isArray(n)) return n;
    return 3 * calculateMagnitude(n[0]) + 2 * calculateMagnitude(n[1])
}

assert.equal(explode('[[[[[9,8],1],2],3],4]')[1], '[[[[0,9],2],3],4]')
assert.equal(explode('[7,[6,[5,[4,[3,2]]]]]')[1], '[7,[6,[5,[7,0]]]]')
assert.equal(explode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]')[1], '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')

assert.equal(explode('[[6,[5,[4,[3,2]]]],1]')[1], '[[6,[5,[7,0]]],3]')
assert.equal(explode('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')[1], '[[3,[2,[8,0]]],[9,[5,[7,0]]]]')

assert.equal( split('[[[[0,7],4],[15,[0,13]]],[1,1]]')[1], '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]')
assert.equal( split('[[[[0,7],4],[[7,8],[0,13]]],[1,1]]')[1], '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')
assert.equal( split('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')[1], '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')

assert.equal( add('[1,2]', '[[3,4],5]'), '[[1,2],[[3,4],5]]')

assert.equal(addAndReduce('[[[[4,3],4],4],[7,[[8,4],9]]]','[1,1]'), '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')

let list = `[1,1]
[2,2]
[3,3]
[4,4]`.split('\n')
assert.equal( list.reduce((p,c) => { if (p) { return addAndReduce(p,c)} else return c }), '[[[[1,1],[2,2]],[3,3]],[4,4]]')

list = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`.split('\n')

assert.equal( list.reduce((p,c) => { if (p) { return addAndReduce(p,c)} else return c }), '[[[[3,0],[5,3]],[4,4]],[5,5]]')

list = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`.split('\n')

assert.equal( list.reduce((p,c) => { if (p) { return addAndReduce(p,c)} else return c }), '[[[[5,0],[7,4]],[5,5]],[6,6]]')

list = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`.split('\n')

assert.equal(list.reduce((p,c) => { if (p) { return addAndReduce(p,c)} else return c }), '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')

list = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`.split('\n')

assert.equal(list.reduce((p,c) => { if (p) { return addAndReduce(p,c)} else return c }), '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]')
assert.equal(calculateMagnitude([[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]),4140)

assert.equal(calculateMagnitude([[1,2],[[3,4],5]]), 143)
assert.equal(calculateMagnitude([[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]), 3488)

console.log(calculateMagnitude(
    eval(lines.reduce((p,c) => { if (p) { return addAndReduce(p,c)} else return c }))
))
