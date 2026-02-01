import { useState } from 'react'
import './App.css'

const BOARD_SIZE = 30
const WIN_LENGTH = 5

function App() {
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('blue') // 'blue' nebo 'red'
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [gameStarted, setGameStarted] = useState(false)

  const checkWinner = (squares, index) => {
    const row = Math.floor(index / BOARD_SIZE)
    const col = index % BOARD_SIZE
    const player = squares[index]

    // Směry: vodorovně, svisle, diagonálně (\), diagonálně (/)
    const directions = [
      [0, 1],   // vodorovně
      [1, 0],   // svisle
      [1, 1],   // diagonálně \\
      [1, -1]   // diagonálně /
    ]

    for (const [dx, dy] of directions) {
      let count = 1
      const line = [index]

      // Kontrola v jednom směru
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break
        const newIndex = newRow * BOARD_SIZE + newCol
        if (squares[newIndex] === player) {
          count++
          line.push(newIndex)
        } else break
      }

      // Kontrola v opačném směru
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break
        const newIndex = newRow * BOARD_SIZE + newCol
        if (squares[newIndex] === player) {
          count++
          line.push(newIndex)
        } else break
      }

      if (count >= WIN_LENGTH) {
        return { winner: player, line }
      }
    }

    return null
  }

  const handleClick = (index) => {
    if (board[index] || winner) return

    if (!gameStarted) setGameStarted(true)

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const result = checkWinner(newBoard, index)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
    } else {
      setCurrentPlayer(currentPlayer === 'blue' ? 'red' : 'blue')
    }
  }

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null))
    setCurrentPlayer('blue')
    setWinner(null)
    setWinningLine([])
    setGameStarted(false)
  }

  return (
    <div className="game-container">
      <div className="header">
        <div className={`player-indicator ${currentPlayer === 'blue' && !winner ? 'active' : ''}`}>
          <div className="stone blue"></div>
          <span>Player 1</span>
          {winner === 'blue' && <span className="winner-badge">🏆</span>}
        </div>
        
        <div className="title-section">
          <h1>Gomoku</h1>
          <button onClick={resetGame} className="reset-btn" disabled={gameStarted && !winner}>New Game</button>
        </div>
        
        <div className={`player-indicator ${currentPlayer === 'red' && !winner ? 'active' : ''}`}>
          <div className="stone red"></div>
          <span>Player 2</span>
          {winner === 'red' && <span className="winner-badge">🏆</span>}
        </div>
      </div>

      <div className="board">
        {board.map((value, index) => (
          <div
            key={index}
            className={`cell ${value ? value : ''} ${winningLine.includes(index) ? 'winning' : ''}`}
            onClick={() => handleClick(index)}
          >
            {value && <div className={`stone ${value}`}></div>}
          </div>
        ))}
      </div>

      {winner && (
        <div className="modal-overlay" onClick={resetGame}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 Congratulations!</h2>
            <p><span className={winner}>Player {winner === 'blue' ? '1' : '2'}</span> wins!</p>
            <button onClick={resetGame} className="modal-btn">Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
