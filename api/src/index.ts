import { ApolloServer, gql } from 'apollo-server'
import { log } from './utils/log'

const typeDefs = gql`
type Query {
  hello: String
}
`

const resolvers = {
  Query: {
    hello: () => "Hello World"
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  log(`🚀 Server ready at ${url}`)
})
