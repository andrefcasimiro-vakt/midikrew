// @flow
import { database, } from 'global/firebase'
import { compose, withStateHandlers, lifecycle, type Component } from 'recompose'

export type Table = 'users'

type Added = {
  data: [],
}

const getBySelector = (data: any, selector: Array<string>): [] => {
  let selectedData = []

  data.forEach(node => {
    let property = node

    for (let i = 0; i < selector.length; i++) {
      if (property[selector[i]]) {
        property = property[selector[i]]
        selectedData = selectedData.concat(property)
      }
    }
  })

  return selectedData
}

function withQuery<Props>(
  // The database table to target
  table: Table,
  // The selector
  selector: string[],
): Component<Props, Added> {
  return compose(
    withStateHandlers(
      {
        data: [],
      },
      {
        setData: () => (v) => ({ data: v })
      }
    ),
    lifecycle({
      componentDidMount() {
        const tableInstance = database.ref(table);

        let tableValues = []

        tableInstance.on('value', snapshot => {
          tableValues = Object.values(snapshot.val())

          let data = getBySelector(tableValues, selector)

          this.props.setData(data.filter(entry => !!entry))
        })
      }
    })
  )
}

export default withQuery
