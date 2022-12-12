const { loadLines } = require('../input')

let lines = loadLines('08/input.txt')

function parseLine(line) {
    [op, value] = line.split(' ')
    value = parseInt(value)
    return [op, value]
}

let code = lines.map(parseLine)

function executeCode(code) {
    let acc = 0
    let pc = 0
    let executed = new Set()
    let run = true

    while (run) {
        let currentOp = code[pc]
        if (executed.has(pc)) {
            run = false
            break
        }
        executed.add(pc)
        if (currentOp[0] == 'nop') {
            pc++
        } else if (currentOp[0] == 'jmp') {
            pc += currentOp[1]
        } else if (currentOp[0] == 'acc') {
            acc += currentOp[1]
            pc++
        } else {
            console.error("Unknow op", currentOp)
            return
        }
        if (pc > code.length - 1) {
            run = false
        }
    }

    return [acc, pc >= code.length]
}

console.log(executeCode(code)[0])

function findCorrectFix(code) {
    let potentialFixes = code.map((o,i) => [i, o[0], o[1]]).filter((v) => v[1] == 'jmp' || v[1] == 'nop')

    for (const fix of potentialFixes) {
        let oldOp = code[fix[0]][0]
        code[fix[0]][0] = fix[1] == 'jmp'?'nop':'jmp'

        let r = executeCode(code)
        if (r[1] == true) {
            return r
        }

        code[fix[0]][0] = oldOp
    }
}

console.log(findCorrectFix(code)[0])