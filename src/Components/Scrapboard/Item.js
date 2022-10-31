import TextBox from './TextBox'

const Item = ({ type, selected, onMouseDown, onMouseUp, pos, text, size }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={`item ${selected ? 'selected' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: type === 'image' ? size * 100 + '%' : '',
        height: 'auto',
      }}
    >
      {type === 'textbox' ? (
        <TextBox selected={selected} text={text} />
      ) : type === 'image' ? (
        <img src={text} width="100%" height="auto" />
      ) : null}
    </div>
  )
}

export default Item
