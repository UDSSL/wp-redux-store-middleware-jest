import React from 'react'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import TimeslotsList from './components/TimeslotsList.jsx'

const store = configureStore()

function App() {
    return (
        <Provider store={store}>
            <TimeslotsList />
        </Provider>
    )
}

export default App
