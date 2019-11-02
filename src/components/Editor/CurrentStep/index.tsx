import React from 'react'
import { connect } from 'react-redux'
import { StoreState } from 'global/store'
import { StepIndicator } from './styled'

const generator: number[] = [];
for (let i = 0; i < 16; i++) {
  generator.push(i);
}

/**
 * Used to illustrate the current position of the sequencer at a given current step
 * @param {number} currentStep - The index of the current step of the sequence
 */
const CurrentStep = ({ currentStep }: any) => (
  <>
    {generator.map((index) => <StepIndicator key={index} active={currentStep === index} />)}
  </>
)

const mapStateToProps = (state: StoreState) => ({
  currentStep: state.track.currentStep,
})

export default connect(
  mapStateToProps,
  {},
)(CurrentStep)
