const checkers = require("./engine")

function getBestMove(position, player = "w", forcedCaptures = false, canCaptureBackwards = false, flyingKing = false, maxCaptures = false, depth = 6) {
    let potentialMoves = checkers.getMoves(position, player, forcedCaptures, canCaptureBackwards, flyingKing, maxCaptures).moves
    if (potentialMoves.length === 0) {
        return null
    }
    if (potentialMoves.length === 1) {
        return potentialMoves[0]
    }

    // randomize moves to get some variance in played moves
    potentialMoves = shuffle(potentialMoves)
    
    let bestMove = []
    let highestScore = -10000000
    let lowestScore = 10000000

    // minimax search
    for (let move of potentialMoves) {
        checkers.makeMove(position, move)
        let score = search(position, depth - 1, highestScore, lowestScore, getOpponent(player));
        checkers.unmakeMove(position, move)
        if (player === "w" && score > highestScore) {
            highestScore = score;
            bestMove = move
        } else if (player === "b" && score < lowestScore) {
            lowestScore = score
            bestMove = move
        }
    }

    return bestMove

    function search(pos, depth, alpha, beta, player) {
        if (depth === 0) return countScore(pos, player)
        let moves = checkers.getMoves(pos, player, forcedCaptures, canCaptureBackwards, flyingKing, maxCaptures).moves
        // if there aren't any moves the player lost
        if (moves.length === 0) {
            if (player === "w") return -1000000
            else return 1000000
        }

        if (player === "w") {
            for (let move of moves) {
                checkers.makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, "b")
                checkers.unmakeMove(pos, move)
                alpha = Math.max(alpha, score)
                if (alpha >= beta) break
            }
            return alpha
        } else {
            for (let move of moves) {
                checkers.makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, "w")
                checkers.unmakeMove(pos, move)
                beta = Math.min(beta, score)
                if (beta <= alpha) break
            }
            return beta
        }
    }

    function countScore(pos) {
        let score = 0;
        let foundBlack = false
        let foundWhite = false
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (pos[y][x] === "b") {
                    foundBlack = true
                    score -= 100
                }
                else if (pos[y][x] === "w") {
                    foundWhite = true
                    score += 100
                }
                else if (pos[y][x] === "B") {
                    foundBlack = true
                    if(flyingKing) score -= 1000
                    else score -= 300
                }
                else if (pos[y][x] === "W") {
                    foundWhite = true
                    if(flyingKing) score += 1000
                    else score += 300
                }
            }
        }
        if(!foundBlack) return 1000000
        if(!foundWhite) return -1000000
        return score
    }

    function getOpponent(player) {
        return player === "b" ? "w" : "b"
    }
}

function shuffle(array) { 
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = { getBestMove }