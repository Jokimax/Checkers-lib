# Checkers-Lib
An npm package for Checkers/Draughts.
## Features
- Functions to get all avaiable moves
- A manager to play moves
- An ai to get the best moves
## Available Functions
```
function getMoves(position, pieceType = "w", forcedCaptures = false, canCaptureBackwards = false, flyingKing = false, maxCaptures = false)
// get all posible moves in a position for a certain color
// returns { "moves": moves, "hasToCapture": hasToCapture }
```
```
function getPieceMoves(position, x, y, hasToCapture = false, forcedCaptures = false, canCaptureBackwards = false, flyingKing = false, maxCaptures = false)
// get all moves for piece at a certain position
// returns { "moves": moves, "hasToCapture": hasToCapture }
```
```
function getPeasantMoves(position, x, y, pieceType = "w", hasToCapture = false, forcedCaptures = false, canCaptureBackwards = false)
// gets all peasant moves at a position
// returns { "moves": moves, "hasToCapture": hasToCapture }
```
```
function getKingMoves(position, x, y, pieceType = "w", hasToCapture = false, forcedCaptures = false, flyingKing = false)
// gets all king moves at a position
// returns { "moves": moves, "hasToCapture": hasToCapture }
```
```
function makeMove(oldPosition, move)
// makes a move in position
// returns newPosition
```
```
function unmakeMove(newPosition, move)
// undoes a move from a position
// returns oldPosition
```
```
function getBestMove(position, player = "w", forcedCaptures = false, canCaptureBackwards = false, flyingKing = false, maxCaptures = false, depth = 6)
// gets the best move by performing a minimax search to a certain depth
// returns bestMove
```
## Values
 **position** - a 2d array of all the pieces. Black moves down white moves up. <br> Example position at the start of game:
```
[["*", "b", "*", "b", "*", "b", "*", "b"],
 ["b", "*", "b", "*", "b", "*", "b", "*"],
 ["*", "b", "*", "b", "*", "b", "*", "b"],
 ["*", "*", "*", "*", "*", "*", "*", "*"],
 ["*", "*", "*", "*", "*", "*", "*", "*"],
 ["w", "*", "w", "*", "w", "*", "w", "*"],
 ["*", "w", "*", "w", "*", "w", "*", "w"],
 ["w", "*", "w", "*", "w", "*", "w", "*"]]
 ```
**move** - How does the board change after a move.<br> Move formatting: {["x": x, "y": y, "originalPiece": originalPiece], ["x": x1, "y": y1, "originalPiece": originalPiece] ...}. <br>Some examples:
```
{["x": 2, "y": 5, "originalPiece": "w"], ["x": 1, "y": 4, "originalPiece": "*"]} // white moves a Peasant one square
{["x": 0, "y": 3, "originalPiece": "b"], ["x": 1, "y": 4, "originalPiece": "W"], ["x": 2, "y": 5, "originalPiece": "*"]} // black captures a White King
{["x": 1, "y": 4, "originalPiece": "W"], ["x": 3, "y": 6, "originalPiece": "*"]} // the White King moves two spaces
```
**hasToCapture** - whether only captures should be returned<br>
**forcedCaptures** - GameRule: whether pieces are forced to capture<br>
**canCaptureBackwards** - GameRule: can Peasants capture backwards<br>
**flyingKing** - GameRule: can Kings move any number of squares<br>
**maxCaptures** - GameRule: whether pieces are forced to make the max number of captures
