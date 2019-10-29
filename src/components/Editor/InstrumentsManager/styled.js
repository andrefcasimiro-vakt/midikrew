import styled from 'styled-components'
import theme from 'global/theme'

export const Menu = styled.div`
  background: none;
  display: flex;
  flex-direction: row;

  li {
    color: ${theme.colors.monicastro.dark};
  }
`
