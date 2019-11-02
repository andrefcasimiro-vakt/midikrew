// @flow
import styled from 'styled-components'
import theme from 'global/theme'

type Props = {
  active: boolean,
}

export const StepIndicator = styled.div`
  height: 100%;
  flex-grow: 1;
  border-bottom: ${
    (p: Props) => p.active
          ? `0.3rem solid ${theme.colors.monicastro.blue}`
          : 'none'
  };
`
