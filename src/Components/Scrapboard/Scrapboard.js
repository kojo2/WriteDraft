import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useInterval from 'use-interval'
import { updateScrapboards } from '../../redux/mainActions'
import useRedux from '../../redux/useRedux'
import Item from './Item'
import TextBox from './TextBox'

const ScrapBoard = () => {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { scrapboards, cards, drafts } = useRedux()
  const [justSaved, setJustSaved] = useState(false)
  const [items, setItems] = useState([])
  const [activeItemIndex, setActiveItemIndex] = useState(-1)
  const [camPos, setCamPos] = useState({ x: 0, y: 0 })
  const [movingCam, setMovingCam] = useState(false)
  const [currentMovingIndex, setCurrentMovingIndex] = useState(-1)
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(-1)
  const [resizingImage, setResizingImage] = useState(false)

  const saveChanges = () => {
    let _scrapboards = [...scrapboards]
    // _scrapboards.find(
    //   (x) => x.index === parseInt(boardId),
    // ).text = editorState.getCurrentContent().getPlainText()
    let s = _scrapboards.find((x) => x.index === parseInt(boardId))
    s.items = [...items]
    dispatch(updateScrapboards([..._scrapboards]))
    localStorage.setItem(
      'stuff',
      JSON.stringify({ cards, drafts, _scrapboards }),
    )
    alert('Saved')
    setJustSaved(true)
    setTimeout(() => {
      setJustSaved(false)
    }, 1000)
  }

  useEffect(() => {
    let s = scrapboards.find((x) => x.index === parseInt(boardId))
    if (s) {
      setItems(s.items)
    }
  }, [scrapboards])

  const sortItems = () => {}

  const scrapboard = scrapboards.find((x) => x.index === parseInt(boardId))

  return (
    <div
      className="scrapboard"
      onKeyDown={(e) => {
        if (e.ctrlKey && e.key === 's') {
          saveChanges()
        } else if (e.key === 'Escape') {
          if (resizingImage) {
            setResizingImage(false)
          } else if (currentMovingIndex > -1) {
            setCurrentMovingIndex(-1)
          } else {
            navigate(-1)
          }
        } else if (e.key === 't') {
          let c = window.confirm('Do you want to create a text box?')
          if (c) {
            let t = window.prompt('Textbox text')
            if (t) {
              let index = items.length
              setItems([
                ...items,
                { type: 'textbox', x: 100, y: 100, index, text: t, size: 1 },
              ])
              setActiveItemIndex(index)
            }
          }
        } else if (e.key === 'i') {
          let c = window.confirm('Do you want to add an image?')
          if (c) {
            let t = window.prompt('Image url')
            if (t) {
              let index = items.length
              setItems([
                ...items,
                { type: 'image', x: 100, y: 100, index, text: t, size: 0.5 },
              ])
              setActiveItemIndex(index)
            }
          }
        } else if (e.key === 'Backspace') {
          let c = window.confirm('Do you want to delete this item?')
          if (c) {
            let _items = [...items]
            _items.splice(
              _items.findIndex((x) => x.index === currentlySelectedIndex),
              1,
            )
            setItems(_items)
          }
        } else if (e.key === 's') {
          setResizingImage(true)
        }
      }}
      tabIndex={0}
      onMouseDown={() => {
        // setMovingCam(true)
        if (movingCam) {
          setMovingCam(false)
        }
        setResizingImage(false)
        setCurrentlySelectedIndex(-1)
      }}
      // onContextMenu={(e) => {
      //   e.preventDefault()
      //   e.stopPropagation()
      //   setCurrentMovingIndex(-1)
      //   setMovingCam(true)
      // }}
      onMouseMove={(e) => {
        e.stopPropagation()
        if (currentMovingIndex > -1) {
          let _items = [...items]
          let i = _items.find((x) => x.index === currentMovingIndex)
          i.x = e.clientX - 150 - camPos.x
          i.y = e.clientY - 100 - camPos.y
          setItems(_items)
        } else if (movingCam) {
          let _camPos = { ...camPos }
          _camPos.x += e.movementX
          _camPos.y += e.movementY
          setCamPos(_camPos)
        } else if (resizingImage) {
          let _items = [...items]
          let i = _items.find((x) => x.index === currentlySelectedIndex)
          i.size += e.movementX / 100
          setItems(_items)
        }
      }}
    >
      {/* <div className="buttons">
        <div
          className="rearrange-button"
          onClick={() => {
            sortItems()
          }}
        ></div>
      </div> */}
      {justSaved ? <span className="word-count">Saved</span> : null}
      <div className="title-bar">{scrapboard?.title}</div>
      <div className="camera-container">
        <div className="camera" style={{ top: camPos.y, left: camPos.x }}>
          <div style={{ display: 'flex' }}>
            {items.map((item) => (
              <Item
                size={item.size}
                type={item.type}
                removeWordCount
                selected={currentlySelectedIndex === item.index}
                pos={{ x: item.x, y: item.y }}
                text={item.text}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (currentMovingIndex === item.index) {
                    setCurrentMovingIndex(-1)
                  } else {
                    setCurrentlySelectedIndex(item.index)
                    setCurrentMovingIndex(item.index)
                  }
                }}
                onMouseUp={(e) => {
                  setCurrentMovingIndex(-1)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className="text-editor-container"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.ctrlKey && e.key === 's') {
          saveChanges()
        } else if (e.key === 'Escape') {
          navigate(-1)
        } else if (e.key === 't') {
          let c = window.confirm('Do you want to create a text box?')
          if (c) {
            let index = items.length
            setItems([...items, { type: 'textbox', x: 100, y: 100, index }])
            setActiveItemIndex(index)
          }
        }
      }}
    >
      {justSaved ? <span className="word-count">Saved</span> : null}
      <div className="scrapboard">
        {items.map((item) => (
          <div className="item-container">
            {item.type === 'textbox' ? <TextBox /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrapBoard
