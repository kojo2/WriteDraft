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
  const { scrapboards } = useRedux()
  const [justSaved, setJustSaved] = useState(false)
  const [items, setItems] = useState([])
  const [activeItemIndex, setActiveItemIndex] = useState(-1)
  const [camPos, setCamPos] = useState({ x: 0, y: 0 })
  const [movingCam, setMovingCam] = useState(false)
  const [currentMovingIndex, setCurrentMovingIndex] = useState(-1)
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(-1)

  const saveChanges = () => {
    let _scrapboards = [...scrapboards]
    // _scrapboards.find(
    //   (x) => x.index === parseInt(boardId),
    // ).text = editorState.getCurrentContent().getPlainText()
    dispatch(updateScrapboards([..._scrapboards]))
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
  }, [])

  const sortItems = () => {}

  useInterval(() => {
    saveChanges()
  }, [60000])

  const scrapboard = scrapboards.find((x) => x.index === boardId)

  return (
    <div
      className="scrapboard"
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
      tabIndex={0}
      onMouseDown={() => {
        // setMovingCam(true)
        if (movingCam) {
          setMovingCam(false)
        }
        setCurrentlySelectedIndex(-1)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentMovingIndex(-1)
        setMovingCam(true)
      }}
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
      {/* <div className="title-bar">{getTitle()}</div> */}
      <div className="camera-container">
        <div className="camera" style={{ top: camPos.y, left: camPos.x }}>
          {items.map((item) => (
            <Item
              type={item.type}
              removeWordCount
              selected={currentlySelectedIndex === item.index}
              pos={{ x: item.x, y: item.y }}
              text={item.text}
              onMouseDown={(e) => {
                e.stopPropagation()
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
