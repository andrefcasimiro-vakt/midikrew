// @flow
import * as R from 'ramda'
import { database } from 'global/firebase'
import firebase from 'global/firebase'
import store from 'global/store'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import { Instrument } from 'data/instrument/types'
import TRACK_ACTIONS from 'data/track/actions'
import { loadSample } from 'data/audio/helpers'

const usersTable = database.ref('users');
let users: any
usersTable.on('value', snapshot => {
  users = Object.values(snapshot.val())
})

export const importProject = (json: any) => {
  const file = JSON.parse(json)

  // Set TRACK name
  store.dispatch(
    TRACK_ACTIONS.setTrackName(file.trackName)
  )

  // Set BPM
  store.dispatch(
    TRACK_ACTIONS.setCurrentBPM(file.bpm)
  )

  // Clear all sequences of the current project
  store.dispatch(
    TRACK_ACTIONS.clearSequences()
  )

  // Set Number Of Sequences
  const fileSequencesLength = file.sequences.length
  for (let i = 1; i < fileSequencesLength; i++) {
    store.dispatch(
      TRACK_ACTIONS.addSequence()
    )
  }

  // Set Instruments (For Each Instrument, we need to load Sample)
  var audioContext = store.getState().track.audioContext

  // CLEAN ALL INSTRUMENTS BEFORE UPLOADING SAVED ONES!
  store.dispatch(
    INSTRUMENT_ACTIONS.clearAll()
  )

  file.instruments.instruments.forEach((instrument: Instrument) => {
    loadSample(instrument.samplePath, audioContext, 1, 1, (sampleLoaded: AudioBuffer) => {
      const returnedInstrument = {
        ...instrument,
        sampleSource: sampleLoaded,
      }

      store.dispatch(
        INSTRUMENT_ACTIONS.addInstrument(returnedInstrument)
      )
    })
  })
}

export const exportProject = () => {
  const instruments = store.getState().instrument
  const trackName = store.getState().track.trackName
  const bpm = store.getState().track.bpm
  const sequences = store.getState().track.sequences

  const config = {
    trackName,
    instruments,
    bpm,
    sequences,
  }

  let encoded = JSON.stringify(config)
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(encoded);

  let exportFileDefaultName = `midikrew-${Date.now()}.json`;

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export const saveProject = () => {
  const instruments = store.getState().instrument
  const trackName = store.getState().track.trackName
  const bpm = store.getState().track.bpm
  const sequences = store.getState().track.sequences

  const config = {
    trackName,
    instruments,
    bpm,
    sequences,
  }

  // The encoded project to be saved in the database
  const jsonData = config

  // The logged in user email
  const jwtEmail = R.path(['currentUser', 'email'], firebase.auth());

  if (!jwtEmail) {
    console.log('No user authenticated! Saving was cancelled.')
    return
  }

  // Find current logged in user
  const currentUser = users.find((user: any) => user.email === jwtEmail)

  // Find a project inside the user
  const tablePath = `users/${currentUser.id}`

  // Check if a project already exists in the user projects tree based on the project name
  const existingProject = currentUser.projects && currentUser.projects.length && currentUser.projects.find((project: any) => project.trackName === trackName)

  if (existingProject) {
    const userUpdateProjectPayload = {
      ...currentUser,
        projects: {
          ...currentUser.projects,
          [existingProject.id]: jsonData
        }
    }

    console.log('userUpdateProjectPayload, ', userUpdateProjectPayload)
    database.ref(tablePath).set(userUpdateProjectPayload)
  } else {
    // No project, give an id and add it to the user projects tree
    const projectId = (currentUser.projects && currentUser.projects.length ? currentUser.projects.length + 1 : 0) + Date.now()
    const userCreateProjectPayload = {
      ...currentUser,
      projects: {
        ...currentUser.projects,
        [projectId]: jsonData,
      },
    }

    console.log('userCreateProjectPayload: ', userCreateProjectPayload)
    database.ref(tablePath).set(userCreateProjectPayload)
  }
}
