import store from 'global/store'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import { Instrument } from 'data/instrument/types'
import { loadSample } from 'data/audio/helpers'

export const extractInstrumentFromPack = (name: string, pack: Instrument[]): Instrument | void =>
  pack.find(instrument => instrument.name === name)

export const loader = (instrument: Instrument | Instrument[]) => {
  const audioContext = store.getState().track.audioContext

  if (instrument && Array.isArray(instrument)) {
    instrument.forEach(instrument => {
      loadAsync(instrument, audioContext)
    })
  } else {
    loadAsync(instrument, audioContext)
  }
}

export const loadAsync = (instrument: Instrument, audioContext: AudioContext) => {
  loadSample(instrument.samplePath, audioContext, 1, 1, (result: AudioBuffer) => {
    const _instrument = {
      ...instrument,
      sampleSource: result,
    }

    // Don't add an already existing instrument to the project
    const stateInstruments = store.getState().instrument.instruments.slice()
    if (stateInstruments.length && stateInstruments.find((instrument: Instrument) => instrument.name === _instrument.name)) {
      return;
    }

    store.dispatch(
      INSTRUMENT_ACTIONS.addInstrument(_instrument)
    )
  })
}
