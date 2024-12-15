
let input = `hxbxwxba`
let alphabet = 'abcdefghijklmnopqrstuvwxyz'

let incPassword = (password) => {
    const letters = [...password].toReversed();
    let inc = true;

    return letters.map(letter => {
        if (!inc) return letter;

        const nextIndex = (alphabet.indexOf(letter) + 1) % alphabet.length;
        inc = nextIndex === 0;
        return alphabet[nextIndex];
    }).toReversed().join('');
}

let countPairs = (letters) => {
    let pairCount = 0
    for (let i = 1; i < letters.length; i++) {
        if (letters[i - 1] == letters[i]) {
            pairCount++
            i++
        }
    }
    return pairCount
}

let hasSequence = (letters) => {
    for (let i = 2; i < letters.length; i++) {
        if (
            alphabet.indexOf(letters[i - 2]) + 1 == alphabet.indexOf(letters[i - 1]) &&
            alphabet.indexOf(letters[i - 1]) + 1 == alphabet.indexOf(letters[i])
        ) {
            return true
        }
    }
    return false
}

function isValidPassword(password) {
    let letters = password.split('')
    if ('iol'.split('').some(l => letters.includes(l))) {
        return false
    }

    return hasSequence(letters) && countPairs(letters) >= 2
}

let password = input

do {
    password = incPassword(password)
} while (!isValidPassword(password))

console.log(password)

do {
    password = incPassword(password)
} while (!isValidPassword(password))

console.log(password)
