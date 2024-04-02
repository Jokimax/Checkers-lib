function getMoves(position, pieceType, forcedCaptures, canCaptureBackwards) {
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
                const res = getKingMoves(position, x, y, pieceType, hasToCapture, forcedCaptures)
                if (res.hasToCapture && !hasToCapture) {
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
        }
    }

    return moves
}


function getPeasantMoves(position, x, y, pieceType, hasToCapture, forcedCaptures, canCaptureBackwards) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getPieceCaptures(position, x, y, pieceType, [{"x": x, "y": y, "originalPiece": originalPiece}], canCaptureBackwards)

    if (moves.length !== 0) {
        hasToCapture = forcedCaptures
    }

    if (!hasToCapture) {
        let forwardY = pieceType === "b" ? y + 1 : y - 1
        if (x - 1 >= 0 && x - 1 < 8 && forwardY >= 0 && forwardY < 8 && position[forwardY][x - 1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x - 1, "y": forwardY, "originalPiece": "*"}])
        }
        if (x + 1 >= 0 && x + 1 < 8 && forwardY >= 0 && forwardY < 8 && position[forwardY][x + 1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x + 1, "y": forwardY, "originalPiece": "*"}])
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getPieceCaptures(pos, x1, y1, pieceType, capture, canCaptureBackwards) {
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
                    ((pieceType === "b" && (pos[enemyY][enemyX] === "w" || pos[enemyY][enemyX] === "W")) ||
                    (pieceType === "w" && (pos[enemyY][enemyX] === "b" || pos[enemyY][enemyX] === "B"))) &&
                    pos[nextY][nextX] === "*") {
                    let capturedPiece = pos[enemyY][enemyX]
                    pos[enemyY][enemyX] = "*"
                    let newCapture = capture.concat([{"x": enemyX, "y": enemyY, "originalPiece": capturedPiece}, {"x": nextX, "y": nextY, "originalPiece": "*"}])
                    let search = getPieceCaptures(pos, nextX, nextY, pieceType, newCapture, canCaptureBackwards)
                    if (search.length === 0) capturesRes.push(newCapture)
                    else {
                        if (!forcedCaptures) capturesRes.push(newCapture)
                        for (let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    pos[enemyY][enemyX] = capturedPiece
                }
            }
        }
        return capturesRes;
    }
}

function getKingMoves(position, x, y, pieceType, hasToCapture, forcedCaptures) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getKingCaptures(position, x, y, pieceType, [{"x": x, "y": y, "originalPiece": originalPiece}])

    if (moves.length !== 0) {
        hasToCapture = forcedCaptures
    }

    if (!hasToCapture) {
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
                x1 += direction.dx;
                y1 += direction.dy;
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
    
        for (let direction of directions) {
            let x = x1 + direction.dx
            let y = y1 + direction.dy
    
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if ((pieceType === "b" && (pos[y][x] === "w" || pos[y][x] === "W")) ||
                    (pieceType === "w" && (pos[y][x] === "b" || pos[y][x] === "B"))) {
                    let capturedPiece = pos[y][x]
                    let nx = x + direction.dx
                    let ny = y + direction.dy
    
                    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && pos[ny][nx] === "*") {
                        let newCapture = capture.concat([{ "x": x, "y": y, "originalPiece": capturedPiece }, { "x": nx, "y": ny, "originalPiece": "*" }])
                        pos[y][x] = "*"
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
    
        return capturesRes
    }    
}

module.exports = { getMoves }