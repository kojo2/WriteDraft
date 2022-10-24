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
  reorderMode,
  reorderIndex,
  removeWordCount,
}) => {
  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${
        reorderMode ? 'reorder-mode' : ''
      }`}
      style={{ top: pos.y, left: pos.x }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <span className="reorder-index">
        {reorderIndex > -1 ? reorderIndex : null}
      </span>
      <span
        className="word-count"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          let c = window.prompt('New word count for this card')
          if (!c.length) return
          setWordCount(c)
        }}
        onContextMenu={(e) => {
          if (words) {
            return
          }
          e.preventDefault()
          e.stopPropagation()
          let c = window.confirm(
            'Do you want to remove the explicit word count for this card and go back to auto?',
          )
          if (c) {
            removeWordCount()
          }
        }}
      >
        {words} words
      </span>
      <span className="no-highlight card-text">{text}</span>
    </div>
  )
}

export default Card
