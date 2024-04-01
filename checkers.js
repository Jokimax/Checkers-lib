const utils = require("./utils")

function getMoves(position, forcedCaptures, canCaptureBackwards) {
    let hasToCapture = false
    let moves = []

    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++){
            if(position[y][x] === "a"){
                const res = getPeasantMoves(position, x, y, hasToCapture, forcedCaptures, canCaptureBackwards)
                if(res.hasToCapture == true && hasToCapture == false){
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
            else if(position[y][x] === "A"){
                const res = getKingMoves(position, x, y, hasToCapture, forcedCaptures)
                if(res.hasToCapture == true && hasToCapture == false){
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
        }
    }

    return moves
}

function getPeasantMoves(position, x, y, hasToCapture, forcedCaptures, canCaptureBackwards) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getPeasantCaptures(position, x, y, [{"x": x, "y": y, "originalPiece": originalPiece}])

    if(moves.length !== 0) {
        hasToCapture = forcedCaptures
    }

    if(!hasToCapture){
        if(x - 1 !== -1 && y + 1 !== 8 && position[y + 1][x - 1] === "*"){
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x - 1, "y": y + 1, "originalPiece": "*"}])
        }
        if(x + 1 !== 8 && y + 1 !== 8 && position[y + 1][x + 1] === "*"){
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x + 1, "y": y + 1, "originalPiece": "*"}])
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getPeasantCaptures(pos, x1, y1, capture) {
        let capturesRes = []
    
        if(x1 - 2 > -1 && y1 + 2 < 8 && (pos[y1 + 1][x1 - 1] === "e" || pos[y1 + 1][x1 - 1] === "E") && pos[y1 + 2][x1 - 2] == "*"){
            let capturedPiece = pos[y1 + 1][x1 - 1]
            pos[y1 + 1][x1 - 1] = "*"
            let newCapture = capture.concat([{"x": x1 - 1, "y": y1 + 1, "originalPiece": capturedPiece}, {"x": x1 - 2, "y": y1 + 2, "originalPiece": "*"}])
            let search = getPeasantCaptures(pos, x1 - 2, y1 + 2, newCapture)
            if(search.length === 0) capturesRes.push(newCapture)
            else {
                if(!forcedCaptures) capturesRes.push(newCapture)
                for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
            }
            pos[y1 + 1][x1 - 1] = capturedPiece
        }
    
        if(x1 + 2 < 8 && y1 + 2 < 8 && (pos[y1 + 1][x1 + 1] === "e" || pos[y1 + 1][x1 + 1] === "E") && pos[y1 + 2][x1 + 2] === "*"){
            let capturedPiece = pos[y1 + 1][x1 + 1]
            pos[y1 + 1][x1 + 1] = "*"
            let newCapture = capture.concat([{"x": x1 + 1, "y": y1 + 1, "originalPiece": capturedPiece}, {"x": x1 + 2, "y": y1 + 2, "originalPiece": "*"}])
            let search = getPeasantCaptures(pos, x1 + 2, y1 + 2, newCapture)
            if(search.length === 0) capturesRes.push(newCapture)
            else {
                if(!forcedCaptures) capturesRes.push(newCapture)
                for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
            }
            pos[y1 + 1][x1 + 1] = capturedPiece
        }
    
        if(canCaptureBackwards) {
            if(x1 - 2 > -1 && y1 - 2 > -1 && (pos[y1 - 1][x1 - 1] === "e" || pos[y1 - 1][x1 - 1] === "E") && pos[y1 - 2][x1 - 2] === "*"){
                let capturedPiece = pos[y1 - 1][x1 - 1]
                pos[y1 - 1][x1 - 1] = "*"
                let newCapture = capture.concat([{"x": x1 - 1, "y": y1 - 1, "originalPiece": capturedPiece}, {"x": x1 - 2, "y": y1 - 2, "originalPiece": "*"}])
                let search = getPeasantCaptures(pos, x1 - 2, y1 - 2, newCapture)
                if(search.length === 0) capturesRes.push(newCapture)
                else {
                    if(!forcedCaptures) capturesRes.push(newCapture)
                    for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                }
                pos[y1 - 1][x1 - 1] = capturedPiece
            }
    
            if(x1 + 2 < 8 && y1 - 2 > -1 && (pos[y1 - 1][x1 + 1] === "e" || pos[y1 - 1][x1 + 1] === "E") && pos[y1 - 2][x1 + 2] === "*"){
                let capturedPiece = pos[y1 - 1][x1 + 1]
                pos[y1 - 1][x1 + 1] = "*"
                let newCapture = capture.concat([{"x": x1 + 1, "y": y1 - 1, "originalPiece": capturedPiece}, {"x": x1 + 2, "y": y1 - 2, "originalPiece": "*"}])
                let search = getPeasantCaptures(pos, x1 + 2, y1 - 2, newCapture)
                if(search.length === 0) capturesRes.push(newCapture)
                else {
                    if(!forcedCaptures) capturesRes.push(newCapture)
                    for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                }
                pos[y1 - 1][x1 + 1] = capturedPiece
            }
        }
        return capturesRes
    }
}

