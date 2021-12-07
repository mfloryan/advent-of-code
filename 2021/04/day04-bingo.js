const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' }).split("\n\n")

// input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

// 22 13 17 11  0
//  8  2 23  4 24
// 21  9 14 16  7
//  6 10  3 18  5
//  1 12 20 15 19

//  3 15  0  2 22
//  9 18 13 17  5
// 19  8  7 25 23
// 20 11 10 24  4
// 14 21 16 12  6

// 14 21 17 24  4
// 10 16 15  9 19
// 18  8 23 26 20
// 22 11 13  6  5
//  2  0 12  3  7`.split('\n\n')

let numbers = input.shift().split(',').map(n => Number.parseInt(n))

boards = input.map(b => b.split("\n").map(r => r.split(' ').filter(n => n != "").map(n => { return {x: false, n: Number.parseInt(n) }})))

function mark(number, board) {
    board.forEach( r => {
        r.forEach( p => {
            if (p.n == number) p.x = true
        })
    })
}

function testBoard(board) {
    for (let x = 0; x < board.length; x++) {
        r = board[x]
        if (r.every(p => p.x)) {
            // console.log("winning row ", r)
            // console.log(board)
            return true
        }
    }

    for (let c =0; c < board[0].length; c++) {
        let column = board.map(b => b[c])
        if (column.every(p => p.x)) {
            // console.log("winning column ", c)
            // console.log(board)
            return true
        }
    }
    return false
}

function drawBoard(board){
    console.log("board")
    console.log(board.map(r => r.map(p => p.x?`[${p.n}]`:p.n).join(' ')).join('\n'))
    console.log("")
}

function runBingo(numbers, boards) {
    for (i = 0; i < numbers.length; i++) {
        let number = numbers[i]
        boards.forEach(b => {
            mark(number, b)
        })
        for (x = 0; x < boards.length; x++) {
            if (testBoard(boards[x])) {
                let notmarked = boards[x].flatMap(r => r.filter(p => !p.x)).reduce((p,c) => p+c.n, 0)
                console.log("Day 04 - part 01:", notmarked * number)
                return boards[x]
            }
        }
    }
}

function runBingoToTheLastOne(numbers, boards) {
    let boardsLeft = boards.length;
    let numberIndex = -1;
    do {
        numberIndex++
        let number = numbers[numberIndex]
        boards.forEach(b => {
            mark(number, b)
        })
        boardsLeft = boards.map(b => testBoard(b)).filter(x => !x).length
     } while (boardsLeft > 1)
    let lastBoard = boards.filter(b => !testBoard(b))[0]
    let lastNumber = numbers[numberIndex +1]
    mark(lastNumber, lastBoard)
    // drawBoard(lastBoard)
    let notmarked = lastBoard.flatMap(r => r.filter(p => !p.x)).reduce((p,c) => p+c.n, 0)
    console.log("Day 04 - part 2:", notmarked * lastNumber)
}

let winningBoard = runBingo(numbers, boards);
let loosingBoard = runBingoToTheLastOne(numbers, boards);