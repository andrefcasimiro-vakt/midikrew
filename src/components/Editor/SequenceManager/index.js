// @flow
import React from 'react'
import { compose, type HOC, withHandlers, lifecycle } from 'recompose'
import { connect } from 'react-redux'
import { GoDiffAdded as PlusIcon, GoDiffRemoved as RemoveIcon } from 'react-icons/go'
import { TiMediaPlay as PlayIcon, TiMediaPause as PauseIcon, TiArrowLoop as LoopIcon } from 'react-icons/ti'
import CurrentStep from '../CurrentStep'
import InstrumentGrid from '../InstrumentGrid'
import Sequence from '../Sequence'
import InstrumentsManager from '../InstrumentsManager'
import SongSettings from '../SongSettings'
import InstrumentsMenu from 'components/Navbar/InstrumentsMenu'
import StatefulLink from 'components/StatefulLink'
import INSTRUMENT_ACTIONS from 'data/instrument/actions'
import TRACK_ACTIONS from 'data/track/actions'
import { PLAYER_STATE, PLAYER_MODE } from 'data/track/reducer'
import { IconButton } from 'componentsStyled/Buttons'
import { PaddedContainer } from 'componentsStyled/Layout'
import { Text } from 'componentsStyled/Typography'
import ProjectName from './ProjectName'
import {
  StyledBoxSection as BoxSection,
  MainContainer,
  SongTools,
  TopContainer,
  BottomContainer,
  Wrapper,
  Column,
  Instrument,
  GridWrapper,
  StyledStatefulLink,
} from './styled'

// Globals
let timerID

const SequenceManager = ({
  playerState,
  handlePlayer,
  currentStep,
  currentSequence, // from redux track tree
  sequences,
  addSequence,
  removeSequence,
  instruments, // from redux instrument tree
  handleMode,
  playerMode,
}) => (
  <>
    <BoxSection>
      <MainContainer>
        {/* Sequence Tools (Add / Remove), Play / Pause, Loop Track */}
        <TopContainer>
          <ProjectName /> &nbsp;
          <IconButton title='Play / pause player' onClick={handlePlayer}>{playerState === PLAYER_STATE.playing ? <PauseIcon /> : <PlayIcon />}</IconButton>
          <IconButton title='Lock / unlock the sequencer for a specific loop' onClick={handleMode} enabled={playerMode === PLAYER_MODE.loop}><LoopIcon /></IconButton>
        </TopContainer>
        {/* The current sequences list */}
        <BottomContainer>
            {sequences.map((sequence, index) => <Sequence key={sequence.id} id={index} />)}
        </BottomContainer>
        <BottomContainer>
          <IconButton title='Remove a sequence' onClick={removeSequence} disabled={sequences.length <= 1}><RemoveIcon /></IconButton>
          <IconButton title='Add a new sequence' onClick={addSequence}><PlusIcon /></IconButton>
        </BottomContainer>
      </MainContainer>
    </BoxSection>

    {/* Instrument tools (Add / Remove), Copy / Past, BPM Settings */}
    <SongTools>
      <InstrumentsManager />
      <SongSettings />
    </SongTools>

    <Wrapper>
      <Column>
        <Instrument blank/>
        <GridWrapper blank><CurrentStep /></GridWrapper>
      </Column>

      {/* Grid */}
      {instruments.length
        ? instruments.map((instrument, index) =>
          <Column key={instrument.id}>
            <Instrument>
              <p>{instrument.name}</p>
            </Instrument>
            <GridWrapper>
              <InstrumentGrid instrumentOwnerId={instrument.id} />
            </GridWrapper>
          </Column>
        )
        : <PaddedContainer>
            <Text>No instruments yet. To start creating a song,
              <StyledStatefulLink>
                <StatefulLink component={InstrumentsMenu}> add an instrument </StatefulLink>
              </StyledStatefulLink>
            from the sample library!</Text>
          </PaddedContainer>
      }
    </Wrapper>
  </>
)

const mapStateToProps = state => ({
  audioContext: state.track.audioContext,
  bpm: state.track.bpm,
  playerState: state.track.playerState,
  playerMode: state.track.playerMode,
  currentStep: state.track.currentStep,
  currentSequence: state.track.currentSequence,
  sequences: state.track.sequences,
  instruments: state.instrument.instruments,
})

const mapDispatchToProps = {
  addInstrument: INSTRUMENT_ACTIONS.addInstrument,
  removeInstrument: INSTRUMENT_ACTIONS.removeInstrument,
  setInterval: TRACK_ACTIONS.setInterval,
  addSequence: TRACK_ACTIONS.addSequence,
  setCurrentStep: TRACK_ACTIONS.setCurrentStep,
  setCurrentSequence: TRACK_ACTIONS.setCurrentSequence,
  removeSequence: TRACK_ACTIONS.removeSequence,
  play: TRACK_ACTIONS.play,
  pause: TRACK_ACTIONS.pause,
  setMode: TRACK_ACTIONS.setMode,
}

const enhancer: HOC<*, {}> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    manageNextPosition: props => () => {
      if (props.currentStep + 1 >= 16) {
        if (props.playerMode === PLAYER_MODE.loop) {
          return props.setCurrentStep(0)
        }

        if (props.currentSequence + 2 <= props.sequences.length) {
          props.setCurrentSequence(props.currentSequence + 1)
        } else {
          props.setCurrentSequence(0)
        }
      } else {
        props.setCurrentStep(props.currentStep + 1)
      }
    }
  }),
  withHandlers({
    handlePlayer: props => () => {
      if (props.playerState === PLAYER_STATE.playing) {
        clearInterval(timerID)

        return props.pause()
      }

      const tempo = props.bpm || 120
      const linesPerBeat = 4
      const interval = ((Math.pow(10, 4) * 6) / linesPerBeat) / tempo

      timerID = setInterval(() => props.manageNextPosition(), interval)

      // store interval
      props.setInterval(interval)

      return props.play()
    },
    handleMode: props => () => props.playerMode === PLAYER_MODE.loop
      ? props.setMode(PLAYER_MODE.continuous)
      : props.setMode(PLAYER_MODE.loop),
  }),
  lifecycle({
    // If bpm changes, clear and reset interval of timerID
    componentWillUpdate(nextProps) {
      if (this.props.bpm !== nextProps.bpm) {
        clearInterval(timerID)

        this.props.handlePlayer()
      }
    }
  })
)

export default enhancer(SequenceManager)
