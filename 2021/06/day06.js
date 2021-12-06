const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('06/input.txt')
// lines = [`3,4,3,1,2`]

let fish = lines[0].split(',').map(n => Number.parseInt(n))

let fishStats = fish.reduce( (p,c) => { if (p[c]) p[c]++; else p[c]=1; return p }, {})

for (let i = 0; i < 256; i++) {
    let newFishStats = {}
    let bornFish = 0
    for (const fishGroup in fishStats) {
        if (Number.parseInt(fishGroup) === 0) {
            if (newFishStats[6]) newFishStats[6] += fishStats[fishGroup]; else newFishStats[6] = fishStats[fishGroup];
            bornFish = fishStats[fishGroup];
        } else {
            if (newFishStats[Number.parseInt(fishGroup - 1)]) newFishStats[Number.parseInt(fishGroup - 1)] += fishStats[fishGroup]; 
            else newFishStats[Number.parseInt(fishGroup - 1)] = fishStats[fishGroup]; 
        }
    }
    if (bornFish > 0) newFishStats[8] = bornFish
    fishStats = newFishStats
    if (i == 79) console.log("Day 01 - part 1:", Object.values(fishStats).reduce((p,c) => p+c, 0))
}

console.log("Day 06 - part 2:", Object.values(fishStats).reduce((p,c) => p+c, 0))
