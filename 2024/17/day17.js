const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const operand = {
    0: (cpu) => 0,
    1: (cpu) => 1,
    2: (cpu) => 2,
    3: (cpu) => 3,
    4: (cpu) => cpu.A,
    5: (cpu) => cpu.B,
    6: (cpu) => cpu.C,
    7: (cpu) => { throw ("Invalid operand 7") }
}

const opcodes = {
    0: (cpu, op) => { cpu.A = Math.floor(cpu.A / Math.pow(2, operand[op](cpu))); cpu.cp += 2 },
    1: (cpu, op) => { cpu.B = cpu.B ^ op; cpu.cp += 2 },
    2: (cpu, op) => { cpu.B = operand[op](cpu) % 8; cpu.cp += 2 },
    3: (cpu, op) => { if (cpu.A != 0) cpu.cp = op; else cpu.cp += 2 },
    4: (cpu, op) => { cpu.B = Number(BigInt(cpu.B) ^ BigInt(cpu.C)); cpu.cp += 2 },
    5: (cpu, op) => { cpu.out.push(operand[op](cpu) % 8); cpu.cp += 2 },
    6: (cpu, op) => { cpu.B = Math.floor(cpu.A / Math.pow(2, operand[op](cpu))); cpu.cp += 2 },
    7: (cpu, op) => { cpu.C = Math.floor(cpu.A / Math.pow(2, operand[op](cpu))); cpu.cp += 2 },
}

// 2,4  - bst: Set B to A % 8 (combo operand 4 means get value from register A)
// 1,1  - bxl: XOR B with 1 
// 7,5  - cdv: Set C to floor(A / 2^B) (combo operand 5 means get power from register B)
// 0,3  - adv: Set A to floor(A / 2^3) (divides A by 8)
// 1,4  - bxl: XOR B with 4
// 4,4  - bxc: XOR B with C (operand ignored)
// 5,5  - out: Output B % 8 (combo operand 5 means get value from register B)
// 3,0  - jnz: If A ≠ 0, jump to position 0

function runJsCode(initialA) {
    let out = []

    let a = initialA
    do {
        let b = a % 8
        b = b ^ 1
        let c = Math.floor(a / (2 ** b))
        b = b ^ 4
        b = Number(BigInt(b) ^ BigInt(c))
        out.push(b % 8)
        a = Math.floor(a / 8)
    } while (a > 0)

    return out
}

function run(cpu, code) {
    cpu.cp = 0;
    cpu.out = [];
    do {
        opcodes[code[cpu.cp]](cpu, code[cpu.cp + 1])
    }
    while (cpu.cp < code.length)
    return cpu
}

let [cpuT, codeT] = input.split('\n\n')

let cpu = cpuT.split('\n').map(l => {
    let reg = l.substring(9).split(': ')
    return [reg[0], parseInt(reg[1])]
})

let code = codeT.substring(8).split(',').map(Number)

let computer = {
    A: cpu[0][1],
    B: cpu[1][1],
    C: cpu[2][1],
    cp: 0,
    out: []
}

let newCpu = run(computer, code)
console.log(newCpu.out.join(','))

function check(sofar, expected, allOptions = []) {

    if (sofar.length == expected.length) {
        allOptions.push(sofar)
        return
    }

    let options = []

    for (let d = 0; d < 8; d++) {
        let octal = sofar + d
        let out = runJsCode(parseInt(octal, 8))
        if (out.toReversed().every((v, i) => expected[expected.length - 1 - i] == v)) {
            options.push(octal)
        }
    }

    for (const option of options) {
        check(option, expected, allOptions)
    }
}

let expected = [2, 4, 1, 1, 7, 5, 0, 3, 1, 4, 4, 4, 5, 5, 3, 0]

let options = []
check('',expected, options)
console.log( parseInt(options.toSorted()[0],8))
