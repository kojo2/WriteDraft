const TextBox = ({ selected, text }) => {
  return (
    <div
      style={{ display: 'block', color: 'white' }}
      className={selected ? 'selected' : ''}
    >
      {text}
    </div>
  )
}

export default TextBox
