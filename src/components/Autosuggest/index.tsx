// @flow
import React, { SyntheticEvent, BaseSyntheticEvent } from 'react'
import styled from 'styled-components'
import theme from 'global/theme'
import { getList, selectFromList } from 'data/packs/suggestions'

const Input = styled.input`
  border: 1px solid ${theme.colors.monicastro.dark};
  font-size: 1.2rem;
  padding: 0 0.5rem;
  outline: none;
  min-width: 20rem;
`

type Props = {
  suggestions: Array<string>,
  placeholder: string,
}

const instruments = getList()

/**
 * > | Renders an autosuggestion list filtered by whatever value the user types in the input field
 */
const Autosuggest = ({ suggestions = instruments, placeholder = "Search for an instrument..." }: Props) => {
  return (
    <>
      <Input list="suggestions" onChange={(event: BaseSyntheticEvent) => selectFromList(event.target.value)} placeholder={placeholder} />
      <datalist id="suggestions">
        {suggestions.map((suggestion, index) =>
          <option key={index} value={suggestion}></option>
        )}
      </datalist>
    </>
  )
}

export default Autosuggest
