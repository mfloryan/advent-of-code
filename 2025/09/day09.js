const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let data = input.split('\n').map(l => l.split(',').map(v => Number.parseInt(v)))

function getArea(a, b) {
    return (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1)
}

let maxArea = 0

for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
        let area = getArea(data[i], data[j])
        if (area > maxArea) maxArea = area
    }
}

console.log(maxArea)

let lines = []

for (let i = 0; i < data.length; i++) {
    lines.push([data[i], data[(i + 1) % data.length]])
}

function isRectangleInside(x0, y0, x1, y1, edges) {
    if (x0 > x1) [x0, x1] = [x1, x0];
    if (y0 > y1) [y0, y1] = [y1, y0];

    for (const [[ex1, ey1], [ex2, ey2]] of edges) {
        if (ex1 === ex2) {
            if (ex1 > x0 && ex1 < x1) {
                const minY = Math.min(ey1, ey2);
                const maxY = Math.max(ey1, ey2);
                if (minY < y1 && maxY > y0) {
                    return false; // edge cuts through
                }
            }
        } else {
            if (ey1 > y0 && ey1 < y1) {
                const minX = Math.min(ex1, ex2);
                const maxX = Math.max(ex1, ex2);
                if (minX < x1 && maxX > x0) {
                    return false; // edge cuts through
                }
            }
        }
    }

    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    let crossings = 0;

    for (const [[ex1, ey1], [ex2, ey2]] of edges) {
        if (ex1 === ex2) {
            const minY = Math.min(ey1, ey2);
            const maxY = Math.max(ey1, ey2);
            if (minY <= cy && cy < maxY && ex1 > cx) {
                crossings++;
            }
        }
    }

    return crossings % 2 === 1;
}

let maxArea2 = 0

for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
        if (isRectangleInside(data[i][0], data[i][1], data[j][0], data[j][1], lines)) {
            let area = getArea(data[i], data[j])
            if (area > maxArea2) {
                maxArea2 = area
            }
        }
    }
}

console.log(maxArea2)
