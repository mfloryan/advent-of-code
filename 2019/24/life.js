const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

function parseInput (input) {
  return input
    .split('\n')
    .map(r => r.split(''));
}

function lifeOrDeath (cell, bugsAround) {
  if (cell === '#') {
    if (bugsAround === 1) {
      return '#';
    } else {
      return '.';
    }
  } else {
    if (bugsAround === 1 || bugsAround === 2) {
      return '#';
    } else {
      return '.';
    }
  }
}

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
      newRow.push(lifeOrDeath(current, n));
    }
    nextGen.push(newRow);
  }
  return nextGen;
}

function partOne (input) {
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
  return ecosystem.map(r => r.join('')).join('').split('').map((c, i) => c === '#' ? Math.pow(2, i) : 0).reduce((p, c) => p + c);
}

console.log(partOne(input));

const adjR = {
  0: [[-1, 7], [-1, 11], [0, 1], [0, 5]],
  1: [[-1, 7], [0, 0], [0, 2], [0, 6]],
  2: [[-1, 7], [0, 1], [0, 3], [0, 7]],
  3: [[-1, 7], [0, 2], [0, 4], [0, 8]],
  4: [[-1, 7], [0, 3], [-1, 13], [0, 9]],
  5: [[0, 0], [-1, 11], [0, 6], [0, 10]],
  6: [[0, 1], [0, 5], [0, 7], [0, 11]],
  7: [[0, 2], [0, 6], [0, 8], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
  8: [[0, 3], [0, 7], [0, 9], [0, 13]],
  9: [[0, 4], [0, 8], [-1, 13], [0, 14]],
  10: [[0, 5], [-1, 11], [0, 11], [0, 15]],
  11: [[0, 6], [0, 10], [1, 0], [1, 5], [1, 10], [1, 15], [1, 20], [0, 16]],
  12: [],
  13: [[0, 8], [1, 4], [1, 9], [1, 14], [1, 19], [1, 24], [0, 14], [0, 18]],
  14: [[0, 9], [0, 13], [-1, 13], [0, 19]],
  15: [[0, 10], [-1, 11], [0, 16], [0, 20]],
  16: [[0, 11], [0, 15], [0, 17], [0, 21]],
  17: [[1, 20], [1, 21], [1, 22], [1, 23], [1, 24], [0, 16], [0, 18], [0, 22]],
  18: [[0, 13], [0, 17], [0, 19], [0, 23]],
  19: [[0, 14], [0, 18], [-1, 13], [0, 24]],
  20: [[0, 15], [-1, 11], [0, 21], [-1, 17]],
  21: [[0, 16], [0, 20], [0, 22], [-1, 17]],
  22: [[0, 17], [0, 21], [0, 23], [-1, 17]],
  23: [[0, 18], [0, 22], [0, 24], [-1, 17]],
  24: [[0, 19], [0, 23], [-1, 13], [-1, 17]]
};

function flatNextGen (infiniteGrid, level) {
  const currentLevel = infiniteGrid[level];
  return currentLevel.map((c, i) => {
    const n = adjR[i].map(tuple => {
      if (!infiniteGrid[level + tuple[0]]) return '.';
      return infiniteGrid[level + tuple[0]][tuple[1]];
    }).filter(x => x === '#').length;
    return lifeOrDeath(c, n);
  });
}

function showFlat (flatGrid) {
  for (let i = 0; i < 5; i++) {
    console.log(flatGrid.slice(i * 5, (i * 5) + 5).join(''));
  }
}

let infiniteGrid = {};
const level0 = parseInput(input).map(r => r.join('')).join('').split('');
infiniteGrid[0] = level0;

for (let i = 0; i < 200; i++) {
  const newInfiniteGrid = {};
  const levels = Object.keys(infiniteGrid).map(k => parseInt(k));
  const min = levels.reduce((p, c) => Math.min(p, c));
  const max = levels.reduce((p, c) => Math.max(p, c));
  infiniteGrid[min - 1] = Array(25).fill('.');
  infiniteGrid[max + 1] = Array(25).fill('.');
  Object.keys(infiniteGrid).forEach(k => {
    const l = parseInt(k);
    const nextGen = flatNextGen(infiniteGrid, l);
    newInfiniteGrid[l] = nextGen;
  });

  infiniteGrid = newInfiniteGrid;
}

const r = Object.values(infiniteGrid).map(v => v.join(''));
console.log(r.join('').split('').filter(x => x === '#').length);
