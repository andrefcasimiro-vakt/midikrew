// @flow
import { database } from 'global/firebase'
import firebase from 'global/firebase'
import {
  reduxStore
} from '../../index'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import TRACK_ACTIONS from 'data/track/actions'
import { loadSample } from 'data/audio/helpers'

const usersTable = database.ref('users');
let users
usersTable.on('value', snapshot => {
  users = Object.values(snapshot.val())
})

export const importProject = (json: any) => {
  const file = JSON.parse(json)

  // Set TRACK name
  reduxStore.dispatch(
    TRACK_ACTIONS.setTrackName(file.trackName)
  )

  // Set BPM
  reduxStore.dispatch(
    TRACK_ACTIONS.setCurrentBPM(file.bpm)
  )

  // Clear all sequences of the current project
  reduxStore.dispatch(
    TRACK_ACTIONS.clearSequences()
  )

  // Set Number Of Sequences
  const fileSequencesLength = file.sequences.length
  for (let i = 1; i < fileSequencesLength; i++) {
    reduxStore.dispatch(
      TRACK_ACTIONS.addSequence()
    )
  }

  // Set Instruments (For Each Instrument, we need to load Sample)
  var audioContext = reduxStore.getState().track.audioContext

  // CLEAN ALL INSTRUMENTS BEFORE UPLOADING SAVED ONES!
  reduxStore.dispatch(
    INSTRUMENT_ACTIONS.clearAll()
  )

  file.instruments.instruments.forEach(instrument => {
    loadSample(instrument.samplePath, audioContext, 1, 1, sampleLoaded => {
      const returnedInstrument = {
        ...instrument,
        sampleSource: sampleLoaded,
      }

      reduxStore.dispatch(
        INSTRUMENT_ACTIONS.addInstrument(returnedInstrument)
      )
    })
  })
}

export const exportProject = () => {
  const instruments = reduxStore.getState().instrument
  const trackName = reduxStore.getState().track.trackName
  const bpm = reduxStore.getState().track.bpm
  const sequences = reduxStore.getState().track.sequences

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
  const instruments = reduxStore.getState().instrument
  const trackName = reduxStore.getState().track.trackName
  const bpm = reduxStore.getState().track.bpm
  const sequences = reduxStore.getState().track.sequences

  const config = {
    trackName,
    instruments,
    bpm,
    sequences,
  }

  // The encoded project to be saved in the database
  const jsonData = config

  // The logged in user email
  const jwtEmail = firebase.auth().currentUser.email

  if (!jwtEmail) {
    console.log('No user authenticated! Saving was cancelled.')
    return
  }

  // Find current logged in user
  const currentUser = users.find(user => user.email === jwtEmail)

  // Find a project inside the user
  const tablePath = `users/${currentUser.id}`

  // Check if a project already exists in the user projects tree based on the project name
  const existingProject = currentUser.projects && currentUser.projects.length && currentUser.projects.find(project => project.trackName === trackName)

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
