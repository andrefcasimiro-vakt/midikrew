// @flow
import React from 'react'
import { compose, type HOC } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'
import TRACK_ACTIONS from 'data/track/actions'
import theme from 'global/theme'

const Input = styled.input`
  border: 1px solid ${theme.colors.monicastro.dark};
  font-size: 1.2rem;
  padding: 0 0.5rem;
  outline: none;
  min-width: 20rem;
`

const ProjectName = ({ trackName, setTrackName }) => (
  <Input value={trackName} onChange={(event) => setTrackName(event.target.value)} />
)

const mapStateToProps = state => ({
  trackName: state.track.trackName,
})

const mapDispatchToProps = {
  setTrackName: TRACK_ACTIONS.setTrackName,
}

const enhancer: HOC<*, {}> = compose(
  connect(mapStateToProps, mapDispatchToProps),
)

export default enhancer(ProjectName)
