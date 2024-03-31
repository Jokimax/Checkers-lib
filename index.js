const checkers = require("./checkers")

// position = [
//     ["*", "*", "*", "*", "*", "*", "*", "*"],
//     ["a", "*", "a", "*", "a", "*", "a", "*"],
//     ["*", "*", "*", "*", "*", "*", "*", "*"],
//     ["a", "*", "e", "*", "e", "*", "a", "*"],
//     ["*", "*", "*", "*", "*", "*", "*", "*"],
//     ["a", "*", "e", "*", "e", "*", "a", "*"],
//     ["*", "*", "*", "A", "*", "*", "*", "*"],
//     ["*", "*", "*", "*", "*", "*", "*", "*"],
// ]

position = [
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "a", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "A"],
]

console.time('myScript')
console.table(checkers.getMoves(position, true, true))
console.timeEnd('myScript')
console.time('myScript')
checkers.getMoves(position, true, true)
console.timeEnd('myScript')
console.time('myScript')
checkers.getMoves(position, true, true)
console.timeEnd('myScript')
console.time('myScript')
checkers.getMoves(position, true, true)
checkers.getMoves(position, true, true)
console.timeEnd('myScript')
console.time('myScript')
checkers.getMoves(position, true, true)
console.timeEnd('myScript')
// console.time('myScript')
// checkers.getMoves(position, true, true)
// console.timeEnd('myScript')