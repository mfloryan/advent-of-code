const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function createAdjacencyMatrix(pairs) {
    const vertices = [...new Set(pairs.flat())];

    const matrix = new Array(vertices.length).fill()
        .map(() => new Array(vertices.length).fill(0));

    for (const [from, to] of pairs) {
        const fromIndex = vertices.indexOf(from);
        const toIndex = vertices.indexOf(to);
        matrix[fromIndex][toIndex] = 1;
        matrix[toIndex][fromIndex] = 1;
    }

    return {
        matrix,
        vertices,
    };
}

function findTriangles(am) {
    const triangles = [];
    const n = am.vertices.length;

    for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
            if (am.matrix[i][j]) {
                for (let k = j + 1; k < n; k++) {
                    if (am.matrix[i][k] && am.matrix[j][k]) {
                        triangles.push([
                            am.vertices[i],
                            am.vertices[j],
                            am.vertices[k]
                        ]);
                    }
                }
            }
        }
    }

    return triangles;
}


function findMaximumClique(am) {
    
    let maxClique = [];

    function getNeighbors(vertex) {
        return am.matrix[vertex].map((val, idx) => val === 1 ? idx : -1)
            .filter(idx => idx !== -1);
    }

    function intersection(arr1, arr2) {
        return arr1.filter(x => arr2.includes(x));
    }

    // Bron-Kerbosch algorithm with pivoting
    function bronKerbosch(r, p, x) {
        if (p.length === 0 && x.length === 0) {
            if (r.length > maxClique.length) {
                maxClique = [...r];
            }
            return;
        }

        // Choose pivot
        const union = [...p, ...x];
        const pivot = union[0];
        const pivotNeighbors = getNeighbors(pivot);

        // For each vertex in P that's not connected to pivot
        for (const v of p) {
            if (!pivotNeighbors.includes(v)) {
                const neighbors = getNeighbors(v);
                bronKerbosch(
                    [...r, v],
                    intersection(p, neighbors),
                    intersection(x, neighbors)
                );
                p = p.filter(vertex => vertex !== v);
                x = [...x, v];
            }
        }
    }

    // Initialize with all vertices in P
    const initialP = [...am.vertices.keys()];
    bronKerbosch([], initialP, []);

    return maxClique.map(idx => am.vertices[idx]);
}


let data = input.split('\n').map(l => l.split('-'))

let am = createAdjacencyMatrix(data)

const triangles = findTriangles(am);
console.log(
    triangles.filter(t => t.some(p => p.startsWith('t'))).length
);

const maxClique = findMaximumClique(am);
console.log(
    maxClique.toSorted().join(',')
)
