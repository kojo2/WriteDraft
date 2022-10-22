import { useState } from 'react'
import { chunk, flatten } from 'lodash'
import Card from './Card'

const Deck = () => {
  const [camPos, setCamPos] = useState({ x: 0, y: 0 })
  const [movingCam, setMovingCam] = useState(false)
  const [cards, setCards] = useState([])
  const [currentMovingIndex, setCurrentMovingIndex] = useState(-1)
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(-1)

  const sortCards = () => {
    let _cards = [...cards]
    let row = 0
    let col = 0
    let top = 50
    let left = 20
    // first we separate the cards into rows
    let rows = chunk(_cards, 4)
    rows.forEach((r) => {
      // sort the rows by x number
      r.sort((a, b) => {
        return a.x - b.x
      })
    })
    _cards = flatten([...rows])
    _cards.forEach((card) => {
      card.x = col * 350 + left
      card.y = row * 250 + top
      col++
      if (col > 3) {
        row++
        col = 0
      }
    })
    setCards(_cards)
  }

  const calculateAverageWordCount = () => {
    let totalWordCount = 100000
    // add up all the cards that have word counts already
    let usedWords = 0
    let unwordcountedcardscount = 0
    cards.forEach((card) => {
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
      // onMouseUp={() => {
      //   setMovingCam(false)
      // }}
      // onMouseMove={(e) => {
      //   if (movingCam) {
      //     let _camPos = { ...camPos }
      //     _camPos.x += e.movementX
      //     _camPos.y += e.movementY
      //     setCamPos(_camPos)
      //   }
      // }}
      onKeyDown={(e) => {
        if (e.key === 'n' || e.key === 'Enter') {
          let v = prompt('Text')
          setCards([...cards, { text: v, x: 100, y: 100, moving: false }])
        } else if (e.key === 'Backspace') {
          if (currentlySelectedIndex > -1) {
            let c = window.confirm('Do you want to delete the selected card?')
            if (c) {
              let _cards = [...cards]
              _cards.splice(currentlySelectedIndex, 1)
              setCards(_cards)
            }
          }
        } else if (e.key === 's') {
          sortCards()
        }
      }}
      onMouseMove={(e) => {
        e.stopPropagation()
        if (currentMovingIndex > -1) {
          let _cards = [...cards]
          _cards[currentMovingIndex].x = e.clientX - 150 - camPos.x
          _cards[currentMovingIndex].y = e.clientY - 100 - camPos.y
          setCards([..._cards])
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
      <div className="camera" style={{ top: camPos.y, left: camPos.x }}>
        {cards.map((card, i) => (
          <Card
            words={card.words ? card.words : averageWordCount}
            setWordCount={(wordcount) => {
              let _cards = [...cards]
              _cards[i].words = wordcount
              setCards(_cards)
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
  )
}

export default Deck
