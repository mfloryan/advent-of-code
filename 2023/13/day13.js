const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })



function findPossibleVerticalLine(image){
    let options = []
    for (let x = 0; x < image[0].length-1; x++) {
        let line1 = [], line2 = []
        for (let y = 0; y < image.length; y++) {
            line1.push(image[y][x])
            line2.push(image[y][x+1])
        }
        if (line1.join('') == line2.join('')) options.push(x+1)
    }
    return options
}

function findPossibleHorizontalLine(image){
    let options = []
    for (let y = 0; y < image.length-1; y++) {
        if (image[y].join('') == image[y+1].join('')) options.push(y+1)
    }
    return options
}

function validateVerticalLine(image, line) {
    let left = line - 1
    let right = line

    while (left >= 0 && right < image[0].length) {
        let leftLine = [], rightLine = []
        for (let y = 0; y < image.length; y++) {
            leftLine.push(image[y][left])
            rightLine.push(image[y][right])
        }

        if (leftLine.join('') != rightLine.join('')) return false
        left--; right++;
    }
    return true
}

function validateHorizontalLine(image, line) {
    let top = line - 1
    let bottom = line

    while (top >= 0 && bottom < image.length) {
        if (image[top].join('') != image[bottom].join('')) return false
        top--; bottom++;
    }

    return true
}


// input = `#.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.

// #...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#`

let things = input.split('\n\n');

let images = things.map(t => t.split('\n').map(t => t.split('')))


let x = images.map((image,index) => {
    return {i: index, 
        v: findPossibleVerticalLine(image).filter(l => validateVerticalLine(image, l)),
        h: findPossibleHorizontalLine(image).filter(l => validateHorizontalLine(image, l))
    }})

let v = x.map(_ => {
    if (_.v.length > 0) return _.v[0];
    else return _.h[0]*100;
})

console.log(v.reduce((p,c) => p+c))
