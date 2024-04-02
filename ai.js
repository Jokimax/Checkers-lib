const checkers = require("./checkers")

function getBestMove(position, player, forcedCaptures, canCaptureBackwards, depth) {
    let potentialMoves = checkers.getMoves(position, player, forcedCaptures, canCaptureBackwards)
    if (potentialMoves.length === 1) {
        return potentialMoves[0]
    }

    let bestMove = []
    let highestScore = -1000000
    let lowestScore = 1000000

    for (let move of potentialMoves) {
        makeMove(position, move)
        let score = search(position, depth - 1, highestScore, lowestScore, getOpponent(player));
        unmakeMove(position, move)
        if (player === "w" && score > highestScore) {
            highestScore = score;
            bestMove = move
        } else if (player === "b" && score < lowestScore) {
            lowestScore = score
            bestMove = move
        }
    }

    return bestMove;

    function search(pos, depth, alpha, beta, player) {
        let moves = checkers.getMoves(pos, player, forcedCaptures, canCaptureBackwards);
        if (moves.length === 0) {
            if (player === "w") return -100000
            else return 100000
        }

        if (depth === 0) return countScore(pos, player);

        if (player === "w") {
            for (let move of moves) {
                makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, "b")
                unmakeMove(pos, move)
                alpha = Math.max(alpha, score)
                if (alpha >= beta) return alpha
            }
            return alpha
        } else {
            for (let move of moves) {
                makeMove(pos, move)
                let score = search(pos, depth - 1, alpha, beta, "w")
                unmakeMove(pos, move)
                beta = Math.min(beta, score)
                if (beta <= alpha) return beta
            }
            return beta
        }
    }

    function countScore(pos) {
        let score = 0;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (pos[y][x] === "b") score -= 100
                else if (pos[y][x] === "w") score += 100
                else if (pos[y][x] === "B") score -= 1000
                else if (pos[y][x] === "W") score += 1000
            }
        }
        return score
    }

    function getOpponent(player) {
        return player === "b" ? "w" : "b"
    }
}


function makeMove(pos, move) {
    let lastElementIndex = move.length - 1
    if(move[lastElementIndex]["y"] === 7 && move[0]["originalPiece"] === "b") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "B"
    else if(move[lastElementIndex]["y"] === 0 && move[0]["originalPiece"] === "w") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "W"
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

module.exports = { getBestMove }