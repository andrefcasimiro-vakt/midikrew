// @flow
import { reduxStore } from '../../index'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import type { Instrument } from 'data/instrument/types'
import { loadSample } from 'data/audio/helpers'

export const extractInstrumentFromPack = (name: string, pack: Instrument[]): ?Instrument =>
  pack.find(instrument => instrument.name === name)

export const loader = (instrument: Instrument | Instrument[]) => {
  const audioContext = reduxStore.getState().track.audioContext

  if (instrument && Array.isArray(instrument)) {
    instrument.forEach(instrument => {
      loadAsync(instrument, audioContext)
    })
  } else {
    loadAsync(instrument, audioContext)
  }
}

export const loadAsync = (instrument: Instrument, audioContext: AudioContext) => {
  loadSample(instrument.samplePath, audioContext, 1, 1, result => {
    const _instrument = {
      ...instrument,
      sampleSource: result,
    }

    // Don't add an already existing instrument to the project
    const stateInstruments = reduxStore.getState().instrument.instruments.slice()
    if (stateInstruments.length && stateInstruments.find(instrument => instrument.name === _instrument.name)) {
      return;
    }

    reduxStore.dispatch(
      INSTRUMENT_ACTIONS.addInstrument(_instrument)
    )
  })
}
