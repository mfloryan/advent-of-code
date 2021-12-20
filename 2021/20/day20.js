const fs = require('fs')
const path = require('path')
var _ = require('lodash');

let [algo, imageData] = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' }).split("\n\n")

// imageData = `#..#.
// #....
// ##..#
// ..#..
// ..###`;

// algo = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#`

function readImage(imageData) {
    let imageLines = imageData.split('\n').map(l => l.split(''));
    let image = []
    for (y = 0; y < imageLines.length; y++) {
        for (x = 0; x < imageLines[y].length; x++) {
            image.push({x,y,i:imageLines[y][x]})
        }
    }
    return image;
}

function enhancePixel(surrounding, algo) {
    let number = Number.parseInt(surrounding.join('').replace(/\./g,'0').replace(/#/g,'1'),2);
    return algo[number]
}

const aroundMe = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
]

function getPixel(image, x, y) {
    let ip = image.find(ips => (ips.x == x && ips.y == y));
        if (ip) {
            return {x:x, y:y, i:ip.i}
        } else {
            return {x:x, y:y, i:'.'}
        }
}

function getSurrounding(image, pixel) {
    let s = aroundMe.map( p => { return {x: p.x + pixel.x, y: p.y + pixel.y}});
    return s.map(p => getPixel(image, p.x, p.y).i);
}

function enhance(image, algo,d) {
    let newImage = []
    let dim = image.reduce( (p,c) => {
        return {minX: Math.min(p.minX, c.x), maxX: Math.max(p.maxX, c.x), minY: Math.min(p.minY, c.y), maxY: Math.max(p.maxY, c.y)}
    }, {minX : Number.MAX_VALUE, maxX: Number.MIN_VALUE, minY: Number.MAX_VALUE, maxY: Number.MIN_VALUE})

    for (y = dim.minY - d; y <= dim.maxY + d; y++) {
        for (x = dim.minX - d; x <= dim.maxX + d; x++) {
            let pixel = getPixel(image, x, y)
            let newPixel = {x, y, i: enhancePixel(getSurrounding(image, pixel), algo)}
            newImage.push(newPixel)
        }
    }
    return newImage
}

function drawImage(image) {
    let dim = image.reduce( (p,c) => {
        return {minX: Math.min(p.minX, c.x), maxX: Math.max(p.maxX, c.x), minY: Math.min(p.minY, c.y), maxY: Math.max(p.maxY, c.y)}
    }, {minX : Number.MAX_VALUE, maxX: Number.MIN_VALUE, minY: Number.MAX_VALUE, maxY: Number.MIN_VALUE})
    for (y = dim.minY; y <= dim.maxY; y++) {
        let line = []
        for (x = dim.minX; x <= dim.maxX; x++) {
            let p = getPixel(image, x,y);
            line.push(p.i)
        }
        console.log(line.join(''))
    }
}

let image = readImage(imageData);
for (let i =0; i < 50; i++) {
    let d = (i%2 == 0)?3:-1;
    image = enhance(image, algo, d);
    if (i == 1) console.log(image.reduce((p,c) => p + (c.i=='#'?1:0), 0))
}
console.log(image.reduce((p,c) => p + (c.i=='#'?1:0), 0))

// drawImage(image)