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
