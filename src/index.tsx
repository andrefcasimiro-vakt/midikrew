import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import FontFaceObserver from 'fontfaceobserver'
import { Provider as ReduxProvider } from 'react-redux'
import store from 'global/store'
import App from 'containers/App'
import 'assets/fonts/index.css'

// Font Face Observer
(new FontFaceObserver('defaultFont', {})).load()
  .then(() => {
    const body = document.body
    body && body.classList.add('fontLoaded')
  })
  .catch((event: { message: string }) => console.log(event.message))

// DOM Element to attach the React to
const element = document.getElementById('root')

if (element) {
  ReactDOM.render(
    <ReduxProvider store={store}>
      <Router>
        <App />
      </Router>
    </ReduxProvider>,
    element
  )
}
