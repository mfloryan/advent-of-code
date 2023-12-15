const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function hash(string) {
    let value = 0;
    for (const char of string) {
        value += char.charCodeAt(0)
        value *= 17
        value %= 256
    }
    return value
}

function getInstruction(step) {
    if (step.includes("=")) {
        [a, b] = step.split('=')
        return { op: '=', label: a, focal: parseInt(b) }
    } else {
        return { op: '-', label: step.substring(0, step.length - 1) }
    }
}

function processInstructions(boxes, instructions) {
    for (const i of instructions) {
        let box = boxes[hash(i.label)]
        if (i.op == "=") {
            let lens = box.find(l => l.label == i.label)
            if (lens) {
                lens.focal = i.focal
            } else {
                box.push({ label: i.label, focal: i.focal })
            }
        }
        if (i.op == "-") {
            let lens = box.find(l => l.label == i.label)
            if (lens) {
                let index = box.indexOf(lens)
                box.splice(index, 1)
            }
        }
    }
    return boxes
}

function getFocusingPower(boxes) {
    let focusingPower = 0
    for (let i = 0; i < boxes.length; i++) {
        for (let l = 0; l < boxes[i].length; l++) {
            focusingPower += ((i + 1) * (l + 1) * boxes[i][l].focal)
        }
    }
    return focusingPower
}


let steps = input.split(',')
console.log(steps.map(hash).reduce((p, c) => p + c))

let boxes = new Array(256)
for (i = 0; i < boxes.length; i++) boxes[i] = []

let instructions = steps.map(getInstruction)

boxes = processInstructions(boxes, instructions)
console.log(getFocusingPower(boxes))
