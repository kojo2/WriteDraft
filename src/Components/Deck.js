import { useEffect, useState } from 'react'
import _, { chunk, clone, flatten, get, capitalize } from 'lodash'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux'
import useRedux from '../redux/useRedux'
import {
  updateCards,
  updateDrafts,
  updateScrapboards,
} from '../redux/mainActions'
import { useNavigate, useParams } from 'react-router-dom'
import { getLevelCards } from '../utils/functions'

const Deck = () => {
  const [camPos, setCamPos] = useState({ x: 0, y: 0 })
  let { p: route } = useParams()
  console.log(route)
  const navigate = useNavigate()
  const [movingCam, setMovingCam] = useState(false)
  const dispatch = useDispatch()
  // const [cards, setCards] = useState([])
  const { cards, drafts, scrapboards } = useRedux()
  const [currentMovingIndex, setCurrentMovingIndex] = useState(-1)
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(-1)
  const [reorderMode, setReorderMode] = useState(false)
  const [reorderA, setReorderA] = useState([])

  useEffect(() => {
    sortCards()
  }, [])

  const sortCards = () => {
    let _cards = [...cards]
    let levelCards = getLevelCards(_cards, route)
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
    let levelCards = getLevelCards(cards, route)
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
    let _levelCards = getLevelCards(_cards, route)
    _levelCards.push({
      text: v,
      x: 20,
      y: 50,
      children: [],
      index: _levelCards.length,
      route: route + '-' + _levelCards.length,
    })
    setCurrentlySelectedIndex(_levelCards.length - 1)
    dispatch(updateCards(_cards))
  }

  const averageWordCount = calculateAverageWordCount()

  const levelCards = getLevelCards(cards, route)

  const getTitle = () => {
    if (route) {
      let r = route.split('-')
      let i = r.pop()
      let lc = getLevelCards(cards, r.join('-'))
      return lc.find((x) => x.index === parseInt(i.split('_')[0]))?.text
    } else {
      return ''
    }
  }

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
          if (reorderMode) {
            // put the cards in the new order by changing their indexes and resort
            let _cards = [...cards]
            let levelCards = getLevelCards(_cards, route)
            let ra = [...reorderA]
            ra = ra.map((r, i) => {
              r.index = i
              return r
            })
            let nCards = [...ra]
            nCards.forEach((n, i) => {
              levelCards[i] = { ...n }
            })
            nCards.sort((a, b) => a.index - b.index)
            dispatch(updateCards(_cards))
            setReorderMode(false)
            setReorderA([])
          } else {
            createCard()
          }
        } else if (e.key === 'Backspace') {
          if (currentlySelectedIndex > -1) {
            let c = window.confirm('Do you want to delete the selected card?')
            if (c) {
              let _cards = [...cards]
              let levelCards = getLevelCards(_cards, route)
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
            document.write(
              '<pre>' + JSON.stringify({ cards, drafts }, null, 2) + '</pre>',
            )
          }
        } else if (e.key === 'l') {
          let p = window.prompt('Load cards')
          if (!p.length) {
            return
          } else {
            try {
              let o = JSON.parse(p)
              dispatch(updateCards(o.cards))
              dispatch(updateDrafts(o.drafts))
            } catch (err) {
              alert("Couldn't load this file: " + err)
            }
          }
        } else if (e.key === 'Escape') {
          setCurrentlySelectedIndex(-1)
          setCurrentMovingIndex(-1)
        } else if (e.key === 'd') {
          let c = window.confirm('Do you want to work on a draft here?')
          if (c) {
            // create new draft in redux and then navigate to it
            let _drafts = [...drafts]
            let r = route
              .split('-')
              .map((x) => x.split('_')[0])
              .join('-')
            let di = _drafts.findIndex((x) => x.route === (route ? r : ''))
            if (di > -1) {
              navigate('/text-editor/' + di)
            } else {
              _drafts.push({
                route: route ? r : '',
                index: drafts.length,
                text: getTitle(),
                averageWordCount,
              })
              dispatch(updateDrafts(_drafts))
              di = _drafts.length - 1
              navigate('/text-editor/' + di)
            }
          }
        } else if (e.key === 'k') {
          let c = window.confirm('Do you want to work on a scrapboard here?')
          if (c) {
            // create new draft in redux and then navigate to it
            let _scrapboards = [...scrapboards]
            let r = route
              .split('-')
              .map((x) => x.split('_')[0])
              .join('-')
            let di = _scrapboards.findIndex((x) => x.route === (route ? r : ''))
            if (di > -1) {
              navigate('/scrap-board/' + di)
            } else {
              _scrapboards.push({
                route: route ? r : '',
                index: scrapboards.length,
                items: [],
              })
              dispatch(updateScrapboards(_scrapboards))
              di = _scrapboards.length - 1
              navigate('/scrap-board/' + di)
            }
          }
        } else if (e.key === 'f') {
          let c = window.confirm(
            'Do you want to reset the order of these cards?',
          )
          if (c) {
            setReorderMode(true)
          }
        } else if (e.key === 'a') {
          let c = window.confirm('Do you want to amend the text in this card?')
          if (c) {
            let _cards = [...cards]
            let _levelCards = getLevelCards(_cards, route)
            let card = _levelCards.find(
              (x) => x.index === currentlySelectedIndex,
            )
            if (card) {
              let t = window.prompt('New text', card.text)
              if (t) {
                card.text = t
                dispatch(updateCards(_cards))
              }
            }
          }
        } else if (e.key === 'c') {
          if (currentlySelectedIndex > -1) {
            let card = getLevelCards(cards, route).find(
              (x) => x.index === currentlySelectedIndex,
            )
            navigator.clipboard.writeText(card.text)
          }
        }
      }}
      onMouseMove={(e) => {
        e.stopPropagation()
        if (currentMovingIndex > -1) {
          let _cards = clone(cards)
          let levelCards = getLevelCards(_cards, route)
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
      {/* <div className="buttons">
        <div
          className="rearrange-button"
          onClick={() => {
            sortCards()
          }}
        ></div>
      </div> */}
      <div className="title-bar">{getTitle()}</div>
      <div className="camera-container">
        <div className="camera" style={{ top: camPos.y, left: camPos.x }}>
          {levelCards.map((card) => (
            <Card
              words={card.words ? card.words : averageWordCount}
              reorderMode={reorderMode}
              reorderIndex={(() => {
                if (reorderMode) {
                  return reorderA.findIndex((x) => x.index === card.index)
                } else {
                  return -1
                }
              })()}
              removeWordCount={() => {
                let _cards = [...cards]
                let _levelCards = getLevelCards(_cards, route)
                delete _levelCards.find((x) => x.index === card.index).words
                dispatch(updateCards(_cards))
                setCurrentMovingIndex(-1)
                setCurrentlySelectedIndex(-1)
              }}
              setWordCount={(wordcount) => {
                let _cards = [...cards]
                let _levelCards = getLevelCards(_cards, route)
                _levelCards.find(
                  (x) => x.index === card.index,
                ).words = wordcount
                dispatch(updateCards(_cards))
              }}
              selected={currentlySelectedIndex === card.index}
              pos={{ x: card.x, y: card.y }}
              text={`${card.text}`}
              onMouseDown={(e) => {
                e.stopPropagation()
                if (reorderMode) {
                  let rA = [...reorderA]
                  rA.push(card)
                  setReorderA(rA)
                } else {
                  setCurrentlySelectedIndex(card.index)
                  setCurrentMovingIndex(card.index)
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
}

export default Deck
