import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import useInterval from 'use-interval'
import Deck from './Components/Deck'
import ScrapBoard from './Components/Scrapboard/Scrapboard'
import TextEditor from './Components/TextEditor'
import {
  updateCards,
  updateDrafts,
  updateScrapboards,
} from './redux/mainActions'
import useRedux from './redux/useRedux'

const AppWrapper = () => {
  const { cards, drafts, scrapboards } = useRedux()
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      let s = localStorage.getItem('stuff')
      let o = JSON.parse(s)
      if (o.cards) {
        dispatch(updateCards(o.cards))
      }
      if (o.drafts) {
        dispatch(updateDrafts(o.drafts))
      }
      if (o.scrapboards) {
        dispatch(updateScrapboards(o.scrapboards))
      }
    } catch (err) {
      console.log("couldn't load the stuff")
    }
  }, [])

  useInterval(() => {
    localStorage.setItem(
      'stuff',
      JSON.stringify({ cards, drafts, scrapboards }),
    )
  }, [30000])

  return (
    <div
      className="App-container"
      onKeyDown={(e) => {
        if (e.key === 's') {
          if (e.ctrlKey) {
            localStorage.setItem(
              'stuff',
              JSON.stringify({ cards, drafts, scrapboards }),
            )
            alert('Saved')
          }
        }
      }}
    >
      <Routes>
        <Route path="/text-editor/:draftId" element={<TextEditor />} />
        <Route path="/scrap-board/:boardId" element={<ScrapBoard />} />
        <Route path="/:p" element={<Deck />} />
        <Route path="/" element={<Deck />} />
      </Routes>
    </div>
  )
}

export default AppWrapper
