import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const GET_HELLO_WORLD = gql`
  query {
    hello
  }
`
interface HelloWorldData {
  hello: string
}

/**
 * Helloworld functional component
 */
function HelloWorld() {
  const { loading, data, error } = useQuery<HelloWorldData, {}>(
    GET_HELLO_WORLD,
  )
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error :(</div>

  }
  return (
    <div>{data ? data.hello : ''}</div>
  )
}

export default HelloWorld
