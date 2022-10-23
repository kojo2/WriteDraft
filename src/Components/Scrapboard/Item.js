import TextBox from './TextBox'

const Item = ({ type, selected, onMouseDown, onMouseUp, pos }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className="item"
      style={{ left: pos.x, top: pos.y }}
    >
      {type === 'textbox' ? <TextBox selected={selected} /> : null}
    </div>
  )
}

export default Item
