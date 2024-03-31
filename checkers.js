function getMoves(position, forcedCaptures, canCaptureBackwards) {
    let hasToCapture = false
    let moves = []

    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++){
            if(position[y][x] === "a"){
                const res = getPeasantMoves(deepCopyArray(position), x, y, hasToCapture, forcedCaptures, canCaptureBackwards)
                if(res.hasToCapture == true && hasToCapture == false){
                    moves = []
                    hasToCapture = true
                }
                moves = moves.concat(res.moves)
            }
            else if(position[y][x] === "A"){
                const res = getKingMoves(deepCopyArray(position), x, y, hasToCapture, forcedCaptures)
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
    position[y][x] = "*"
    let moves = getPeasantCaptures(position, x, y, [[y, x]])

    if(moves.length !== 0) {
        hasToCapture = forcedCaptures
    }

    if(!hasToCapture){
        if(x - 1 > -1 && y + 1 < 8 && position[y + 1][x - 1] === "*"){
            moves.push([[y, x], [y + 1, x - 1]])
        }
        if(x + 1 < 8 && y + 1 < 8 && position[y + 1][x + 1] === "*"){
            moves.push([[y, x], [y + 1, x + 1]])
        }
    }

    function getPeasantCaptures(pos, x1, y1, capture) {
        let capturesRes = []
    
        if(x1 - 2 > -1 && y1 + 2 < 8 && (pos[y1 + 1][x1 - 1] === "e" || pos[y1 + 1][x1 - 1] === "E") && pos[y1 + 2][x1 - 2] == "*"){
            posCopy = deepCopyArray(pos)
            posCopy[y1 + 1][x1 - 1] = "*"
            let newCapture = capture.concat([[y1 + 1, x1 - 1], [y1 + 2, x1 - 2]])
            let search = getPeasantCaptures(posCopy, x1 - 2, y1 + 2, newCapture)
            if(search.length === 0) capturesRes.push(newCapture)
            else {
                if(!forcedCaptures) capturesRes.push(newCapture)
                for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
            }
        }
    
        if(x1 + 2 < 8 && y1 + 2 < 8 && (pos[y1 + 1][x1 + 1] === "e" || pos[y1 + 1][x1 + 1] === "E") && pos[y1 + 2][x1 + 2] === "*"){
            posCopy = deepCopyArray(pos)
            posCopy[y1 + 1][x1 + 1] = "*"
            let newCapture = capture.concat([[y1 + 1, x1 + 1], [y1 + 2, x1 + 2]])
            let search = getPeasantCaptures(posCopy, x1 + 2, y1 + 2, newCapture)
            if(search.length === 0) capturesRes.push(newCapture)
            else {
                if(!forcedCaptures) capturesRes.push(newCapture)
                for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
            }
        }
    
        if(canCaptureBackwards) {
            if(x1 - 2 > -1 && y1 - 2 > -1 && (pos[y1 - 1][x1 - 1] === "e" || pos[y1 - 1][x1 - 1] === "E") && pos[y1 - 2][x1 - 2] === "*"){
                posCopy = deepCopyArray(pos)
                posCopy[y1 - 1][x1 - 1] = "*"
                let newCapture = capture.concat([[y1 - 1, x1 - 1], [y1 - 2, x1 - 2]])
                let search = getPeasantCaptures(posCopy, x1 - 2, y1 - 2, newCapture)
                if(search.length === 0) capturesRes.push(newCapture)
                else {
                    if(!forcedCaptures) capturesRes.push(newCapture)
                    for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                }
            }
    
            if(x1 + 2 < 8 && y1 - 2 > -1 && (pos[y1 - 1][x1 + 1] === "e" || pos[y1 - 1][x1 + 1] === "E") && pos[y1 - 2][x1 + 2] === "*"){
                let newCapture = capture.concat([[y1 - 1, x1 + 1], [y1 - 2, x1 + 2]])
                posCopy = deepCopyArray(pos)
                posCopy[y1 - 1][x1 + 1] = "*"
                let search = getPeasantCaptures(posCopy, x1 + 2, y1 - 2, newCapture)
                if(search.length === 0) capturesRes.push(newCapture)
                else {
                    if(!forcedCaptures) capturesRes.push(newCapture)
                    for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                }
            }
        }
        return capturesRes
    }

    return {"moves": moves, "hasToCapture": hasToCapture}
}

function getKingMoves(position, x, y, hasToCapture, forcedCaptures) {
    position[y][x] = "*"
    let moves = getKingCaptures(position, x, y, [[y, x]])

    if(moves.length !== 0){
        hasToCapture = forcedCaptures
    }

    if(!hasToCapture){
        let x1 = x + 1
        let y1 = y + 1
        while(x1 < 8 && y1 < 8 && position[y1][x1] === "*") {
            moves.push([[y, x], [x1, y1]])
            x1++
            y1++
        }

        x1 = x + 1
        y1 = y - 1
        while(x1 < 8 && y1 > -1 && position[y1][x1] === "*") {
            moves.push([[y, x], [x1, y1]])
            x1++
            y1--
        }

        x1 = x - 1
        y1 = y + 1
        while(x1 > -1 && y1 < 8 && position[y1][x1] === "*") {
            moves.push([[y, x], [x1, y1]])
            x1--
            y1++
        }

        x1 = x - 1
        y1 = y - 1
        while(x1 > -1 && y1 > -1 && position[y1][x1] === "*") {
            moves.push([[y, x], [x1, y1]])
            x1--
            y1--
        }
    }

    function getKingCaptures(pos, x1, y1, capture){
        let capturesRes = []

        let x2 = x1 + 1
        let y2 = y1 + 1
        while(x2 < 8 && y2 < 8) {
            if(pos[y2][x2] === "a" || pos[y2][x2] === "A") break
            if(pos[y2][x2] === "e" || pos[y2][x2] === "E") {
                posCopy = deepCopyArray(pos)
                let x3 = x2 + 1
                let y3 = y2 + 1
                while(x3 < 8 && y3 < 8 && posCopy[y3][x3] === "*") {
                    let newCapture = capture.concat([[y2, x2], [y3, x3]])
                    posCopy[y2][x2] = "*"
                    let search = getKingCaptures(posCopy, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3++
                    y3++
                }
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
                posCopy = deepCopyArray(pos)
                let x3 = x2 + 1
                let y3 = y2 - 1
                while(x3 < 8 && y3 > -1 && posCopy[y3][x3] === "*") {
                    let newCapture = capture.concat([[y2, x2], [y3, x3]])
                    posCopy[y2][x2] = "*"
                    let search = getKingCaptures(posCopy, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3++
                    y3--
                }
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
                posCopy = deepCopyArray(pos)
                let x3 = x2 - 1
                let y3 = y2 + 1
                while(x3 > -1 && y3 < 8 && posCopy[y3][x3] === "*") {
                    let newCapture = capture.concat([[y2, x2], [y3, x3]])
                    posCopy[y2][x2] = "*"
                    let search = getKingCaptures(posCopy, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3--
                    y3++
                }
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
                let posCopy = deepCopyArray(pos)
                let x3 = x2 - 1
                let y3 = y2 - 1
                while(x3 > -1 && y3 > -1 && posCopy[y3][x3] === "*") {
                    let newCapture = capture.concat([[y2, x2], [y3, x3]])
                    posCopy[y2][x2] = "*"
                    let search = getKingCaptures(posCopy, x3, y3, newCapture)
                    if(search.length === 0) capturesRes.push(newCapture)
                    else {
                        if(!forcedCaptures) capturesRes.push(newCapture)
                        for(let i = 0; i < search.length; i++) capturesRes.push(search[i])
                    }
                    x3--
                    y3--
                }
                break
            }
            x2--
            y2--
        }

        return capturesRes
    }

    return {"moves": moves, "hasToCapture": hasToCapture}
}

function deepCopyArray(arr) {
    let copy = []
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            copy[i] = deepCopyArray(arr[i]);
        } else {
            copy[i] = arr[i];
        }
    }
    return copy
}

module.exports = { getMoves }