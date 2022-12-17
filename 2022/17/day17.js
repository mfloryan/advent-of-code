const { loadLines } = require('../input')
let lines = loadLines('17/input.txt')

let moves = lines[0].split('')
// moves = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'.split('')

const rocks = [
    '@@@@',
`.@.
@@@
.@.`,
`..@
..@
@@@`,
`@
@
@
@`,
`@@
@@`].map(rock => rock.split('\n').map(x => x.split('')))

function showBoard(board) {
    let showBoard = board.slice()
    showBoard.reverse()
    console.log(
        showBoard.map(row => row.join('')).join('\n')
    )
}

function canMoveHoriz(board, elements, direction) {
    for (const e of elements) {
        if ((e[0] + direction) > board[0].length - 1 || (e[0] + direction) < 0) return false
        if (board[e[1]][e[0] + direction] == "#") return false
    }
    return true
}

function canMoveVert(board, elements) {
    for (const e of elements) {
        if ((e[1] - 1) < 0) return false
        if (board[e[1] - 1][e[0]] == "#") return false
    }
    return true
}

function addRowsToBoard(board, rows) {
    for (let i = 0; i < rows; i++) {
        board.push(new Array(7).fill('.'))
    }
}

function getElementsOfSlice(relevantBoardSlice, offset) {
    return relevantBoardSlice.flatMap((r, y) => r.map(
        (e, x) => [x, y + offset, e])
    ).filter(_ => _[2] == '@')

}

function playTetris(moves, simulateRocks) {
    let board = []

    let moveIndex = 0;
    for (let rock = 0; rock < simulateRocks; rock++) {
        let nextRock = rocks[rock % rocks.length]
        let rockHeight = nextRock.length
        let freeSpaceAtTheTop = board.slice(-8).filter(row => row.every(p => p == ".")).length
        let howMuchSpaceWeNeed = rockHeight + 3
        let howManyNewRowsToAdd = howMuchSpaceWeNeed - freeSpaceAtTheTop

        // console.log("WHY!?")
        // console.log('---',freeSpaceAtTheTop, howMuchSpaceWeNeed, howManyNewRowsToAdd)

        // showBoard(board)

        if (howManyNewRowsToAdd >= 0) {
            addRowsToBoard(board, howManyNewRowsToAdd)
        } else {
            for (let i = 0; i < Math.abs(howManyNewRowsToAdd); i++) {
                board.pop()
            }
        }

        // showBoard(board)

        nextRock.forEach((row, y) => {
            row.forEach((e, x) => {
                board[board.length - 1 - y][2 + x] = nextRock[y][x]
            })
        })

        // console.log("new rock", rock, rock % rocks.length)
        // showBoard(board)

        let rockBottomIndex = board.length - 1
        while (true) {

            // console.log('\n** next move sequence', move)
            // showBoard(board)
            // console.log("*** moving ***")
            // horizontal move

            let arrayIndexA = Math.max(rockBottomIndex - rockHeight, 0)
            let arrayIndexB = rockBottomIndex
            let relevantBoardSlice = board.slice(arrayIndexA, arrayIndexB + 1)

            let move = moves[moveIndex % moves.length]
            moveIndex++

            let direction = (move == '<') ? -1 : 1
            let elements = getElementsOfSlice(relevantBoardSlice, arrayIndexA)
            if (canMoveHoriz(board, elements, direction)) {
                elements.forEach(e => board[e[1]][e[0]] = '.')
                elements.forEach(e => board[e[1]][e[0] + direction] = '@')
            }

            // console.log('--ah-',moveIndex, move)
            // showBoard(board)

            // vertical move
            elements = getElementsOfSlice(relevantBoardSlice, arrayIndexA)
            if (canMoveVert(board, elements)) {
                elements.forEach(e => board[e[1]][e[0]] = '.')
                elements.forEach(e => board[e[1] - 1][e[0]] = '@')
                rockBottomIndex--
            } else {
                elements.forEach(e => board[e[1]][e[0]] = '#')
                break
            }
            // console.log('---')
            // showBoard(board)
        }

    }
    // showBoard(board)
    console.log(board.filter(r => r.join('') != ".......").length)

}

playTetris(moves, 2022)
// playTetris(moves, 1000000000000)
