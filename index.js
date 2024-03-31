const ai = require("./ai")
const checkers = require("./checkers")

position = [
    ["*", "a", "*", "a", "*", "a", "*", "a"],
    ["a", "*", "a", "*", "a", "*", "a", "*"],
    ["*", "a", "*", "a", "*", "a", "*", "a"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["e", "*", "e", "*", "e", "*", "e", "*"],
    ["*", "e", "*", "e", "*", "e", "*", "e"],
    ["e", "*", "e", "*", "e", "*", "e", "*"]
]
console.time('myScript')
ai.getBestMove(position, true, true, 1)
console.timeEnd('myScript')
console.time('myScript')
ai.getBestMove(position, true, true, 2)
console.timeEnd('myScript')
console.time('myScript')
ai.getBestMove(position, true, true, 3)
console.timeEnd('myScript')
console.time('myScript')
ai.getBestMove(position, true, true, 4)
console.timeEnd('myScript')
console.time('myScript')
ai.getBestMove(position, true, true, 5)
console.timeEnd('myScript')
console.time('myScript')
ai.getBestMove(position, true, true, 6)
console.timeEnd('myScript')