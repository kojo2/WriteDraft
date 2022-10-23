import { Route, Routes } from 'react-router-dom'
import Deck from './Components/Deck'
import TextEditor from './Components/TextEditor'

const AppWrapper = () => {
  return (
    <div className="App-container">
      <Routes>
        <Route path="/text-editor/:draftId" element={<TextEditor />} />
        <Route path="/:p" element={<Deck />} />
        <Route path="/" element={<Deck />} />
      </Routes>
    </div>
  )
}

export default AppWrapper
