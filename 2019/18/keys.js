const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' });

function parseMap (map) {
  return map.split('\n').flatMap((row, y) => row.split('').map((c, x) => { return { x, y, c }; }).filter(p => p.c !== '#'));
}

function isKey (character) {
  return character.charCodeAt(0) >= 'a'.charCodeAt(0);
}

function isDoor (character) {
  charCode = character.charCodeAt(0);
  return (charCode >= 'A'.charCodeAt(0)) && (charCode < 'a'.charCodeAt(0));
}

function doorForKey (key) {
  return String.fromCharCode(key.charCodeAt(0) + ('A'.charCodeAt(0) - 'a'.charCodeAt(0)));
}

function printMap (map) {
  const dim = map.reduce((p, c) => {
    return {
      minX: Math.min(c.x, p.minX),
      maxX: Math.max(c.x, p.maxX),
      minY: Math.min(c.y, p.minY),
      maxY: Math.max(c.y, p.maxY)
    };
  }, { minX: 0, maxX: 0, minY: 0, maxY: 0 });

  const picture = [];
  for (let y = dim.minY; y <= dim.maxY; y++) {
    const row = [];
    for (let x = dim.minX; x <= dim.maxX; x++) {
      const mapLocation = map.find(p => p.x === x && p.y === y);
      if (mapLocation) row.push(mapLocation.c);
      else row.push(' ');
    }
    picture.push(row);
  }

  console.log(picture.map(r => r.join('')).join('\n'));
}

function collectKeys (map) {
  const vicinity = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  const start = map.find(p => p.c === '@');
  // console.log('start', start);

  function explore (map, position, path, discovered, level = 0) {
    // console.log(''.padStart(level), position);
    path.push(position);

    if (isKey(position.c)) {
      discovered.push({ key: position.c, path });
      return true;
    }

    if (isDoor(position.c)) {
      return false;
    }

    const surroundings = vicinity.map(p => { return { x: p.x + position.x, y: p.y + position.y }; });

    const possibleNextSteps = surroundings
      .map(p => map.find(mp => mp.x === p.x && mp.y === p.y))
      .filter(p => p)
      .filter(p => p.c !== '#')
      .filter(p => !(path.some(pp => pp.x === p.x && pp.y === p.y)));

    for (let i = 0; i < possibleNextSteps.length; i++) {
      const s = possibleNextSteps[i];
      explore(map, s, path.slice(), discovered, level + 1);
    }
    return false;
  }

  const walked = 0;
  const position = start;

  function collectNextKey (position, inputMap, keysCollected, keyPath, walked = 0, level = 0) {
    console.log(level.toString().padStart(level + 1), position, walked, keyPath && keyPath.key);
    const map = inputMap;

    printMap(map);

    if (keyPath) {
      const key = map.find(mp => mp.c === keyPath.key);
      key.c = '.';
      const door = map.find(mp => mp.c === doorForKey(keyPath.key));
      if (door) door.c = '.';

      console.log('doors and keys', map.filter(p => isKey(p.c) || isDoor(p.c)).map(p => p.c));

      const keys = map.filter(p => isKey(p.c)).length;
      if (keys === 0) {
        console.log(walked, keysCollected);
        return;
      }
    }
    console.log('doors and keys (2)', map.filter(p => isKey(p.c) || isDoor(p.c)).map(p => p.c));
    printMap(map);

    const discovered = [];
    explore(map, position, [], discovered);
    console.log(discovered.map(d => d.key));
    console.log();

    for (let i = 0; i < discovered.length; i++) {
      const keyPath = discovered[i];
      keysCollected.push(keyPath.key);
      const newWalked = walked + keyPath.path.length - 1;
      const keyPosition = keyPath.path.pop();

      collectNextKey(keyPosition, JSON.parse(JSON.stringify(map)), keysCollected.slice(), keyPath, newWalked, level + 1);
    }
  }

  const keysCollected = [];
  collectNextKey(position, map, keysCollected, null, 0);

  const done = false;
  // do {
  //   const discovered = [];
  //   explore(map, position, [], discovered);
  //   console.log(discovered.map(d => d.key));
  //   if (discovered.length === 1) {
  //     console.log(discovered[0].path);
  //     const key = map.find(mp => mp.c === discovered[0].key);
  //     key.c = '.';
  //     const door = map.find(mp => mp.c === doorForKey(discovered[0].key));
  //     if (door) door.c = '.';

  //     walked += discovered[0].path.length - 1;
  //     const keyPosition = discovered[0].path.pop();
  //     position = keyPosition;
  //   } else {
  //     console.log('options', discovered.length);
  //     done = true;
  //   }
  //   const keys = map.filter(p => isKey(p.c)).length;
  //   if (keys === 0) done = true;
  // } while (!done);

  return walked;
}

