const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('09/input.txt')

// lines = `2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678`.split('\n')

let heatmap = lines.map(l => l.split('').map(x => Number.parseInt(x)))

let totalRisk = 0;

function getAdjecentPoints(heatmap, location) {
    let adjecent = []
    if (location.y > 0) adjecent.push({ x: location.x, y: location.y - 1, h: heatmap[location.y - 1][location.x] })
    if (location.y < heatmap.length - 1) adjecent.push({ x: location.x, y: location.y + 1, h: heatmap[location.y + 1][location.x] })
    if (location.x > 0) adjecent.push({ x: location.x - 1, y: location.y, h: heatmap[location.y][location.x - 1] })
    if (location.x < heatmap[0].length - 1) adjecent.push({ x: location.x + 1, y: location.y, h: heatmap[location.y][location.x + 1] })
    return adjecent
}

function findBasins(heatmap) {
    let basinStart = []
    for (y = 0; y < heatmap.length; y++) {
        for (x = 0; x < heatmap[0].length; x++) {
            let adjecent = getAdjecentPoints(heatmap, { x, y });
            if (adjecent.every(p => p.h > heatmap[y][x])) {
                basinStart.push({ x, y, h: heatmap[y][x] })
            }
        }
    }
    return basinStart
}

function collectBasin(heatmap, basin, start) {
    if (basin.some(p => p.x == start.x && p.y == start.y)) return basin
    basin.push(start);
    let aroundMe = getAdjecentPoints(heatmap, start);
    aroundMe = aroundMe.filter(p => p.h < 9)
    aroundMe.forEach(p => collectBasin(heatmap, basin, p))
    return basin
}

let basinStart = findBasins(heatmap)
console.log("part 1:", basinStart.map(bs => bs.h + 1).reduce((p,c)=> p+c, 0))

let allBasins = basinStart.map(bs => collectBasin(heatmap, [], bs))
let sizes = allBasins.map(b => b.length).sort((a, b) => b - a)
console.log("part 2:", sizes[0] * sizes[1] * sizes[2])
