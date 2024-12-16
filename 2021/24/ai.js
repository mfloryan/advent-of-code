// Each block's parameters
const blocks = [
    { divZ: 1, addX: 14, addY: 0 },    // 0
    { divZ: 1, addX: 13, addY: 12 },   // 1
    { divZ: 1, addX: 15, addY: 14 },   // 2
    { divZ: 1, addX: 13, addY: 0 },    // 3
    { divZ: 26, addX: -2, addY: 3 },   // 4
    { divZ: 1, addX: 10, addY: 15 },   // 5
    { divZ: 1, addX: 13, addY: 11 },   // 6
    { divZ: 26, addX: -15, addY: 12 }, // 7
    { divZ: 1, addX: 11, addY: 1 },    // 8
    { divZ: 26, addX: -9, addY: 12 },  // 9
    { divZ: 26, addX: -9, addY: 3 },   // 10
    { divZ: 26, addX: -7, addY: 10 },  // 11
    { divZ: 26, addX: -4, addY: 14 },  // 12
    { divZ: 26, addX: -6, addY: 12 }   // 13
];

function findRelationships() {
    let stack = [];
    let relationships = [];
    
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].divZ === 1) {
            stack.push({ pos: i, value: blocks[i].addY });
        } else {
            const prev = stack.pop();
            relationships.push({
                pos1: prev.pos,
                pos2: i,
                diff: prev.value + blocks[i].addX
            });
        }
    }
    return relationships;
}

function findAllValidPairs(diff) {
    const pairs = [];
    for (let w1 = 1; w1 <= 9; w1++) {
        const w2 = w1 + diff;
        if (w2 >= 1 && w2 <= 9) {
            pairs.push([w1, w2]);
        }
    }
    return pairs;
}

function* generateAllValidNumbers(relationships, currentDigits = new Array(14).fill(null), relationshipIndex = 0) {
    if (relationshipIndex === relationships.length) {
        // Fill in any remaining unassigned digits with 9 (for maximum) or 1 (for minimum)
        const result = [...currentDigits];
        for (let i = 0; i < result.length; i++) {
            if (result[i] === null) {
                result[i] = 9; // or 1 for minimum
            }
        }
        yield result;
        return;
    }
    
    const rel = relationships[relationshipIndex];
    const validPairs = findAllValidPairs(rel.diff);
    
    for (const [w1, w2] of validPairs) {
        if ((currentDigits[rel.pos1] === null || currentDigits[rel.pos1] === w1) && 
            (currentDigits[rel.pos2] === null || currentDigits[rel.pos2] === w2)) {
            const nextDigits = [...currentDigits];
            nextDigits[rel.pos1] = w1;
            nextDigits[rel.pos2] = w2;
            yield* generateAllValidNumbers(relationships, nextDigits, relationshipIndex + 1);
        }
    }
}

function verifyNumber(digits) {
    let z = 0;
    for (let i = 0; i < 14; i++) {
        const w = digits[i];
        let x = z % 26;
        z = Math.floor(z / blocks[i].divZ);
        x += blocks[i].addX;
        x = (x === w) ? 0 : 1;
        const y = (w + blocks[i].addY) * x;
        z = z * (25 * x + 1) + y;
    }
    return z === 0;
}

// Find all valid numbers
function findAllValidNumbers() {
    const relationships = findRelationships();
    const validNumbers = [];
    
    console.log('Digit relationships:');
    relationships.forEach(rel => {
        console.log(`digit[${rel.pos1}] + ${rel.diff} = digit[${rel.pos2}]`);
    });
    
    console.log('\nSearching for valid numbers...');
    for (const digits of generateAllValidNumbers(relationships)) {
        if (verifyNumber(digits)) {
            validNumbers.push([...digits]);
        }
    }
    
    // Sort numbers for better display
    validNumbers.sort((a, b) => {
        const numA = BigInt(a.join(''));
        const numB = BigInt(b.join(''));
        return numA < numB ? -1 : numA > numB ? 1 : 0;
    });
    
    return validNumbers;
}

// Find and display all solutions
const allValidNumbers = findAllValidNumbers();
console.log(`\nFound ${allValidNumbers.length} valid numbers:`);
console.log('Smallest:', allValidNumbers[0].join(''));
console.log('Largest:', allValidNumbers[allValidNumbers.length - 1].join(''));
console.log('\nAll valid numbers:');
allValidNumbers.forEach(digits => console.log(digits.join('')));
