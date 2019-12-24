const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

const adj = [[-1, 0], [0, -1], [1, 0], [0, 1]];

function nextGen (currentGen) {
  const nextGen = [];

  for (let y = 0; y < currentGen.length; y++) {
    const newRow = [];
    for (let x = 0; x < currentGen[y].length; x++) {
      const current = currentGen[y][x];
      const n = adj.map(a => {
        const ax = x + a[0];
        const ay = y + a[1];
        if (!(ax < 0 || ay < 0) && !(ax >= currentGen[y].length || ay >= currentGen.length)) {
          return currentGen[ay][ax];
        }
      }).filter(x => x === '#').length;
      if (current === '#') {
        if (n === 1) {
          newRow.push('#');
        } else {
          newRow.push('.');
        }
      } else {
        if (n === 1 || n === 2) {
          newRow.push('#');
        } else {
          newRow.push('.');
        }
      }
    }
    nextGen.push(newRow);
  }
  return nextGen;
}

function parseInput (input) {
  return input
    .split('\n')
    .map(r => r.split(''));
}

const example1 = `....#
#..#.
#..##
..#..
#....`;

const memory = [];
let ecosystem = parseInput(input);
let done = false;
do {
  memory.push(ecosystem.map(r => r.join('')).join(''));
  ecosystem = nextGen(ecosystem);
  if (memory.some(m => m === ecosystem.map(r => r.join('')).join(''))) {
    done = true;
  }
} while (!done);

const flat = ecosystem.map(r => r.join('')).join('').split('').map((c, i) => c === '#' ? Math.pow(2, i) : 0).reduce((p, c) => p + c);
console.log(flat);
