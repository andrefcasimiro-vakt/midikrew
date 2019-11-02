// @flow
import React, { ReactNode } from 'react'
import { compose, ComponentEnhancer } from 'recompose'
import { RelativeWrapper, AbsoluteWrapper } from './styled'

interface Props {
  children: ReactNode,
}

interface Added extends Props {}

/**
 * > | Displays a modal positioned relative to the parent, but with absolute presentation. Useful for submenus of navbars and alike.
 */
const ContextMenu = ({ children }: Added) => (
  <>
    <RelativeWrapper>
      <AbsoluteWrapper>
        {children}
      </AbsoluteWrapper>
    </RelativeWrapper>
  </>
)

const enhancer: ComponentEnhancer<Added, Props> = compose()

export default enhancer(ContextMenu)
