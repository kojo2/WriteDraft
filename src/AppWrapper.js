import { Route, Routes } from 'react-router-dom'
import Deck from './Components/Deck'

const AppWrapper = () => {
  return (
    <div className="App-container">
      <Routes>
        <Route path="/:p" element={<Deck />} />
        <Route path="/" element={<Deck />} />
      </Routes>
    </div>
  )
}

export default AppWrapper
