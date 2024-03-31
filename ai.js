const checkers = require("./checkers")
const utils = require("./utils")

function getBestMove(position, forcedCaptures, canCaptureBackwards, depth){
    let potentialMoves = checkers.getMoves(position, forcedCaptures, canCaptureBackwards)
    let bestMove = []
    let highestScore = -100000

    for(let i = 0; i < potentialMoves.length; i++) { 
        let posCopy = utils.deepCopyArray(position)
        let lastElementIndex = potentialMoves[i].length - 1
        posCopy[potentialMoves[i][lastElementIndex][0]][potentialMoves[i][lastElementIndex][1]] = posCopy[potentialMoves[i][0][0]][potentialMoves[i][0][1]]
        for(let j = 0; j < lastElementIndex; j++){
            posCopy[potentialMoves[i][j][0]][potentialMoves[i][j][1]] = "*"
        }
        let score = searchOpponent(posCopy, depth)
        if(score > highestScore){
            highestScore = score
            bestMove = potentialMoves[i]
        }
    }

    return bestMove

    function search(pos, depth) {
        let moves = checkers.getMoves(pos, forcedCaptures, canCaptureBackwards)
        if(moves.length === 0) return -100000
        if(depth === 0) return countScore(pos)

        let maxScore = -100000
        
        for(let i = 0; i < moves.length; i++){
            let posCopy = utils.deepCopyArray(pos)
            let lastElementIndex = moves[i].length - 1
            posCopy[moves[i][lastElementIndex][0]][moves[i][lastElementIndex][1]] = posCopy[moves[i][0][0]][moves[i][0][1]]
            for(let j = 0; j < lastElementIndex; j++){
                posCopy[moves[i][j][0]][moves[i][j][1]] = "*"
            }
            let score = searchOpponent(posCopy, depth)
            if(score > maxScore) maxScore = score
        }

        return maxScore
    }

    function searchOpponent(pos, depth){
        let moves = checkers.getOpponentMoves(pos, forcedCaptures, canCaptureBackwards)
        if(moves.length === 0) return 100000

        let minScore = 1000000

        for(let i = 0; i < moves.length; i++){
            let posCopy = utils.deepCopyArray(pos)
            let lastElementIndex = moves[i].length - 1
            posCopy[moves[i][lastElementIndex][0]][moves[i][lastElementIndex][1]] = posCopy[moves[i][0][0]][moves[i][0][1]]
            for(let j = 0; j < lastElementIndex; j++){
                posCopy[moves[i][j][0]][moves[i][j][1]] = "*"
            }
            let score = search(posCopy, depth - 1)
            if(minScore > score) minScore = score
        }

        return minScore
    }

    function countScore(pos){
        let score = 0
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                if(pos[y][x] === "a") score++
                else if(pos[y][x] === "e") score--
            }
        }
        return score
    }
}

module.exports = { getBestMove }