// get all posible moves in a position for a certain color
function getMoves(position, pieceType = "w", forcedCaptures = false, canCaptureBackwards = false, flyingKing = false, maxCaptures = false) {
    let hasToCapture = false
    let moves = []

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if ((pieceType === "b" && position[y][x] === "b") || (pieceType === "w" && position[y][x] === "w")) {
                const res = getPeasantMoves(position, x, y, pieceType, hasToCapture, forcedCaptures, canCaptureBackwards)
                if (res.hasToCapture && !hasToCapture) {
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves);
            } else if ((pieceType === "b" && position[y][x] === "B") || (pieceType === "w" && position[y][x] === "W")) {
                const res = getKingMoves(position, x, y, pieceType, hasToCapture, forcedCaptures, flyingKing)
                if (res.hasToCapture && !hasToCapture) {
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
        }
    }

    if(maxCaptures) moves = getMaxCaptures(moves)
    return { "moves": moves, "hasToCapture": hasToCapture }
}

// get all moves for piece at a certain position
function getPieceMoves(position, x, y, hasToCapture = false, forcedCaptures = false, canCaptureBackwards = false, flyingKing = false, maxCaptures = false){
    let moves = []
    if (position[y][x] === "b" || position[y][x] === "w") {
        const res = getPeasantMoves(position, x, y, position[y][x], hasToCapture, forcedCaptures, canCaptureBackwards)
        if (res.hasToCapture && !hasToCapture) {
            moves = []
            hasToCapture = true
        }
        moves = moves.concat(res.moves);
    } else if (position[y][x] === "W") {
        const res = getKingMoves(position, x, y, "w", hasToCapture, forcedCaptures, flyingKing)
        if (res.hasToCapture && !hasToCapture) {
            moves = []
            hasToCapture = true
        }
        moves = moves.concat(res.moves)
    } else if (position[y][x] === "B") {
        const res = getKingMoves(position, x, y, "b", hasToCapture, forcedCaptures, flyingKing)
        if (res.hasToCapture && !hasToCapture) {
            moves = []
            hasToCapture = true
        }
        moves = moves.concat(res.moves)
    } 
    if(maxCaptures) moves = getMaxCaptures(moves)
    return {"moves": moves, "hasToCapture": hasToCapture}
}

// gets all peasant moves at a position
function getPeasantMoves(position, x, y, pieceType = "w", hasToCapture = false, forcedCaptures = false, canCaptureBackwards = false) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getPieceCaptures(position, x, y, pieceType, [{"x": x, "y": y, "originalPiece": originalPiece}], canCaptureBackwards)

    if (moves.length !== 0) {
        hasToCapture = forcedCaptures
    }

    if (!hasToCapture) {
        // white moves forward, black moves back
        let forwardY = pieceType === "b" ? y + 1 : y - 1
        if (x - 1 >= 0 && forwardY >= 0 && forwardY < 8 && position[forwardY][x - 1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x - 1, "y": forwardY, "originalPiece": "*"}])
        }
        if (x + 1 < 8 && forwardY >= 0 && forwardY < 8 && position[forwardY][x + 1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x + 1, "y": forwardY, "originalPiece": "*"}])
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getPieceCaptures(pos, x1, y1, pieceType, capture) {
        let capturesRes = []
        let directions = [-1, 1]
        let backwardDirection = canCaptureBackwards ? [-1, 1] : [pieceType === "b" ? 1 : -1]

        for (let dy of backwardDirection) {
            for (let dx of directions) {
                let nextX = x1 + (2 * dx)
                let nextY = y1 + (2 * dy)
                let enemyX = x1 + dx
                let enemyY = y1 + dy

                if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8 &&
                    // can capture only if the square is a piece of the opposing color and the square after that is empty 
                    ((pieceType === "b" && (pos[enemyY][enemyX] === "w" || pos[enemyY][enemyX] === "W")) ||
                    (pieceType === "w" && (pos[enemyY][enemyX] === "b" || pos[enemyY][enemyX] === "B"))) &&
                    pos[nextY][nextX] === "*") {
                    let capturedPiece = pos[enemyY][enemyX]
                    pos[enemyY][enemyX] = "*"
                    let newCapture = capture.concat([{"x": enemyX, "y": enemyY, "originalPiece": capturedPiece}, {"x": nextX, "y": nextY, "originalPiece": "*"}])
                    // check further captures
                    let search = getPieceCaptures(pos, nextX, nextY, pieceType, newCapture)
                    if (search.length === 0) capturesRes.push(newCapture)
                    else {
                        if (!forcedCaptures) capturesRes.push(newCapture)
                        for (let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    pos[enemyY][enemyX] = capturedPiece
                }
            }
        }
        return capturesRes
    }
}

