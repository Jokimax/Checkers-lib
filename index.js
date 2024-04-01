const ai = require("./ai")
const checkers = require("./checkers")

position = [
    ["*", "*", "*", "a", "*", "a", "*", "a"],
    ["*", "*", "*", "*", "a", "*", "a", "*"],
    ["*", "a", "*", "a", "*", "a", "*", "*"],
    ["a", "*", "a", "*", "*", "*", "a", "*"],
    ["*", "*", "*", "*", "*", "E", "*", "e"],
    ["a", "*", "a", "*", "*", "*", "", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "e"],
    ["e", "*", "e", "*", "e", "*", "*", "*"]
]
    console.time("dbsave")
    console.log(ai.getBestMoveOpponent(position, true, true, 12))
    console.timeEnd("dbsave")