// @flow
import { database } from 'global/firebase'
import { compose, withProps, type Component } from 'recompose'

export type Table = 'users'

type Added = {
  submitMutation: (values: any) => any,
}

function withMutation<Props>(
  // The database table to target
  table: Table,
  // The kind of mutation (post, put)
  mutationType: 'post' | 'put' | 'delete',
): Component<Props, Added> {
  return compose(
    withProps(props => {
      const tableInstance = database.ref(table);

      let tableValues = []
      tableInstance.on('value', snapshot => {
        tableValues = Object.values(snapshot.val())
      })

      return {
        submitMutation: (values, condition?: (values: any) => boolean) => {
            const tableLength = tableValues.length

            // If there is a condition, run it
            if (condition && !condition(tableValues))
            {
              console.error('Error occured because condition for mutation was not met')
              return
            }

            if (mutationType === 'put') {
              // Update a table based on the values.id
              return database.ref(table + '/' + values.id).set({
                values,
              })
            }

            if (mutationType === 'post') {
              const id = `${tableLength + 1}${Date.now()}`
              return database.ref(`${table}/${id}`).set({
                  id,
                  ...values
              })
            }
        }
      }
    })
  )
}

export default withMutation
