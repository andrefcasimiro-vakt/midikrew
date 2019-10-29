// @flow
import React from 'react'
import { compose, type HOC, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { IconButton, PaddedIconButton } from 'componentsStyled/Buttons'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import TRACK_ACTIONS from 'data/track/actions'
import { Field } from 'componentsStyled/Typography'
import withKey from 'hocs/withKey'
import {
  MdContentCopy as CopyIcon,
  MdContentPaste as PasteIcon,
  MdSettings as FXIcon,
} from 'react-icons/md'
import {
  Menu,
  Input,
} from './styled'

/**
 * Allows user to set the tempo of the song
 * @param {number} bpm - The base tempo of the song (comes from Redux)
 * @param {Function} setBPM - The dispatcher to update the bpm value in our redux store
 */

const SongSettings = ({ bpm, handleBPM, currentSequence, copySequence, pasteSequence, editMode, setEditMode }) => (
  <Menu>
    <IconButton onClick={() => copySequence(currentSequence)}><CopyIcon /></IconButton>
    <IconButton onClick={() => pasteSequence(currentSequence)}><PasteIcon /></IconButton>

    &nbsp; &nbsp;

    <Field>BPM: </Field>
    <Input title='Set the current tempo of the song' type='number' value={bpm} onChange={handleBPM} />

    &nbsp; &nbsp;

    <PaddedIconButton
      padding="0.2rem 0.5rem"
      active={editMode === 'fx'}
      onClick={() => setEditMode(editMode === 'fx' ? 'pattern' : 'fx')}
    >
      <FXIcon /> &nbsp; FX Mode
    </PaddedIconButton>
  </Menu>
)

const mapStateToProps = state => ({
  bpm: state.track.bpm,
  currentSequence: state.track.currentSequence,
  editMode: state.track.editMode,
})

const mapDispatchToProps = {
  setBPM: TRACK_ACTIONS.setCurrentBPM,
  copySequence: INSTRUMENT_ACTIONS.copySequence,
  pasteSequence: INSTRUMENT_ACTIONS.pasteSequence,
  setEditMode: TRACK_ACTIONS.setEditMode,
}

const enhancer: HOC<*, {}> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withKey(70, ({ setEditMode, editMode }) =>  setEditMode(editMode === 'fx' ? 'pattern' : 'fx')), // Capture F key
  withHandlers({
    handleBPM: props => event => {
      const v = event.target.value

      props.setBPM(v)
    }
  })
)

export default enhancer(SongSettings)
