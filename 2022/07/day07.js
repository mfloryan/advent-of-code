const { loadLines } = require('../input')

let lines = loadLines('07/input.txt')

function parseInput(lines) {
    let tree_location = ""
    let tree = {name: "/", dirs:[], files: []}
    lines.forEach(line => {
        let c = line.split(' ')
        if (c[0] == "$") {
            if (c[1] == "cd") {
                let dir = c[2]
                if (dir == "..") {
                    // relative dir
                    tree_location = tree_location.substring(0,tree_location.lastIndexOf("/"))
                    if (tree_location == "") tree_location = "/"
                } else {
                    // absolute dir
                    if (dir == "/") {
                        tree_location = "/"
                    } else {
                        if (!tree_location.endsWith("/")) {
                            tree_location += "/"
                        }
                        tree_location += dir
                    }
                }
                // console.log(tree_location)
            } else if (c[1] == "ls") {

            }
        } else {
            let currentTreeDir = tree
            let path = tree_location.split('/').filter(a => a != '')
            path.forEach(n => {
                let dir = currentTreeDir.dirs.find(d => d.name == n)
                if (dir) {
                    currentTreeDir = dir
                } else {
                    currentTreeDir.dirs.push({name: n, dirs:[], files: []})
                }
            })
            let file = line.split(' ')
            if (file[0] == "dir") {
                currentTreeDir.dirs.push({name: file[1], dirs:[], files: []})
            } else {
                currentTreeDir.files.push({name: file[1], size: parseInt(file[0])})
            }
        }
    });
    return tree
}

let tree = parseInput(lines)
// console.log(tree)

function addDirSize(dir, size = 0) {
    let totalSize = 0;
    dir.dirs.forEach(d => {
        totalSize += addDirSize(d,0)
    })
    totalSize += dir.files.reduce((p,c) => p + c.size,0)
    dir.totalSize = totalSize
    return totalSize
}

// console.log("/".split("/"))
// console.log(tree)
addDirSize(tree)
// console.log(tree)

function getTotalSizeWithThreshold(dir, threshold, total = {size:0}) {
    dir.dirs.forEach(d => {
        getTotalSizeWithThreshold(d, threshold, total)
    })
    if (dir.totalSize < threshold) total.size += dir.totalSize
    return total
}

let total = getTotalSizeWithThreshold(tree, 100000)
console.log(total.size)

let freeSpace = 70000000 - tree.totalSize
let missingSpace = 30000000 - freeSpace

function getEachDirSize(dir, collection = []) {
    collection.push({d: dir.name, size: dir.totalSize})
    dir.dirs.forEach(d => {
        getEachDirSize(d, collection)
    })
    return collection
}

let dirs = getEachDirSize(tree).filter(d => d.size >= missingSpace)
dirs.sort((a,b) => a.size - b.size)
console.log(dirs[0].size)
