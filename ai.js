const checkers = require("./checkers")

function getBestMove(position, forcedCaptures, canCaptureBackwards, depth){
    let potentialMoves = checkers.getMoves(position, forcedCaptures, canCaptureBackwards)
    let bestMove = []
    let highestScore = -1000000

    for(let i = 0; i < potentialMoves.length; i++) { 
        makeMove(position, potentialMoves[i])
        let score = searchOpponent(position, depth, )
        unmakeMove(position, potentialMoves[i])
        if(score > highestScore){
            highestScore = score
            bestMove = potentialMoves[i]
        }
    }

    return bestMove

    function search(pos, depth, minScore) {
        let moves = checkers.getMoves(pos, forcedCaptures, canCaptureBackwards)
        if(moves.length === 0) return -100000
        if(depth === 0) return countScore(pos)

        let maxScore = -100000
        
        for(let i = 0; i < moves.length; i++){
            makeMove(pos, moves[i])
            let score = searchOpponent(pos, depth, maxScore)
            unmakeMove(pos, moves[i])
            if(score <= minScore) return score
            if(score > maxScore) maxScore = score
        }

        return maxScore
    }

    function searchOpponent(pos, depth, maxScore){
        let moves = checkers.getOpponentMoves(pos, forcedCaptures, canCaptureBackwards)
        if(moves.length === 0) return 100000

        let minScore = 1000000

        for(let i = 0; i < moves.length; i++){
            makeMove(pos, moves[i])
            let score = search(pos, depth - 1, minScore)
            unmakeMove(pos, moves[i])
            if(score >= maxScore) return score
            if(score < minScore) minScore = score
        }

        return minScore
    }

    function countScore(pos){
        let score = 0
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                if(pos[y][x] === "a") score++
                else if(pos[y][x] === "e") score--
                else if(pos[y][x] === "A") score += 7
                else if(pos[y][x] === "E") score -= 7
            }
        }
        return score
    }

    function makeMove(pos, move){
        let lastElementIndex = move.length - 1
        if(move[lastElementIndex]["y"] === 7 && move[0]["originalPiece"] === "a") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "A"
        else if(move[lastElementIndex]["y"] === 0 && move[0]["originalPiece"] === "e") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "E"
        else pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = move[0]["originalPiece"]
        for(let i = 0; i < lastElementIndex; i++){
            pos[move[i]["y"]][move[i]["x"]] = "*"
        }
    }

    function unmakeMove(pos, move){
        for(let i = 0; i < move.length; i++){
            pos[move[i]["y"]][move[i]["x"]] = move[i]["originalPiece"]
        }
    }
}

module.exports = { getBestMove }