// gets all king moves at a position
function getKingMoves(position, x, y, pieceType = "w", hasToCapture = false, forcedCaptures = false, flyingKing = false) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getKingCaptures(position, x, y, pieceType, [{"x": x, "y": y, "originalPiece": originalPiece}])

    if (moves.length !== 0) {
        hasToCapture = forcedCaptures
    }
    if (!hasToCapture) {
        if(flyingKing) {
            const directions = [
                { dx: 1, dy: 1 },
                { dx: 1, dy: -1 },
                { dx: -1, dy: 1 },
                { dx: -1, dy: -1 }
            ]
    
            for (let direction of directions) {
                let x1 = x + direction.dx
                let y1 = y + direction.dy
        
                while (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8 && position[y1][x1] === "*") {
                    moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
                    x1 += direction.dx
                    y1 += direction.dy
                }
            }
        }
        else {
            if (x - 1 >= 0 && y - 1 >= 0  && position[y - 1][x - 1] === "*") {
                moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x - 1, "y": y - 1, "originalPiece": "*"}])
            }
            if (x + 1 < 8 && y - 1 >= 0 && position[y - 1][x + 1] === "*") {
                moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x + 1, "y": y - 1, "originalPiece": "*"}])
            }
            if (x - 1 >= 0 && y + 1 < 8  && position[y + 1][x - 1] === "*") {
                moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x - 1, "y": y + 1, "originalPiece": "*"}])
            }
            if (x + 1 < 8 && y + 1 < 8 && position[y + 1][x + 1] === "*") {
                moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x + 1, "y": y + 1, "originalPiece": "*"}])
            }
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getKingCaptures(pos, x1, y1, pieceType, capture) {
        let capturesRes = []
    
        const directions = [
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: -1, dy: -1 }
        ]
        if(flyingKing){
            for (let direction of directions) {
                let x = x1 + direction.dx
                let y = y1 + direction.dy
        
                while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                    // can capture only if the square is a piece of the opposing color and the square after that is empty 
                    if ((pieceType === "b" && (pos[y][x] === "w" || pos[y][x] === "W")) ||
                        (pieceType === "w" && (pos[y][x] === "b" || pos[y][x] === "B"))) {
                        let capturedPiece = pos[y][x]
                        let nx = x + direction.dx
                        let ny = y + direction.dy
        
                        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && pos[ny][nx] === "*") {
                            let newCapture = capture.concat([{ "x": x, "y": y, "originalPiece": capturedPiece }, { "x": nx, "y": ny, "originalPiece": "*" }])
                            pos[y][x] = "*"
                            // check further captures
                            let search = getKingCaptures(pos, nx, ny, pieceType, newCapture)
                            if (search.length === 0) capturesRes.push(newCapture)
                            else {
                                if (!forcedCaptures) capturesRes.push(newCapture)
                                for (let i = 0; i < search.length; i++) capturesRes.push(search[i])
                            }
                            nx += direction.dx
                            ny += direction.dy
                        }
                        pos[y][x] = capturedPiece
                        break
                    }
                    x += direction.dx
                    y += direction.dy
                }
            }
        }
        else {
            for (let direction of directions) {
                let nextX = x1 + (2 * direction.dx)
                let nextY = y1 + (2 * direction.dy)
                let enemyX = x1 + direction.dx
                let enemyY = y1 + direction.dy

                // can capture only if the square is a piece of the opposing color and the square after that is empty 
                if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8 &&
                    ((pieceType === "b" && (pos[enemyY][enemyX] === "w" || pos[enemyY][enemyX] === "W")) ||
                    (pieceType === "w" && (pos[enemyY][enemyX] === "b" || pos[enemyY][enemyX] === "B"))) &&
                    pos[nextY][nextX] === "*") {
                    let capturedPiece = pos[enemyY][enemyX]
                    pos[enemyY][enemyX] = "*"
                    let newCapture = capture.concat([{"x": enemyX, "y": enemyY, "originalPiece": capturedPiece}, {"x": nextX, "y": nextY, "originalPiece": "*"}])
                    // check further captures
                    let search = getKingCaptures(pos, nextX, nextY, pieceType, newCapture)
                    if (search.length === 0) capturesRes.push(newCapture)
                    else {
                        if (!forcedCaptures) capturesRes.push(newCapture)
                        for (let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    pos[enemyY][enemyX] = capturedPiece
                }
            }
        }
    
        return capturesRes
    }    
}

function getMaxCaptures(moves) {
    let resMoves = []
    let maxSize = 2
    for (let move of moves) {
        if(move.length === maxSize) resMoves.push(move)
        else if(move.length > maxSize) {
            resMoves = [move]
            maxSize = move.length
        }
    }
    return resMoves
}

function makeMove(pos, move) {
    let lastElementIndex = move.length - 1
    if(move[lastElementIndex]["y"] === 7 && move[0]["originalPiece"] === "b") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "B"
    else if(move[lastElementIndex]["y"] === 0 && move[0]["originalPiece"] === "w") pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = "W"
    else pos[move[lastElementIndex]["y"]][move[lastElementIndex]["x"]] = move[0]["originalPiece"]
    for(let i = 0; i < lastElementIndex; i++){
        pos[move[i]["y"]][move[i]["x"]] = "*"
    }
    return pos
}

function unmakeMove(pos, move) {
    for(let i = 0; i < move.length; i++){
        pos[move[i]["y"]][move[i]["x"]] = move[i]["originalPiece"]
    }
    return pos
}

module.exports = { getMoves, getPeasantMoves, getKingMoves, getPieceMoves, makeMove, unmakeMove }