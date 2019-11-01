// @flow
import React from 'react'
import withQuery from 'hocs/withQuery'

const Explore = ({ data }) => {
  console.log('explore data: ', data)
  return (
    <React.Fragment>
      <h1>Explore</h1>
    </React.Fragment>
  )
}

export default withQuery('users', ['projects'])(Explore)
