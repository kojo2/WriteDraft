import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import useInterval from 'use-interval'
import Deck from './Components/Deck'
import ScrapBoard from './Components/Scrapboard/Scrapboard'
import TextEditor from './Components/TextEditor'
import { updateCards, updateDrafts } from './redux/mainActions'
import useRedux from './redux/useRedux'

const AppWrapper = () => {
  const { cards, drafts } = useRedux()
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      let s = localStorage.getItem('stuff')
      let o = JSON.parse(s)
      dispatch(updateCards(o.cards))
      dispatch(updateDrafts(o.drafts))
    } catch (err) {
      console.log("couldn't load the stuff")
    }
  }, [])

  useInterval(() => {
    localStorage.setItem('stuff', JSON.stringify({ cards, drafts }))
  }, [120000])

  return (
    <div className="App-container">
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
