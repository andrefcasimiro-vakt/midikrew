// @flow
import { compose, lifecycle, type Component, withStateHandlers } from 'recompose'

function withKey<T>(
  keyCode: number,
  callback?: Function,
): Component<T, { isPressed: boolean }> {
  return compose(
    withStateHandlers(
      {
        isPressed: false,
      },
      {
        setIsPressed: () => isPressed => ({ isPressed }),
      },
    ),
    lifecycle({
      componentDidMount() {
        // $Ignore
        document.addEventListener('keydown', event => {
          if (event.keyCode === keyCode) {
            this.props.setIsPressed(true)

            if (callback) {
              callback(this.props);
            }
          }
        })
        // $Ignore
        document.addEventListener('keyup', event => {
          if (event.keyCode === keyCode) {
            this.props.setIsPressed(false)
          }
        })
      },

      componentWillUnmount() {
      },
    })
  )
}

export default withKey
