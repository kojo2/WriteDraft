import { useState } from 'react'

const Card = ({
  pos,
  text,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  selected,
  words,
  setWordCount,
}) => {
  return (
    <div
      className={`card ${selected ? 'selected' : ''}`}
      style={{ top: pos.y, left: pos.x }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <span
        className="word-count"
        onClick={() => {
          let c = window.prompt('New word count for this card')
          setWordCount(c)
        }}
      >
        Word count: {words}
      </span>
      <span className="no-highlight">{text}</span>
    </div>
  )
}

export default Card
