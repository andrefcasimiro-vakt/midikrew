// @flow
import styled from 'styled-components'
import { mq } from 'common/mediaQueries'
// Just basic exports depending on flex properties. No opinionated style should go here.

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`

export const RowEvenly = styled.div`
  justify-content: space-evenly;
  padding: 0.1rem 0.2rem;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

export const Margin = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
`

export const PaddedColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`

export const PaddedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 100%;

  ${mq('max').tabletWide} {
    p {
      flex-direction: column;
    }
  }
`
