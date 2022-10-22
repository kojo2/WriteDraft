import { useState } from 'react'
import { chunk, clone, flatten, get } from 'lodash'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux'
import useRedux from '../redux/useRedux'
import { updateCards } from '../redux/mainActions'
import { useNavigate, useParams } from 'react-router-dom'

const Deck = () => {
  const [camPos, setCamPos] = useState({ x: 0, y: 0 })
  const { p: route } = useParams()
  const navigate = useNavigate()
  const [movingCam, setMovingCam] = useState(false)
  const dispatch = useDispatch()
  // const [cards, setCards] = useState([])
  const { cards } = useRedux()
  const [currentMovingIndex, setCurrentMovingIndex] = useState(-1)
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(-1)

  const sortCards = () => {
    let _cards = [...cards]
    let levelCards = route ? get(_cards, route).children : _cards
    let row = 0
    let col = 0
    let top = 50
    let left = 20
    // first we separate the cards into rows
    let rows = chunk(levelCards, 4)
    rows.forEach((r) => {
      // sort the rows by x number
      r.sort((a, b) => {
        return a.x - b.x
      })
    })
    levelCards = flatten([...rows])
    levelCards.forEach((card) => {
      card.x = col * 350 + left
      card.y = row * 250 + top
      col++
      if (col > 3) {
        row++
        col = 0
      }
    })
    dispatch(updateCards(_cards))
    setCamPos({ x: 0, y: 0 })
  }

  const calculateAverageWordCount = () => {
    let totalWordCount = 100000
    // add up all the cards that have word counts already
    let usedWords = 0
    let unwordcountedcardscount = 0
    let levelCards = route ? get(cards, route).children : cards
    levelCards.forEach((card) => {
      if (card.words) {
        usedWords += parseInt(card.words)
      } else {
        unwordcountedcardscount++
      }
    })

    // divide the remainder by the remainder of cards that dont have words counts
    return Math.round((totalWordCount - usedWords) / unwordcountedcardscount)
  }

  const averageWordCount = calculateAverageWordCount()

  const levelCards = route ? get(cards, route).children : cards

  return (
    <div
      className="deck"
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
      onKeyDown={(e) => {
        if (e.key === 'n' || e.key === 'Enter') {
          let v = prompt('Text')
          let _cards = [...cards]
          let _levelCards = route ? get(_cards, route).children : _cards
          _levelCards.push({ text: v, x: 100, y: 100, children: [] })
          dispatch(updateCards(_cards))
        } else if (e.key === 'Backspace') {
          if (currentlySelectedIndex > -1) {
            let c = window.confirm('Do you want to delete the selected card?')
            if (c) {
              let _cards = [...cards]
              _cards.splice(currentlySelectedIndex, 1)
              dispatch(updateCards(_cards))
            }
          }
        } else if (e.key === 's') {
          sortCards()
        } else if (e.key === ' ') {
          if (currentlySelectedIndex > -1) {
            navigate('/' + (route ? `${route}-` : '') + currentlySelectedIndex)
          }
        } else if (e.key === 'b') {
          let r = route.split('-')
          r.pop()
          navigate('/' + r)
        }
      }}
      onMouseMove={(e) => {
        e.stopPropagation()
        if (currentMovingIndex > -1) {
          let _cards = clone(cards)
          let levelCards = route ? get(_cards, route).children : _cards
          levelCards[currentMovingIndex].x = e.clientX - 150 - camPos.x
          levelCards[currentMovingIndex].y = e.clientY - 100 - camPos.y
          dispatch(updateCards(_cards))
        } else if (movingCam) {
          let _camPos = { ...camPos }
          _camPos.x += e.movementX
          _camPos.y += e.movementY
          setCamPos(_camPos)
        }
      }}
    >
      <div className="buttons">
        <div
          className="rearrange-button"
          onClick={() => {
            sortCards()
          }}
        ></div>
      </div>
      <div className="title-bar">{route ? get(cards, route).text : ''}</div>
      <div className="camera-container">
        <div className="camera" style={{ top: camPos.y, left: camPos.x }}>
          {levelCards.map((card, i) => (
            <Card
              words={card.words ? card.words : averageWordCount}
              setWordCount={(wordcount) => {
                let _cards = [...cards]
                _cards[i].words = wordcount
                dispatch(updateCards(_cards))
              }}
              selected={currentlySelectedIndex === i}
              pos={{ x: card.x, y: card.y }}
              text={card.text}
              onMouseDown={(e) => {
                e.stopPropagation()
                setCurrentlySelectedIndex(i)
                setCurrentMovingIndex(i)
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
}

export default Deck
