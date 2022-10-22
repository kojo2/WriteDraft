import logo from './logo.svg'
import './App.css'
import Deck from './Components/Deck'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter as Router } from 'react-router-dom'
import AppWrapper from './AppWrapper'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <AppWrapper />
        </Router>
      </Provider>
    </div>
  )
}

export default App