function getKingMoves(position, x, y, hasToCapture, forcedCaptures) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getKingCaptures(position, x, y, [{"x": x, "y": y, "originalPiece": originalPiece}])

    if(moves.length !== 0){
        hasToCapture = forcedCaptures
    }

    if(!hasToCapture){
        let x1 = x + 1
        let y1 = y + 1
        while(x1 < 8 && y1 < 8 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1++
            y1++
        }

        x1 = x + 1
        y1 = y - 1
        while(x1 < 8 && y1 > -1 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1++
            y1--
        }

        x1 = x - 1
        y1 = y + 1
        while(x1 > -1 && y1 < 8 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1--
            y1++
        }

        x1 = x - 1
        y1 = y - 1
        while(x1 > -1 && y1 > -1 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1--
            y1--
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getKingCaptures(pos, x1, y1, capture){
        let capturesRes = []

        let x2 = x1 + 1
        let y2 = y1 + 1
        while(x2 < 8 && y2 < 8) {
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") break
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 + 1
                let y3 = y2 + 1
                while(x3 < 8 && y3 < 8 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3++
                    y3++
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2++
            y2++
        }

        x2 = x1 + 1
        y2 = y1 - 1
        while(x2 < 8 && y2 > -1) {
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") break
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 + 1
                let y3 = y2 - 1
                while(x3 < 8 && y3 > -1 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3++
                    y3--
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2++
            y2--
        }

        x2 = x1 - 1
        y2 = y1 + 1
        while(x2 > -1 && y2 < 8) {
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") break
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 - 1
                let y3 = y2 + 1
                while(x3 > -1 && y3 < 8 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3--
                    y3++
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2--
            y2++
        }

        x2 = x1 - 1
        y2 = y1 - 1
        while(x2 > -1 && y2 > -1) {
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") break
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 - 1
                let y3 = y2 - 1
                while(x3 > -1 && y3 > -1 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3--
                    y3--
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2--
            y2--
        }

        return capturesRes
    }
}

function getOpponentMoves(position, forcedCaptures, canCaptureBackwards) {
    let hasToCapture = false
    let moves = []

    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++){
            if(position[y][x] === "e"){
                const res = getOpponentPeasantMoves(position, x, y, hasToCapture, forcedCaptures, canCaptureBackwards)
                if(res.hasToCapture == true && hasToCapture == false){
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
            else if(position[y][x] === "E"){
                const res = getOpponentKingMoves(position, x, y, hasToCapture, forcedCaptures)
                if(res.hasToCapture == true && hasToCapture == false){
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
        }
    }

    return moves
}

function getOpponentPeasantMoves(position, x, y, hasToCapture, forcedCaptures, canCaptureBackwards) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getPeasantCaptures(position, x, y, [{"x": x, "y": y, "originalPiece": originalPiece}])

    if(moves.length !== 0) {
        hasToCapture = forcedCaptures
    }

    if(!hasToCapture){
        if(x + 1 !== 8 && y - 1 !== -1 && position[y - 1][x + 1] === "*"){
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x + 1, "y": y - 1, "originalPiece": "*"}])
        }
        if(x - 1 !== -1 && y - 1 !== -1 && position[y - 1][x - 1] === "*"){
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x - 1, "y": y - 1, "originalPiece": "*"}])
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getPeasantCaptures(pos, x1, y1, capture) {
        let capturesRes = []
    
        if(x1 - 2 > -1 && y1 - 2 > -1 && (pos[y1 - 1][x1 - 1] === "a" || pos[y1 - 1][x1 - 1] === "A") && pos[y1 - 2][x1 - 2] == "*"){
            let capturedPiece = pos[y1 - 1][x1 - 1]
            pos[y1 - 1][x1 - 1] = "*"
            let newCapture = capture.concat([{"x": x1 - 1, "y": y1 - 1, "originalPiece": capturedPiece}, {"x": x1 - 2, "y": y1 - 2, "originalPiece": "*"}])
            let search = getPeasantCaptures(pos, x1 - 2, y1 - 2, newCapture)
            if(search.length === 0) capturesRes.push(newCapture)
            else {
                if(!forcedCaptures) capturesRes.push(newCapture)
                for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
            }
            pos[y1 - 1][x1 - 1] = capturedPiece
        }
    
        if(x1 + 2 < 8 && y1 - 2 > -1 && (pos[y1 - 1][x1 + 1] === "a" || pos[y1 - 1][x1 + 1] === "A") && pos[y1 - 2][x1 + 2] === "*"){
            let capturedPiece = pos[y1 - 1][x1 + 1] 
            pos[y1 - 1][x1 + 1] = "*"
            let newCapture = capture.concat([{"x": x1 + 1, "y": y1 - 1, "originalPiece": capturedPiece}, {"x": x1 + 2, "y": y1 - 2, "originalPiece": "*"}])
            let search = getPeasantCaptures(pos, x1 + 2, y1 +- 2, newCapture)
            if(search.length === 0) capturesRes.push(newCapture)
            else {
                if(!forcedCaptures) capturesRes.push(newCapture)
                for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
            }
            pos[y1 - 1][x1 + 1] = capturedPiece
        }
    
        if(canCaptureBackwards) {
            if(x1 - 2 > -1 && y1 + 2 < 8 && (pos[y1 + 1][x1 - 1] === "a" || pos[y1 + 1][x1 - 1] === "A") && pos[y1 + 2][x1 - 2] === "*"){
                let capturedPiece = pos[y1 + 1][x1 - 1]
                pos[y1 + 1][x1 - 1] = "*"
                let newCapture = capture.concat([{"x": x1 - 1, "y": y1 + 1, "originalPiece": capturedPiece}, {"x": x1 - 2, "y": y1 + 2, "originalPiece": "*"}])
                let search = getPeasantCaptures(pos, x1 - 2, y1 + 2, newCapture)
                if(search.length === 0) capturesRes.push(newCapture)
                else {
                    if(!forcedCaptures) capturesRes.push(newCapture)
                    for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                }
                pos[y1 + 1][x1 - 1] = capturedPiece
            }
    
            if(x1 + 2 < 8 && y1 + 2 < 8 && (pos[y1 + 1][x1 + 1] === "a" || pos[y1 + 1][x1 + 1] === "A") && pos[y1 + 2][x1 + 2] === "*"){
                let capturedPiece = pos[y1 + 1][x1 + 1]
                pos[y1 + 1][x1 + 1] = "*"
                let newCapture = capture.concat([{"x": x1 + 1, "y": y1 + 1, "originalPiece": capturedPiece}, {"x": x1 + 2, "y": y1 + 2, "originalPiece": "*"}])
                let search = getPeasantCaptures(pos, x1 + 2, y1 + 2, newCapture)
                if(search.length === 0) capturesRes.push(newCapture)
                else {
                    if(!forcedCaptures) capturesRes.push(newCapture)
                    for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                }
                pos[y1 + 1][x1 + 1] = capturedPiece
            }
        }
        return capturesRes
    }
}

function getOpponentKingMoves(position, x, y, hasToCapture, forcedCaptures) {
    let originalPiece = position[y][x]
    position[y][x] = "*"
    let moves = getKingCaptures(position, x, y, [{"x": x, "y": y, "originalPiece": originalPiece}])

    if(moves.length !== 0){
        hasToCapture = forcedCaptures
    }

    if(!hasToCapture){
        let x1 = x + 1
        let y1 = y + 1
        while(x1 < 8 && y1 < 8 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1++
            y1++
        }

        x1 = x + 1
        y1 = y - 1
        while(x1 < 8 && y1 > -1 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1++
            y1--
        }

        x1 = x - 1
        y1 = y + 1
        while(x1 > -1 && y1 < 8 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1--
            y1++
        }

        x1 = x - 1
        y1 = y - 1
        while(x1 > -1 && y1 > -1 && position[y1][x1] === "*") {
            moves.push([{"x": x, "y": y, "originalPiece": originalPiece}, {"x": x1, "y": y1, "originalPiece": "*"}])
            x1--
            y1--
        }
    }

    position[y][x] = originalPiece

    return {"moves": moves, "hasToCapture": hasToCapture}

    function getKingCaptures(pos, x1, y1, capture){
        let capturesRes = []

        let x2 = x1 + 1
        let y2 = y1 + 1
        while(x2 < 8 && y2 < 8) {
            if(pos[y2][x2] === "e" || pos[y2][x2] === "e") break
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 + 1
                let y3 = y2 + 1
                while(x3 < 8 && y3 < 8 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3++
                    y3++
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2++
            y2++
        }

        x2 = x1 + 1
        y2 = y1 - 1
        while(x2 < 8 && y2 > -1) {
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") break
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 + 1
                let y3 = y2 - 1
                while(x3 < 8 && y3 > -1 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3++
                    y3--
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2++
            y2--
        }

        x2 = x1 - 1
        y2 = y1 + 1
        while(x2 > -1 && y2 < 8) {
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") break
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 - 1
                let y3 = y2 + 1
                while(x3 > -1 && y3 < 8 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3--
                    y3++
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2--
            y2++
        }

        x2 = x1 - 1
        y2 = y1 - 1
        while(x2 > -1 && y2 > -1) {
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") break
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") {
                let capturedPiece = pos[y2][x2]
                let x3 = x2 - 1
                let y3 = y2 - 1
                while(x3 > -1 && y3 > -1 && pos[y3][x3] === "*") {
                    let newCapture = capture.concat([{"x": x2, "y": y2, "originalPiece": capturedPiece}, {"x": x3, "y": y3, "originalPiece": "*"}])
                    pos[y2][x2] = "*"
                    let search = getKingCaptures(pos, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3--
                    y3--
                }
                pos[y2][x2] = capturedPiece
                break
            }
            x2--
            y2--
        }

        return capturesRes
    }
}

module.exports = { getMoves, getOpponentMoves }