import React from 'react'
import { connect } from 'react-redux'
import { StoreState } from 'global/store'
import { compose, ComponentEnhancer } from 'recompose'
import { Instrument } from 'data/instrument/types'
import InstrumentStep from '../InstrumentStep'
import { generateSteps } from '../helpers'

interface Props {
  instrumentOwnerId: string,
}

interface Added extends Props {
  instruments: Instrument[],
}

const InstrumentGrid = ({ instruments, instrumentOwnerId }: Added) => {
  const instrument = instruments.find((instrument: Instrument) => instrument.id === instrumentOwnerId)

  return (
    <React.Fragment>
      {generateSteps(16).map((stepIndex: number) => {
        return (
          <InstrumentStep
            key={stepIndex + instrumentOwnerId}
            index={stepIndex}
            instrument={instrument}
          />
        )
      })}
    </React.Fragment>
  )
}



const mapStateToProps = (state: StoreState) => ({
  instruments: state.instrument.instruments,
})

const mapDispatchToProps = {}

const enhancer: ComponentEnhancer<Added, Props> = compose(
  connect(mapStateToProps, mapDispatchToProps),
)

export default enhancer(InstrumentGrid)
