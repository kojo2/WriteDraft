import { useState } from 'react'
import _, { chunk, clone, flatten, get, capitalize } from 'lodash'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux'
import useRedux from '../redux/useRedux'
import { updateCards } from '../redux/mainActions'
import { useNavigate, useParams } from 'react-router-dom'

const Deck = () => {
  const [camPos, setCamPos] = useState({ x: 0, y: 0 })
  let { p: route } = useParams()
  console.log(route)
  const navigate = useNavigate()
  const [movingCam, setMovingCam] = useState(false)
  const dispatch = useDispatch()
  // const [cards, setCards] = useState([])
  const { cards } = useRedux()
  const [currentMovingIndex, setCurrentMovingIndex] = useState(-1)
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(-1)

  const getLevelCards = (_cards, f = route) => {
    if (f) {
      let r = f.split('-').filter((x) => x)
      let p = { c: _cards }
      r.forEach((index) => {
        let i = parseInt(index)
        p = { c: p.c.find((x) => x.index === i)?.children || [] }
      })
      return p.c
    }
    return _cards
  }

  const sortCards = () => {
    let _cards = [...cards]
    let levelCards = getLevelCards(_cards)
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
    levelCards.forEach((card, i) => {
      card.x = col * 350 + left
      card.y = row * 250 + top
      card.index = i
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
    let totalWordCount = route ? parseInt(route.split('_').pop()) : 100000
    // add up all the cards that have word counts already
    let usedWords = 0
    let unwordcountedcardscount = 0
    let levelCards = getLevelCards(cards)
    levelCards.forEach((card) => {
      if (card.words) {
        usedWords += parseInt(card.words)
      } else {
        unwordcountedcardscount++
      }
    })

    // divide the remainder by the remainder of cards that dont have words counts
    let wc = Math.round((totalWordCount - usedWords) / unwordcountedcardscount)

    return wc
  }

  const createCard = () => {
    let v = capitalize(prompt('Text'))
    if (!v.length) return
    let _cards = [...cards]
    let _levelCards = getLevelCards(_cards)
    _levelCards.push({
      text: v,
      x: 20,
      y: 50,
      children: [],
      index: _levelCards.length,
    })
    setCurrentlySelectedIndex(_levelCards.length - 1)
    dispatch(updateCards(_cards))
  }

  const averageWordCount = calculateAverageWordCount()

  const levelCards = getLevelCards(cards)

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
          createCard()
        } else if (e.key === 'Backspace') {
          if (currentlySelectedIndex > -1) {
            let c = window.confirm('Do you want to delete the selected card?')
            if (c) {
              let _cards = [...cards]
              let levelCards = getLevelCards(_cards)
              let index = levelCards.findIndex(
                (x) => x.index === currentlySelectedIndex,
              )
              levelCards.splice(index, 1)
              dispatch(updateCards(_cards))
            }
          }
        } else if (e.key === 's') {
          sortCards()
        } else if (e.key === ' ') {
          if (currentlySelectedIndex > -1) {
            let lc = levelCards.find((x) => x.index === currentlySelectedIndex)
            let wordcount = lc.words ? lc.words : averageWordCount
            navigate(
              '/' +
                (route ? route : '') +
                '-' +
                currentlySelectedIndex +
                '_' +
                wordcount,
            )
          }
        } else if (e.key === 'b') {
          let r = route.split('-')
          r.pop()
          r = r.join('-')
          navigate('/' + r)
        } else if (e.key === 'ArrowLeft') {
          if (currentlySelectedIndex > 0) {
            setCurrentlySelectedIndex(currentlySelectedIndex - 1)
          }
        } else if (e.key === 'ArrowRight') {
          if (currentlySelectedIndex < levelCards.length - 1) {
            setCurrentlySelectedIndex(currentlySelectedIndex + 1)
          }
        } else if (e.key === 'e') {
          let c = window.confirm('Do you want to export this to a text file')
          if (c) {
            document.write('<pre>' + JSON.stringify(cards, null, 2) + '</pre>')
          }
        } else if (e.key === 'l') {
          let p = window.prompt('Load cards')
          if (!p.length) {
            return
          } else {
            try {
              let o = JSON.parse(p)
              dispatch(updateCards(o))
            } catch (err) {
              alert("Couldn't load this file: " + err)
            }
          }
        } else if (e.key === 'Escape') {
          setCurrentlySelectedIndex(-1)
          setCurrentMovingIndex(-1)
        }
      }}
      onMouseMove={(e) => {
        e.stopPropagation()
        if (currentMovingIndex > -1) {
          let _cards = clone(cards)
          let levelCards = getLevelCards(_cards)
          let lc = levelCards.find((x) => x.index === currentMovingIndex)
          lc.x = e.clientX - 150 - camPos.x
          lc.y = e.clientY - 100 - camPos.y
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
      <div className="title-bar">
        {route
          ? (() => {
              let r = route.split('-')
              let i = r.pop()
              let lc = getLevelCards(cards, r.join('-'))
              return lc.find((x) => x.index === parseInt(i.split('_')[0]))?.text
            })()
          : ''}
      </div>
      <div className="camera-container">
        <div className="camera" style={{ top: camPos.y, left: camPos.x }}>
          {levelCards.map((card) => (
            <Card
              words={card.words ? card.words : averageWordCount}
              removeWordCount={() => {
                let _cards = [...cards]
                let _levelCards = getLevelCards(_cards)
                delete _levelCards.find((x) => x.index === card.index).words
                dispatch(updateCards(_cards))
                setCurrentMovingIndex(-1)
                setCurrentlySelectedIndex(-1)
              }}
              setWordCount={(wordcount) => {
                let _cards = [...cards]
                let _levelCards = getLevelCards(_cards)
                _levelCards.find(
                  (x) => x.index === card.index,
                ).words = wordcount
                dispatch(updateCards(_cards))
              }}
              selected={currentlySelectedIndex === card.index}
              pos={{ x: card.x, y: card.y }}
              text={card.text}
              onMouseDown={(e) => {
                e.stopPropagation()
                setCurrentlySelectedIndex(card.index)
                setCurrentMovingIndex(card.index)
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
