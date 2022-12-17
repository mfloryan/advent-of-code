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

    let startRock = 0
    let moveIndex = 0
    let totalHeight = 0

    if (simulateRocks > (1730 + 1720)) {
        let cycleMoves = Math.floor(( (simulateRocks - 1730) / 1720))
        totalHeight = 2773 + cycleMoves * 2738
        startRock =  (cycleMoves * 1720) + 1730
        moveIndex = 9
    }

    for (let rock = startRock; rock < simulateRocks; rock++) {

        let nextRock = rocks[rock % rocks.length]
        let rockHeight = nextRock.length
        let freeSpaceAtTheTop = board.slice(-8).filter(row => row.every(p => p == ".")).length
        let howMuchSpaceWeNeed = rockHeight + 3
        let howManyNewRowsToAdd = howMuchSpaceWeNeed - freeSpaceAtTheTop

        if (howManyNewRowsToAdd >= 0) {
            addRowsToBoard(board, howManyNewRowsToAdd)
        } else {
            for (let i = 0; i < Math.abs(howManyNewRowsToAdd); i++) {
                board.pop()
            }
        }

        nextRock.forEach((row, y) => {
            row.forEach((e, x) => {
                board[board.length - 1 - y][2 + x] = nextRock[y][x]
            })
        })

        let rockBottomIndex = board.length - 1
        while (true) {
            let arrayIndexA = Math.max(rockBottomIndex - rockHeight, 0)
            let arrayIndexB = rockBottomIndex
            let relevantBoardSlice = board.slice(arrayIndexA, arrayIndexB + 1)

            let move = moves[moveIndex]
            moveIndex = (moveIndex + 1) % moves.length

            let direction = (move == '<') ? -1 : 1
            let elements = getElementsOfSlice(relevantBoardSlice, arrayIndexA)
            if (canMoveHoriz(board, elements, direction)) {
                elements.forEach(e => board[e[1]][e[0]] = '.')
                elements.forEach(e => board[e[1]][e[0] + direction] = '@')
            }

            elements = getElementsOfSlice(relevantBoardSlice, arrayIndexA)
            if (canMoveVert(board, elements)) {
                elements.forEach(e => board[e[1]][e[0]] = '.')
                elements.forEach(e => board[e[1] - 1][e[0]] = '@')
                rockBottomIndex--
            } else {
                elements.forEach(e => board[e[1]][e[0]] = '#')
                break
            }
        }

    }
    // showBoard(board)
    console.log(totalHeight + board.filter(r => r.join('') != ".......").length)
}

playTetris(moves, 2022)
playTetris(moves, 1000000000000)
