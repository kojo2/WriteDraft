const TextBox = ({ selected }) => {
  return (
    <div
      style={{ width: '200px', color: 'white' }}
      className={selected ? 'selected' : ''}
    >
      Text
    </div>
  )
}

export default TextBox
