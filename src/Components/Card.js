import { useState } from 'react'
import useRedux from '../redux/useRedux'

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
  mathsMode,
  mathsSelected,
  reorderIndex,
  removeWordCount,
}) => {
  const { units } = useRedux()
  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${
        reorderMode ? 'reorder-mode' : mathsMode ? 'reorder-mode' : ''
      } ${mathsSelected ? 'maths-selected' : ''}`}
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
          // if (words) {
          //   return
          // }
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
        {words} {units.units}s
      </span>
      <span className="no-highlight card-text">{text}</span>
    </div>
  )
}

export default Card
