// @flow

// types of action
const Types = {
  SET_CURRENT_BPM: "SET_CURRENT_BPM",
  SET_INTERVAL: "SET_INTERVAL",
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  SET_CURRENT_SEQUENCE: "SET_CURRENT_SEQUENCE",
  ADD_SEQUENCE: "ADD_SEQUENCE",
  REMOVE_SEQUENCE: "REMOVE_SEQUENCE",
  CLEAR_ALL_SEQUENCES: "CLEAR_ALL_SEQUENCES",
  PLAY: "PLAY",
  PAUSE: "PAUSE",
  SET_MODE: "SET_MODE",
  SET_EDIT_MODE: "SET_EDIT_MODE",
  SET_TRACK_NAME: "SET_TRACK_NAME",
}

// actions
const setCurrentBPM = (payload: number) => ({
  type: Types.SET_CURRENT_BPM,
  payload,
})

const setInterval = (payload: number) => ({
  type: Types.SET_INTERVAL,
  payload,
})

const setCurrentStep = (payload: number) => ({
  type: Types.SET_CURRENT_STEP,
  payload,
})

const setCurrentSequence = (payload: number) => ({
  type: Types.SET_CURRENT_SEQUENCE,
  payload,
})

const addSequence = () => ({
  type: Types.ADD_SEQUENCE,
})

const removeSequence = () => ({
  type: Types.REMOVE_SEQUENCE,
})

// Clears all the sequences of the song
const clearSequences = () => ({
  type: Types.CLEAR_ALL_SEQUENCES,
})

const play = () => ({
  type: Types.PLAY,
})

const pause = () => ({
  type: Types.PAUSE,
})

const setMode = (payload: string) => ({
  type: Types.SET_MODE,
  payload,
})

// Allows user to alternate between pattern editing and fx editing
const setEditMode = (payload: 'pattern' | 'fx') => ({
  type: Types.SET_EDIT_MODE,
  payload,
})

const setTrackName = (payload: string) => ({
  type: Types.SET_TRACK_NAME,
  payload,
})

export default {
  setCurrentBPM,
  setInterval,
  setCurrentStep,
  setCurrentSequence,
  addSequence,
  removeSequence,
  clearSequences,
  play,
  pause,
  setMode,
  setEditMode,
  setTrackName,
  Types,
}
