const assert = require('assert');
console.log('Day 07');

const Cpu = require('../Intcode');

function testPhaseSettings (code, phaseSettings) {
  const cpuA = new Cpu(code);
  cpuA.addInput(phaseSettings[0]);
  cpuA.addInput(0);
  cpuA.run();

  const cpuB = new Cpu(code);
  cpuB.addInput(phaseSettings[1]);
  cpuB.addInput(cpuA.getOutput()[0]);
  cpuB.run();

  const cpuC = new Cpu(code);
  cpuC.addInput(phaseSettings[2]);
  cpuC.addInput(cpuB.getOutput()[0]);
  cpuC.run();

  const cpuD = new Cpu(code);
  cpuD.addInput(phaseSettings[3]);
  cpuD.addInput(cpuC.getOutput()[0]);
  cpuD.run();

  const cpuE = new Cpu(code);
  cpuE.addInput(phaseSettings[4]);
  cpuE.addInput(cpuD.getOutput()[0]);
  cpuE.run();

  return cpuE.getOutput()[0];
}

const sampleCode01 = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];
assert.strictEqual(testPhaseSettings(sampleCode01, [4, 3, 2, 1, 0]), 43210);

const sampleCode02 = [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0];
assert.strictEqual(testPhaseSettings(sampleCode02, [0, 1, 2, 3, 4]), 54321);

const sampleCode03 = [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0];
assert.strictEqual(testPhaseSettings(sampleCode03, [1, 0, 4, 3, 2]), 65210);

const inputCode = [3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 38, 63, 80, 105, 118, 199, 280, 361, 442, 99999, 3, 9, 102, 5, 9, 9, 1001, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 99, 3, 9, 1001, 9, 4, 9, 102, 4, 9, 9, 101, 4, 9, 9, 102, 2, 9, 9, 101, 2, 9, 9, 4, 9, 99, 3, 9, 1001, 9, 5, 9, 102, 4, 9, 9, 1001, 9, 4, 9, 4, 9, 99, 3, 9, 101, 3, 9, 9, 1002, 9, 5, 9, 101, 3, 9, 9, 102, 5, 9, 9, 101, 3, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 1001, 9, 4, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 99, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 99, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 99];

function generatePermutations (length) {
  const sequence = [...Array(length).keys()];
  const permutations = [];
  p([], sequence, permutations);
  return permutations;
}

function p (prefix, array, permutations) {
  if (array.length == 1) permutations.push(prefix.concat(array));
  for (let i = 0; i < array.length; i++) {
    const head = array[i];
    let tail = array.slice(0, i);
    tail = tail.concat(array.slice(i + 1, array.length));
    p(prefix.concat([head]), tail, permutations);
  }
}

const ps = generatePermutations(5);

let max = 0;
ps.forEach(p => {
  max = Math.max(max, testPhaseSettings(inputCode, p));
});

console.log(max);
assert.strictEqual(max, 118936);

function testPhaseSettingsWithFeedback (code, phaseSettings) {
  const cpus = [new Cpu(code), new Cpu(code), new Cpu(code), new Cpu(code), new Cpu(code)];

  cpus[0].addInput(phaseSettings[0]);
  cpus[1].addInput(phaseSettings[1]);
  cpus[2].addInput(phaseSettings[2]);
  cpus[3].addInput(phaseSettings[3]);
  cpus[4].addInput(phaseSettings[4]);

  cpus[0].addInput(0);

  let run = false;

  let result = 0;
  do {
    run = false;

    const r1 = cpus[0].run();

    cpus[1].addInput(cpus[0].getOutput().shift());
    const r2 = cpus[1].run();

    cpus[2].addInput(cpus[1].getOutput().shift());
    const r3 = cpus[2].run();

    cpus[3].addInput(cpus[2].getOutput().shift());
    const r4 = cpus[3].run();

    cpus[4].addInput(cpus[3].getOutput().shift());
    const r5 = cpus[4].run();
    result = cpus[4].getOutput()[0];

    cpus[0].addInput(cpus[4].getOutput().shift());
    run = !r1 || !r2 || !r3 || !r4 || !r5;
  } while (run);

  return result;
}

const sampleCodeB01 = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];
assert.strictEqual(testPhaseSettingsWithFeedback(sampleCodeB01, [9, 8, 7, 6, 5]), 139629729);

const sampleCodeB02 = [
  3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
  -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
  53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10];
assert.strictEqual(testPhaseSettingsWithFeedback(sampleCodeB02, [9, 7, 8, 5, 6]), 18216);

let ps2 = generatePermutations(5);

ps2 = ps2.map(p => p.map(n => n + 5));

ps2.forEach(p => {
  max = Math.max(max, testPhaseSettingsWithFeedback(inputCode, p));
});

console.log(max);
