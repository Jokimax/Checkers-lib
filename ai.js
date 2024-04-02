const checkers = require("./checkers")

function getBestMove(position, forcedCaptures, canCaptureBackwards, depth){
    let potentialMoves = checkers.getMoves(position, "a", forcedCaptures, canCaptureBackwards)
    if(potentialMoves.length === 1){
        return potentialMoves[0]
    }

    let bestMove = []
    let highestScore = -1000000
    let lowestScore = 1000000
    
    for(let i = 0; i < potentialMoves.length; i++) { 
        makeMove(position, potentialMoves[i])
        let score = search(position, depth - 1, highestScore, lowestScore, "e")
        unmakeMove(position, potentialMoves[i])
        if(score > highestScore){
            highestScore = score
            bestMove = potentialMoves[i]
        }
    }

    return bestMove

    function search(pos, depth, alpha, beta, player) {
        let moves
        if (player === 'a') {
            moves = checkers.getMoves(pos, 'a', forcedCaptures, canCaptureBackwards)
            if (moves.length === 0) return -100000
        } else {
            moves = checkers.getMoves(pos, 'e', forcedCaptures, canCaptureBackwards)
            if (moves.length === 0) return 100000
        }
    
        if (depth === 0) return countScore(pos, player)
    
        if (player === 'a') {
            for (let move of moves) {
                makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, 'e')
                unmakeMove(pos, move)
                alpha = Math.max(alpha, score)
                if (alpha >= beta) return alpha
            }
            return alpha
        } else {
            for (let move of moves) {
                makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, 'a')
                unmakeMove(pos, move)
                beta = Math.min(beta, score)
                if (beta <= alpha) return beta
            }
            return beta
        }
    }    

    function countScore(pos){
        let score = 0
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                if(pos[y][x] === "a") score++
                else if(pos[y][x] === "e") score--
                else if(pos[y][x] === "A") score += 10
                else if(pos[y][x] === "E") score -= 10
            }
        }
        return score
    }
}

function getBestMoveOpponent(position, forcedCaptures, canCaptureBackwards, depth){
    let potentialMoves = checkers.getMoves(position, "e", forcedCaptures, canCaptureBackwards)
    if(potentialMoves.length === 1){
        return potentialMoves[0]
    }

    let bestMove = []
    let highestScore = -1000000
    let lowestScore = 1000000
    

    for(let i = 0; i < potentialMoves.length; i++) { 
        makeMove(position, potentialMoves[i])
        let score = search(position, depth - 1, highestScore, lowestScore, "a")
        unmakeMove(position, potentialMoves[i])
        if(score > highestScore){
            highestScore = score
            bestMove = potentialMoves[i]
        }
    }

    return bestMove

    function search(pos, depth, alpha, beta, player) {
        let moves
        if (player === 'e') {
            moves = checkers.getMoves(pos, 'e', forcedCaptures, canCaptureBackwards)
            if (moves.length === 0) return -100000
        } else {
            moves = checkers.getMoves(pos, 'a', forcedCaptures, canCaptureBackwards)
            if (moves.length === 0) return 100000
        }
    
        if (depth === 0) return countScore(pos, player)
    
        if (player === 'e') {
            for (let move of moves) {
                makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, 'a')
                unmakeMove(pos, move)
                alpha = Math.max(alpha, score)
                if (alpha >= beta) return alpha
            }
            return alpha
        } else {
            for (let move of moves) {
                makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, 'e')
                unmakeMove(pos, move)
                beta = Math.min(beta, score)
                if (beta <= alpha) return beta
            }
            return beta;
        }
    }   

    function countScore(pos){
        let score = 0
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                if(pos[y][x] === "a") score--
                else if(pos[y][x] === "e") score++
                else if(pos[y][x] === "A") score -= 10
                else if(pos[y][x] === "E") score += 10
            }
        }
        return score
    }
}

function makeMove(pos, move) {
    let lastElementIndex = move.length - 1
    if(move[lastElementIndex]["y"] === 7 && move[0]["originalPiece"] === "a") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "A"
    else if(move[lastElementIndex]["y"] === 0 && move[0]["originalPiece"] === "e") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "E"
    else pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = move[0]["originalPiece"]
    for(let i = 0; i < lastElementIndex; i++){
        pos[move[i]["y"]][move[i]["x"]] = "*"
    }
}

function unmakeMove(pos, move) {
    for(let i = 0; i < move.length; i++){
        pos[move[i]["y"]][move[i]["x"]] = move[i]["originalPiece"]
    }
}

module.exports = { getBestMove, getBestMoveOpponent,  }