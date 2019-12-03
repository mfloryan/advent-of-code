const assert = require('assert');
const fs = require('fs');

console.log('Day 03');

const input = fs.readFileSync('input.txt', { encoding: 'utf8' }).split('\n');

function mDistance (p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

let w1 = 'R8,U5,L5,D3';
let w2 = 'U7,R6,D4,L4';

function parseWire (wire) {
  const parsedWire = wire.split(',');
  return parsedWire.map(w => {
    return { d: w[0], l: parseInt(w.substring(1)) };
  });
}

function toCoordinates (parsedWire) {
  const start = { x: 0, y: 0 };
  const coordinates = [{ ...start }];

  parsedWire.forEach(s => {
    if (s.d == 'R') {
      for (let i = 0; i < s.l; i++) {
        start.x++;
        coordinates.push({ ...start });
      }
    } else if (s.d == 'L') {
      for (let i = 0; i < s.l; i++) {
        start.x--;
        coordinates.push({ ...start });
      }
    } else if (s.d == 'D') {
      for (let i = 0; i < s.l; i++) {
        start.y--;
        coordinates.push({ ...start });
      }
    } else if (s.d == 'U') {
      for (let i = 0; i < s.l; i++) {
        start.y++;
        coordinates.push({ ...start });
      }
    }
  });

  return coordinates;
}

function intersections (w1, w2) {
  const i = w1.filter(p => w2.some(p2 => p.x == p2.x && p.y == p2.y));
  return i;
}

// w1 = 'R75,D30,R83,U83,L12,D49,R71,U7,L72';
// w2 = 'U62,R66,U55,R34,D71,R55,D58,R83';
w1 = input[0];
w2 = input[1];
const w1c = toCoordinates(parseWire(w1));
const w2c = toCoordinates(parseWire(w2));

const i = intersections(w1c, w2c).filter(p => p.x !== 0 && p.y !== 0);

let ds = i.map(i => mDistance({ x: 0, y: 0 }, i));
ds = ds.filter(p => p !== 0);
ds.sort((a, b) => a - b);

console.log(ds);

const d = i.map(i => {
  const w1d = w1c.findIndex(p => p.x === i.x && p.y === i.y);
  const w2d = w2c.findIndex(p => p.x === i.x && p.y === i.y);
  console.log(`${w1d}, ${w2d} => ${w1d + w2d}`);
  return w1d + w2d;
});

d.sort((a, b) => a - b);
console.log(d);
