const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

class HexGrid {
    constructor() {
        // Direction vectors for pointy-top hexagons in axial coordinates
        this.directions = {
            e: { q: 1, r: 0 },    // East
            se: { q: 0, r: 1 },    // Southeast
            sw: { q: -1, r: 1 },   // Southwest
            w: { q: -1, r: 0 },   // West
            nw: { q: 0, r: -1 },   // Northwest
            ne: { q: 1, r: -1 }    // Northeast
        };

        this.cells = new Map(); // Store hex cells with their data
    }

    // Convert axial coordinates to a string key
    coordToKey(q, r) {
        return `${q},${r}`;
    }

    // Add a cell at the specified coordinates
    addCell(q, r, data = {}) {
        let cell = {
            q,
            r,
            data
        }
        this.cells.set(this.coordToKey(q, r), cell);
        return cell
    }

    // Get a cell at the specified coordinates
    getCell(q, r) {
        return this.cells.get(this.coordToKey(q, r));
    }

    getOrCreateCell(q, r, data = {}) {
        return this.cells.get(this.coordToKey(q, r)) || this.addCell(q, r, data)
    }

    // Get neighbor in specified direction
    getNeighbor(q, r, direction) {
        if (!this.directions[direction]) {
            throw new Error(`Invalid direction: ${direction}`);
        }

        const dir = this.directions[direction];
        return this.getCell(q + dir.q, r + dir.r);
    }

    getOrCreateNeighbor(q, r, direction, data = {}) {
        const dir = this.directions[direction];
        return this.getNeighbor(q, r, direction) || this.addCell(q + dir.q, r + dir.r, data)
    }

    // Get all neighbors of a cell
    getNeighbors(q, r) {
        return Object.values(this.directions)
            .map(dir => this.getCell(q + dir.q, r + dir.r))
            .filter(cell => cell !== undefined);
    }

    getNeighborsOrDefault(q, r, data = {}) {
        return Object.values(this.directions)
            .map(dir => this.getCell(q + dir.q, r + dir.r) || { q: q + dir.q, r: r + dir.r, data: data })
        // .filter(cell => cell !== undefined);
    }

    getOrCreateNeighbors(q, r, data = {}) {
        return Object.values(this.directions)
            .map(dir => this.getOrCreateCell(q + dir.q, r + dir.r, data))

    }


    // Calculate distance between two hexes
    distance(q1, r1, q2, r2) {
        // In axial coordinates, we need to convert to cube coordinates first
        const s1 = -q1 - r1;
        const s2 = -q2 - r2;
        return Math.max(
            Math.abs(q1 - q2),
            Math.abs(r1 - r2),
            Math.abs(s1 - s2)
        );
    }

    // Get all cells within a certain distance of a center point
    getCellsInRange(centerQ, centerR, range) {
        const results = [];
        for (let q = -range; q <= range; q++) {
            for (let r = Math.max(-range, -q - range);
                r <= Math.min(range, -q + range); r++) {
                const cell = this.getCell(centerQ + q, centerR + r);
                if (cell) {
                    results.push(cell);
                }
            }
        }
        return results;
    }

    getCellsInRangeOrDefault(centerQ, centerR, range, data = {}) {
        const results = [];
        for (let q = -range; q <= range; q++) {
            for (let r = Math.max(-range, -q - range);
                r <= Math.min(range, -q + range); r++) {
                const cell = this.getCell(centerQ + q, centerR + r) || { q: centerQ + q, r: centerR + r, data: data };
                if (cell) {
                    results.push(cell);
                }
            }
        }
        return results;
    }

    getMaxDistance() {
        return [...this.cells.values()].map(c => Math.max(Math.abs(c.q),Math.abs(c.r))).reduce((p,c) => Math.max(p,c))
    }
}

function parseLine(line, directions) {
    let instructions = []
    let consumedLine = line
    let dirKeys = Object.keys(directions)
    while (consumedLine.length > 0) {
        let i = dirKeys.find(d => consumedLine.startsWith(d))
        if (!i) throw `Unable to match direction for ${consumedLine}`
        instructions.push(i)
        consumedLine = consumedLine.slice(i.length)
    }
    return instructions
}

// input = `sesenwnenenewseeswwswswwnenewsewsw
// neeenesenwnwwswnenewnwwsewnenwseswesw
// seswneswswsenwwnwse
// nwnwneseeswswnenewneswwnewseswneseene
// swweswneswnenwsewnwneneseenw
// eesenwseswswnenwswnwnwsewwnwsene
// sewnenenenesenwsewnenwwwse
// wenwwweseeeweswwwnwwe
// wsweesenenewnwwnwsenewsenwwsesesenwne
// neeswseenwwswnwswswnw
// nenwswwsewswnenenewsenwsenwnesesenew
// enewnwewneswsewnwswenweswnenwsenwsw
// sweneswneswneneenwnewenewwneswswnese
// swwesenesewenwneswnwwneseswwne
// enesenwswwswneneswsenwnewswseenwsese
// wnwnesenesenenwwnenwsewesewsesesew
// nenewswnwewswnenesenwnesewesw
// eneswnwswnwsenenwnwnwwseeswneewsenese
// neswnwewnwnwseenwseesewsenwsweewe
// wseweeenwnesenwwwswnew`


const grid = new HexGrid()

let data = input.split('\n')
let flipList = data.map(l => parseLine(l, grid.directions))

let centre = grid.addCell(0, 0, { white: true })

for (const fl of flipList) {
    let hex = centre
    for (const dir of fl) {
        hex = grid.getOrCreateNeighbor(hex.q, hex.r, dir, { white: true })
    }
    hex.data.white = !hex.data.white
}

console.log([...grid.cells.values()].filter(v => !v.data.white).length)

function getNextGeneration(grid) {
    let newGrid = new HexGrid()
    for (const cell of grid.getCellsInRangeOrDefault(0, 0, grid.getMaxDistance()+1, { white: true })) {
        let n = grid.getNeighborsOrDefault(cell.q, cell.r, { white: true })

        let data = { white: cell.data.white }
        if (cell.data.white) {
            //Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
            if (n.filter(v => !v.data.white).length == 2) {
                data.white = false
            }
        } else {
            //Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
            let black = n.filter(v => !v.data.white).length
            if (black == 0 || black > 2) {
                data.white = true
            }
        }
        newGrid.addCell(cell.q, cell.r, data)
    }
    return newGrid
}

let g = grid
for(let i =0; i < 100; i++) {
    g = getNextGeneration(g)
}
console.log([...g.cells.values()].filter(v => !v.data.white).length)
