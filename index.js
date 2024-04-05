const ai = require("./ai")
const checkers = require("./checkers")

position = [
    ["*", "b", "*", "b", "*", "b", "*", "b"],
    ["b", "*", "b", "*", "b", "*", "b", "*"],
    ["*", "b", "*", "b", "*", "b", "*", "b"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["w", "*", "w", "*", "w", "*", "w", "*"],
    ["*", "w", "*", "w", "*", "w", "*", "w"],
    ["w", "*", "w", "*", "w", "*", "w", "*"]
]

console.log(ai.getBestMove(position, "w", true, true, true, true, 8))