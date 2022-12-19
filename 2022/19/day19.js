const { loadLines } = require('../input')

let lines = loadLines('19/input.txt')

const indexMapping = {
    'ore' : 0,
    'clay' : 1,
    'obsidian' : 2,
    'geode' : 3
}

function parseLine(line) {
    const [b, allRobots] = line.split(": ")
    const robots = allRobots.split('.').map(s => s.trim()).filter(_ => _.length > 0)
    return robots.map(robotLine => {
        const [type,cost] = robotLine.split(" costs ")
        const resources = cost.split(" and ")
        let robotType = type.split(' ')[1]
        let costArray = new Array(4).fill(0)
        let outcomeArray = new Array(4).fill(0)
        resources.map(_ => _.split(' ')).map(_ => [_[1], Number(_[0])]).forEach(r => costArray[indexMapping[r[0]]] = r[1])
        outcomeArray[indexMapping[robotType]] = 1
        return {type: robotType, outcome: outcomeArray, cost: costArray}
    })
}

// lines = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
// Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`.split('\n')

function add(a1, a2) {
    if (a1 === undefined) {
        if (a2 === undefined) {
            throw "error"
        } else {
            return a2.slice()
        }
    } else if (a2 === undefined) {
        return a1.slice()
    }
    return a1.map((v,i) => v + a2[i])
}

function getMaxOfOptions(blueprints) {
    let maxes = []
    let maxRobotsNeeded = data2.map(b => b.reduce((p,c) =>
    [
        Math.max(p[0], c.cost[0]),
        Math.max(p[1], c.cost[1]),
        Math.max(p[2], c.cost[2])] ,[0,0,0]))

    for (let i = 0; i < blueprints.length; i++) {
        let bp = blueprints[i]
        let max = {max : 0}
        examineOptions(bp, maxRobotsNeeded[i], new Array(4).fill(0), [1,0,0,0], 24, max)
        maxes.push([i+1, max])
        console.log(i+1, max)
    }
    return maxes.reduce((p,c) => p + (c[0] * c[1].max),0)
}

function examineOptions(blueprint, maxRobotsNeeded, resources, robots, time, maxGeode) {
    if (time == 0) {
        maxGeode.max = Math.max(resources[3],maxGeode.max)
        return
    }

    let possibleRobots = blueprint.filter(rb => rb.cost.every((v,i) => resources[i] >= v))
    if (possibleRobots.length > 0 && time > 1) {
        for (const pr of possibleRobots) {
            if (robots[0]+pr.outcome[0] > maxRobotsNeeded[0] ||
                robots[1]+pr.outcome[1] > maxRobotsNeeded[1] ||
                robots[2]+pr.outcome[2] > maxRobotsNeeded[2]
                ) continue
            let newResources = resources.map((v,i) => v - pr.cost[i])
            newResources = add(newResources, robots)
            let newRobots = add(pr.outcome, robots)
            examineOptions(blueprint, maxRobotsNeeded, newResources, newRobots, time - 1, maxGeode)
        }
        let newResources = add(resources, robots)
        examineOptions(blueprint, maxRobotsNeeded, newResources, robots, time - 1, maxGeode)
    } else {
        let newResources = add(resources, robots)
        examineOptions(blueprint, maxRobotsNeeded, newResources, robots, time - 1, maxGeode)
    }
}

let data2 = lines.map(parseLine)
console.log(getMaxOfOptions(data2))
