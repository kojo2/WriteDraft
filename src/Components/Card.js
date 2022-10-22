const Card = ({ pos, text, onMouseDown, onMouseMove, onMouseUp, selected }) => {
  return (
    <div
      className={`card ${selected ? 'selected' : ''}`}
      style={{ top: pos.y, left: pos.x }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <span className="no-highlight">{text}</span>
    </div>
  )
}

export default Card
