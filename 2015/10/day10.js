const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function lookAndSay(input, iterations) {
    let sequence = input.split("").map(Number);

    for (let iter = 0; iter < iterations; iter++) {
        const nextSequence = [];
        let count = 1;

        for (let i = 1; i < sequence.length; i++) {
            if (sequence[i] === sequence[i - 1]) {
                count++;
            } else {
                nextSequence.push(count, sequence[i - 1]);
                count = 1;
            }
        }

        nextSequence.push(count, sequence[sequence.length - 1]);
        sequence = nextSequence;
    }

    return sequence.length;
}

console.log(lookAndSay(input, 40));
console.log(lookAndSay(input, 50));
