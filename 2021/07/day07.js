const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('07/input.txt')

let initialPositions = lines[0].split(",").map(x => Number.parseInt(x))
let max = initialPositions.reduce((p, c) => Math.max(p, c), 0)

function calculateBestFuelCost(positions, moveCost) {
    let bestFuelCost = Number.POSITIVE_INFINITY;
    for (let i = 0; i <= max; i++) {
        let fuelCost = positions.map(p => moveCost(Math.abs(p - i))).reduce((p, c) => p + c, 0);
        if (fuelCost < bestFuelCost) bestFuelCost = fuelCost
    }
    return bestFuelCost;
}

console.log(calculateBestFuelCost(initialPositions, x => x))
console.log(calculateBestFuelCost(initialPositions, x => (x * (x + 1) / 2)))
