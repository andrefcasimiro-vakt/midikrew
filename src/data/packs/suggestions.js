import { tr707 } from './drums/tr707'
import { tr808 } from './drums/tr808'
import { tr909 } from './drums/tr909'
import { awesomePads } from './pads/awesomePads'
import { junglePads } from './pads/junglePads'
import { houseSynths } from './synths/house_synths'
import { loader } from './helpers'

let list = tr707
            .concat(tr808)
            .concat(tr909)
            .concat(awesomePads)
            .concat(junglePads)
            .concat(houseSynths)

export const getList = () => {
  return list.map(entry => entry.name)
}

export const selectFromList = (instrumentName: string) => {
  const match = list.find(entry => entry.name === instrumentName)

  if (match) {
    loader(match)
  }
}
