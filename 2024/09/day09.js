const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `2333133121414131402`
let disk = input.split('').map(v => parseInt(v))

function parseDisk(disk) {
    let layout = []

    let file = true
    let blockId = 0
    for (const block of disk) {
        if (file) {
            layout.push(...new Array(block).fill(blockId))
            blockId++
        } else {
            layout.push(...new Array(block).fill(-1))
        }
        file = !file
    }
    return layout   
}

function compact(disk) {
    let done = false
    do {
        let firstFreeSpace = disk.indexOf(-1)
        if (firstFreeSpace == -1) {
            done = true
        } else {
            disk[firstFreeSpace] = disk[disk.length - 1]
            disk.pop()
        }
    } while (!done)
    return disk
}

layout = parseDisk(disk)
newLayout = compact(layout)
console.log(newLayout.reduce((p,c,i) => p + c * i,0))

function parseDisk2(disk) {
    let layout = []

    let file = true
    let blockId = 0
    for (const block of disk) {
        if (file) {
            layout.push({size: block, id: blockId})
            blockId++
        } else {
            layout.push({size: block, id: -1})
        }
        file = !file
    }
    return layout   
}

function defrag2(disk) {
    let maxFileId = disk.reduce((p,c) => Math.max(p, c.id),0)
    for (let id = maxFileId; id > 0; id--) {
        fileIndex = disk.findIndex(s => s.id == id)
        if (fileIndex == -1) {
            throw "File not found expection"
        }
        let file = disk[fileIndex]
        let newFreeSpaceIndex = disk.findIndex(v => v.id == -1 && v.size >= file.size)
        if (newFreeSpaceIndex != -1 && newFreeSpaceIndex < fileIndex) {
            disk[fileIndex] = {id:-1, size: file.size}
            let freeSpace = disk[newFreeSpaceIndex]
            if (file.size == freeSpace.size) {
                disk.splice(newFreeSpaceIndex, 1, file)
            } else {
                disk.splice(newFreeSpaceIndex, 1, file, {id: -1, size: freeSpace.size - file.size} )
            }
        }
    }
}

l2 = parseDisk2(disk)
nl2 = defrag2(l2)

function countChecksum(disk) {
    let checksum = 0
    let blockId = 0
    for (const space of disk) {
        if (space.id > 0) {
            for (let i=0; i < space.size; i++){
                checksum += (i+blockId) * space.id
            }
            blockId += space.size
        } else {
            blockId += space.size
        }
    }
    return checksum
}

console.log(countChecksum(l2))