function getPossibleNextMoves (map, location) {
  const vicinity = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  const surroundings = vicinity.map(p => { return { x: p.x + location.x, y: p.y + location.y }; });

  const possibleNextSteps = surroundings
    .map(p => map.find(mp => mp.x === p.x && mp.y === p.y))
    .filter(p => p)
    .filter(p => !isDoor(p.c));

  return possibleNextSteps;
}

function findKeysFromLocation (map, start) {
  const keys = [];
  const queue = [];
  const visited = [];

  let location = { x: start.x, y: start.y, c: start.c, path: [] };
  visited.push({ x: start.x, y: start.y });
  queue.push(location);

  while (queue.length > 0) {
    location = queue.shift();
    if (isKey(location.c)) {
      keys.push(location);
    }
    const nextMoves = getPossibleNextMoves(map, location).filter(nm => !visited.some(v => v.x === nm.x && v.y === nm.y));
    nextMoves.forEach(nm => {
      visited.push({ x: nm.x, y: nm.y });
      const newPath = location.path.slice();
      newPath.push(location);
      queue.push({ x: nm.x, y: nm.y, c: nm.c, path: newPath });
    });
  }

  return keys.map(kp => { return { location: { key: kp.c, x: kp.x, y: kp.y }, length: kp.path.length }; });
}

function removeKey (map, key) {
  return map.map(p => { return { x: p.x, y: p.y, c: p.c === key ? '.' : (p.c === doorForKey(key) ? '.' : p.c) }; });
}

let finalPath = {};

function getNextKey (initialMap, start, path = [], level = 0) {
  // console.log('gnk'.padStart(3 + level), start, path.map(p => p.k).join(''));
  let nextKeys = [];
  if (initialMap.filter(m => isKey(m.c)).length !== 0) {
    nextKeys = findKeysFromLocation(initialMap, start);
  }

  if (nextKeys.length === 0) {
    const fullPath = path.reduce((p, c) => { return { keys: p.keys + c.k, d: p.d + c.length }; }, { keys: '', d: 0 });
    if (!finalPath.d || finalPath.d > fullPath.d) finalPath = fullPath;
    console.log(finalPath);
    return;
  }

  nextKeys.forEach(nk => {
    const map = removeKey(initialMap, nk.location.key);
    const newPath = path.slice();
    newPath.push({ k: nk.location.key, length: nk.length });
    getNextKey(map, { x: nk.location.x, y: nk.location.y, c: '.' }, newPath, level + 1);
  });
}

const exampleMap1 = `#########
#b.A.@.a#
#########`;

const exampleMap1a = `###############
#b.A.c.@.a.C.d#
###############`;

const exampleMap2 = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`;

const exampleMap3 = `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`;

const exampleMap4 = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;

const exampleMap5 = `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`;

const map = parseMap(exampleMap4);
// console.log(map);
// printMap(map);
// let keys = findKeysFromLocation(map, map.find(m => m.c === '@'));
// console.log(keys);
// console.log(map);

getNextKey(map, map.find(m => m.c === '@'));
console.log(finalPath);

// const map = parseMap(exampleMap2);
// const result = collectKeys(map);
// console.log(result);
