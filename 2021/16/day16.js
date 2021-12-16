const { loadLines } = require('../input')
const assert = require('assert/strict')
let lines = loadLines('16/input.txt')

function hexToBinary(hexString) {
    let numers = hexString.split('')
    return numers.flatMap(n => Number.parseInt(n, 16).toString(2).padStart(4, 0)).join('').split('')
}

function parseMessage(message) {
    let bits = hexToBinary(message)
    let topP = parsePacket(bits, 0, true)
    return topP
}

function parsePacket(bits, level = 0) {
    let ver = Number.parseInt(bits.splice(0, 3).join(''), 2)
    let type = Number.parseInt(bits.splice(0, 3).join(''), 2)
    // console.log("parsing packet ", level, 'v', ver, 't:' , type)
    if (type == 4) {
        let r = parseLiteralValue(bits)
        return { ver, type, value: r.v, i: 6 + r.i }
    } else {
        let r = parseOperator(bits, level)
        return { ver, type, value: r, i: 6 + r.i }
    }
}

function parseLiteralValue(bits) {
    let startLen = bits.length;
    let isGroup = false
    let groups = []
    do {
        isGroup = bits.shift() == '1'
        let v = bits.splice(0, 4).join('')
        groups.push(v)
    } while (isGroup)
    return { v: Number.parseInt(groups.join(''), 2), i: startLen - bits.length }
}

function parseOperator(bits, level) {
    let startLen = bits.length
    // console.log(''.padEnd(level * 4,'-'), "op", level)
    let length_type_id = bits.shift();
    if (length_type_id == '0') {
        let bits_length = Number.parseInt(bits.splice(0, 15).join(''), 2)
        // console.log(''.padEnd(level * 4,'-'), level, 'reading bits', bits_length, 'left', bits.length)
        let ps = { p: [] }
        while (bits_length > 0) {
            let p = parsePacket(bits, level + 1, false)
            ps.p.push(p)
            // console.log(''.padEnd(level * 4,'-'), "p: ", p)
            ps.i += p.i
            bits_length -= p.i
            // console.log(''.padEnd(level * 4,'-'), level, "left bits:", bits_length, bits.length)
        }
        ps.i = startLen - bits.length
        return ps
    } else {
        let number_of_sub_packets = Number.parseInt(bits.splice(0, 11).join(''), 2)
        // console.log(''.padEnd(level * 4,'-'), level, 'reading packets', number_of_sub_packets)
        let ps = { p: [], i: 0 }
        do {
            let p = parsePacket(bits, level + 1, false)
            ps.p.push(p)
            // console.log(''.padEnd(level * 4,'-'), 'consumed: ', p.i)
            number_of_sub_packets--;
        } while (number_of_sub_packets > 0)
        ps.i = startLen - bits.length
        return ps
    }
}

let operators = {
    0: (values) => values.reduce((p, c) => p + c, 0),
    1: (values) => values.reduce((p, c) => p * c, 1),
    2: (values) => values.reduce((p, c) => { if (!p) return c; else return c < p ? c : p; }),
    3: (values) => values.reduce((p, c) => { if (!p) return c; else return c > p ? c : p; }),
    5: (values) => (values[0] > values[1] ? 1 : 0),
    6: (values) => (values[0] < values[1] ? 1 : 0),
    7: (values) => (values[0] == values[1] ? 1 : 0),
}

function evaluateAllExpressions(parsedMessage) {
    return evaluateExpressions(parsedMessage.type, parsedMessage.value)
}

function evaluateExpressions(operator, value) {
    if (operator == '4') return value;
    let values = value.p.map(v => evaluateExpressions(v.type, v.value));
    return operators[operator](values)
}

function sumOfVersions(packet) {
    let sum = 0;
    if (packet.type != 4) sum += packet.value.p.map(p => sumOfVersions(p)).reduce((p, c) => p + c, 0)
    sum += packet.ver
    return sum
}

let p = parseMessage('D2FE28')
assert.strictEqual(p.value, 2021)
assert.strictEqual(sumOfVersions(p), 6)

p = parseMessage('38006F45291200')
assert.strictEqual(p.value.p[0].value, 10)
assert.strictEqual(p.value.p[1].value, 20)

p = parseMessage('EE00D40C823060')
assert.strictEqual(p.value.p[0].value, 1)
assert.strictEqual(p.value.p[1].value, 2)
assert.strictEqual(p.value.p[2].value, 3)

p = parseMessage('8A004A801A8002F478')
assert.strictEqual(sumOfVersions(p), 16)

p = parseMessage('620080001611562C8802118E34')
assert.strictEqual(sumOfVersions(p), 12)

p = parseMessage('A0016C880162017C3686B18A3D4780')
assert.strictEqual(sumOfVersions(p), 31)

p = parseMessage('C0015000016115A2E0802F182340')
assert.strictEqual(sumOfVersions(p), 23)

p = parseMessage(lines[0])
console.log(sumOfVersions(p))

assert.strictEqual(evaluateAllExpressions(parseMessage('C200B40A82')), 3)
assert.strictEqual(evaluateAllExpressions(parseMessage('04005AC33890')), 54)
assert.strictEqual(evaluateAllExpressions(parseMessage('880086C3E88112')), 7)
assert.strictEqual(evaluateAllExpressions(parseMessage('CE00C43D881120')), 9)
assert.strictEqual(evaluateAllExpressions(parseMessage('D8005AC2A8F0')), 1)
assert.strictEqual(evaluateAllExpressions(parseMessage('F600BC2D8F')), 0)
assert.strictEqual(evaluateAllExpressions(parseMessage('9C005AC2F8F0')), 0)
assert.strictEqual(evaluateAllExpressions(parseMessage('9C0141080250320F1802104A08')), 1)

console.log(evaluateAllExpressions(p))
