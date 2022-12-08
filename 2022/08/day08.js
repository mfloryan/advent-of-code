const { loadLines } = require('../input')

let lines = loadLines('08/input.txt')
// lines = `30373
// 25512
// 65332
// 33549
// 35390`.split('\n')
let treeMap = lines.map(l => l.split('').map(t => parseInt(t)))


function testUp(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    for (let x = r-1; x >= 0; x--) {
        let tree = treeMap[x][c];
        if (tree >= value) {
            return false
        }
    }
    return true
}

function testDown(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    for (let x = r+1; x <= maxR; x++) {
        let tree = treeMap[x][c];
        if (tree >= value) {
            return false
        }
    }
    return true
}

function testLeft(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    for (let x = c-1; x >= 0; x--) {
        let tree = treeMap[r][x];
        if (tree >= value) {
            return false
        }
    }
    return true
}
function testRight(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    for (let x = c + 1; x <= maxC; x++) {
        let tree = treeMap[r][x];
        if (tree >= value) {
            return false
        }
    }
    return true
}

function countVisibile(treeMap) {
    let totalVisible = 0;
    let maxR = treeMap.length-1
    let maxC = treeMap[0].length-1

    for (let r = 0; r < treeMap.length; r++) {
        let row = ""
        for (let c = 0; c < treeMap[r].length; c++) {
            if (r == 0 || c == 0 || r == maxR || c == maxC) {
                totalVisible++;
                row += `\x1b[91m${treeMap[r][c]}\x1b[0m`
            } else {
                if (testUp(treeMap,c,r,maxC,maxR)
                || testDown(treeMap,c,r,maxC,maxR)
                || testLeft(treeMap,c,r,maxC,maxR)
                || testRight(treeMap,c,r,maxC,maxR)
                ) {
                    totalVisible++;
                    row += `\x1b[91m${treeMap[r][c]}\x1b[0m`
                } else {
                    row += `\x1b[0m${treeMap[r][c]}\x1b[0m`
                }
            }
        }
        // console.log(row)
    }
    return totalVisible
}

function scenicUp(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    let distance = 0
    for (let x = r-1; x >= 0; x--) {
        distance++
        let tree = treeMap[x][c];
        if (tree >= value) {
            return distance
        }
    }
    return distance
}

function scenicDown(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    let distance = 0
    for (let x = r+1; x <= maxR; x++) {
        distance++
        let tree = treeMap[x][c];
        if (tree >= value) {
            return distance
        }
    }
    return distance
}

function scenicLeft(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    let distance = 0
    for (let x = c-1; x >= 0; x--) {
        distance++
        let tree = treeMap[r][x];
        if (tree >= value) {
            return distance
        }
    }
    return distance
}

function scenicRight(treeMap, c ,r, maxC, maxR) {
    let value = treeMap[r][c]
    let distance = 0
    for (let x = c + 1; x <= maxC; x++) {
        distance++
        let tree = treeMap[r][x];
        if (tree >= value) {
            return distance
        }
    }
    return distance
}

function countScenic(treeMap) {
    let maxR = treeMap.length-1
    let maxC = treeMap[0].length-1
    let newMap = []
    for (let r = 0; r < treeMap.length; r++) {
        let row = []
        for (let c = 0; c < treeMap[r].length; c++) {
            let du = scenicUp(treeMap,c,r,maxC,maxR)
            let dd = scenicDown(treeMap,c,r,maxC,maxR)
            let dl = scenicLeft(treeMap,c,r,maxC,maxR)
            let dr = scenicRight(treeMap,c,r,maxC,maxR)
            let distance = du * dd * dl * dr
                
            row.push(distance)
        }
        newMap.push(row)
    }
    return newMap
}

console.log(countVisibile(treeMap))
console.log(
    countScenic(treeMap).map(r => r.reduce((p,c) => Math.max(p,c), 0))
    .reduce((p,c) => Math.max(p,c), 0)
)
