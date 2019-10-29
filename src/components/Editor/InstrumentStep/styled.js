// @flow
import styled, { css } from 'styled-components'
import theme from 'global/theme'
import { mq } from 'common/mediaQueries'

export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  height: 100%;
  width: auto;
  position: relative;
`

export const StepWrapper = styled.div`
  height: 100%;
  width: 100%;
  background: ${p => p.selected
    ? theme.colors.monicastro.blue
    : p.index % 4 === 0 ? theme.colors.monicastro.darkGreyLight : theme.colors.monicastro.grey};
  border-right: 1px solid ${theme.colors.monicastro.dark};
  flex-direction: row;
  cursor: pointer;

  &:active {
    opacity: 1;
  }

  ${p => p.editMode === 'fx' && p.selected && css`
    background: ${theme.colors.monicastro.dark};
  `}
`
