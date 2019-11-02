import { createStore, applyMiddleware, combineReducers } from 'redux'
// Reducers
import trackReducer, { State as TrackState } from 'data/track/reducer'
import instrumentReducer, { State as InstrumentState } from 'data/instrument/reducer'

export type StoreState = {
  track: TrackState,
  instrument: InstrumentState,
}

export function configureStore(initialState: Object) {
  const reducers = combineReducers({
    // @ts-ignore
    track: trackReducer,
    instrument: instrumentReducer,
  })

  const store = createStore(
    reducers,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    initialState,
    // @ts-ignore
    applyMiddleware,
  )

  return store
}

const store = configureStore({})

export default store
