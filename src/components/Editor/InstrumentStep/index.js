// @flow
import React from 'react'
import withOpen from 'hocs/withOpen'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { compose, type HOC, withHandlers, withStateHandlers, withProps, lifecycle } from 'recompose'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import TRACK_ACTIONS from 'data/track/actions'
import type { Instrument } from 'data/instrument/types'
import { PLAYER_STATE } from 'data/track/reducer'
import StepOptions from './StepOptions'
import {
  IoMdColorWand as GearIcon,
} from 'react-icons/io'
import { IconContext } from "react-icons"
import { ActionWrapper, StepWrapper } from './styled'
import Modal from 'modals/_Modal'
import { play } from 'data/audio/helpers'

type Props = {
  index: number,
  instrument: Instrument,
}

const InstrumentStep = ({
  index,
  audioContext,
  handleSelection,
  instrument,
  currentStep,
  currentSequence,
  canPlay,
  setCanPlay,
  interval,
  playerState,
  selected,
  fx,
  setFX,
  toggleOpen,
  isOpen,
  editMode,
  setEditMode,
}) => {
  let trigger = 
    canPlay && 
    playerState === PLAYER_STATE.playing && 
    index === currentStep && 
    selected

  // Avoids an accidental retriggering caused by the nature of this component's lifecycle update
  if (trigger) {
    setCanPlay(false)

    setTimeout(() => { setCanPlay(true) }, interval)
  }

  const fxObj = fx || {}

  return (
    <ActionWrapper>
      <StepWrapper selected={selected} index={index} onClick={editMode === 'pattern' ? handleSelection : toggleOpen} editMode={editMode} />
        {trigger
          ? play(instrument.sampleSource, audioContext, fxObj)
          : null
        }
      {selected && isOpen &&
        <Modal title='Edit FX' close={toggleOpen}>
          <StepOptions setFx={setFX} fx={fxObj} />
        </Modal>
      }
    </ActionWrapper>
  )
}

const mapStateToProps = state => ({
  interval: state.track.interval,
  currentStep: state.track.currentStep,
  currentSequence: state.track.currentSequence,
  audioContext: state.track.audioContext,
  playerState: state.track.playerState,
  instruments: state.instrument.instruments,
  editMode: state.track.editMode,
})

const mapDispatchToProps = {
  updateSequence: INSTRUMENT_ACTIONS.updateSequence,
  setEditMode: TRACK_ACTIONS.setEditMode,
}

const enhancer: HOC<*, Props> = compose(
  withOpen,
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => {
    const instrumentSequences = props.instrument.sequences[props.currentSequence]

    // Find corresponding FX for this step
    const match = instrumentSequences && instrumentSequences.find(entry => entry.index === props.index)

    const fx = (match && match.fx) ? match.fx : {}

    return {
      fx
    }
  }),
  withStateHandlers(
    {
      canPlay: true,
    },
    {
      setCanPlay: () => (v) => ({ canPlay: v }),
    },
  ),
  withHandlers({
    setFX: props => (key, type: 'increase' | 'decrease') => {
      let fx = props.fx || {}

      const propValue = key === 'reverb' // hardcode for now
        ? type === 'decrease' ? true : false
        : (type === 'increase' ? (fx[key] || 1) + 0.01 : (fx[key] || 1) - 0.01)

      // Update sequence

      fx = {
        ...fx,
        [key]: propValue,
      }

      let sequence = R.path(['sequences', props.currentSequence], props.instrument)
        ? props.instrument.sequences[props.currentSequence].slice()
        : []

      let sequenceIndex = sequence.findIndex(seq => seq.index === props.index)

      sequence[sequenceIndex] = {
        ...sequence[sequenceIndex],
        fx,
      }

      props.updateSequence({
        sequence,
        sequenceID: props.currentSequence,
        instrumentID: props.instrument.id,
      })
    },
    handleSelection: props => () => {
      let sequence = R.path(['sequences', props.currentSequence], props.instrument)
        ? props.instrument.sequences[props.currentSequence].slice()
        : []

      const sequenceIndex = sequence.findIndex(seq => seq.index === props.index)

      if (sequenceIndex >= 0) { // REMOVE
        sequence.splice(sequenceIndex, 1)
      } else { // ADD
        sequence = sequence.concat({
          index: props.index
        })
      }

      props.updateSequence({
        sequence,
        sequenceID: props.currentSequence,
        instrumentID: props.instrument.id,
      })
    },
  }),
  withProps(props => {
    const instrumentSequence = props.instrument.sequences
      && props.instrument.sequences[props.currentSequence]

    const selected = instrumentSequence && instrumentSequence.find(seq => seq.index === props.index)

    return {
      selected,
    }
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      if (this.props.editMode !== nextProps.editMode) {
        return true
      }

      return !this.props.selected && !nextProps.selected
        ? false
        : true
    },
  })
)

export default enhancer(InstrumentStep)
