const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('15/input.txt')

let data = lines.map(l => l.split('').map(x => Number.parseInt(x)));

// data=`1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581`.split('\n').map(l => l.split('').map(x => Number.parseInt(x)))


let dim = {mx : data[0].length - 1, my: data.length - 1}
// console.log(dim)

function findNextStep(map, start) {
    let r = []
    if (start.x + 1 <= dim.mx) r.push({ x:start.x+1, y: start.y, r:map[start.y][start.x+1] })
    if (start.y + 1 <= dim.my) r.push({ x:start.x, y: start.y+1, r:map[start.y+1][start.x] })
    return r
}

let min = Number.MAX_VALUE
let pc  = 0;
let bestPath
let lastTime = new Date()

function findPath(map, start, visited) {
    // DFS
    visited.n.push(start)
    visited.r += start.r
    if (start.x == dim.mx && start.y == dim.my) {
        pc++
        if (pc % 1000000 == 0) {
            console.log(new Date().getTime() - lastTime.getTime())
            lastTime = new Date()
        }
        let tr = visited.r
        if (tr < min) {
            min = tr;
            bestPath = visited
            console.log(pc, min)
        }
        return;
    }
    if (visited.r + ((dim.mx - start.x) + (dim.my - start.y)) > min) return;
    let nextSteps = findNextStep(map, start);
    nextSteps.forEach(s => {
        findPath(map, s, {r : visited.r, n: visited.n.slice()})
    })
}

let graph = {}

for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
        let a = {}
        graph[`x${x}y${y}`] = a
        if (y + 1 < data.length) {
            a[`x${x}y${y+1}`] = data[y+1][x];
        }
        if (x + 1 < data[y].length) {
            a[`x${x+1}y${y}`] = data[y][x+1];
        }
        if (y > 0) {
            a[`x${x}y${y-1}`] = data[y-1][x];
        }
        if (x > 0) {
            a[`x${x-1}y${y}`] = data[y][x-1];
        }
    }
}

let shortestDistanceNode = (distances, visited) => {
      let shortest = null;
      for (let node in distances) {
          let currentIsShortest =
              shortest === null || distances[node] < distances[shortest];
          if (currentIsShortest && !visited.includes(node)) {
              shortest = node;
          }
      }
      return shortest;
  };

let findShortestPath = (graph, startNode, endNode) => {
    // track distances from the start node using a hash object
      let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);
   // track paths using a hash object
    let parents = { endNode: null };
    for (let child in graph[startNode]) {
     parents[child] = startNode;
    }

    // collect visited nodes
      let visited = [];
   // find the nearest node
      let node = shortestDistanceNode(distances, visited);

    // for that node:
    while (node) {
    // find its distance from the start node & its child nodes
     let distance = distances[node];
     let children = graph[node]; 

    // for each of those child nodes:
         for (let child in children) {

     // make sure each child node is not the start node
           if (String(child) === String(startNode)) {
             continue;
          } else {
             // save the distance from the start node to the child node
             let newdistance = distance + children[child];
   // if there's no recorded distance from the start node to the child node in the distances object
   // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
             if (!distances[child] || distances[child] > newdistance) {
   // save the distance to the object
        distances[child] = newdistance;
   // record the path
        parents[child] = node;
       } 
            }
          }  
         // move the current node to the visited set
         visited.push(node);
   // move to the nearest neighbor node
         node = shortestDistanceNode(distances, visited);
       }

    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
     shortestPath.push(parent);
     parent = parents[parent];
    }
    shortestPath.reverse();

    //this is the shortest path
    let results = {
     distance: distances[endNode],
     path: shortestPath,
    };
    // return the shortest path & the end node's distance from the start node
      return results;
};

console.log(findShortestPath(graph, "x0y0", "x99y99"));
