import { ApolloServer, gql } from 'apollo-server'
import { log } from './utils/log'
import { getCategories, getKeywords } from './db'

const typeDefs = gql`
type Query {
  hello: String
  categories: [Category]
  keywords: [Keyword]
}
type Category {
  id: Int
  name: String
}
type Keyword {
  id: Int
  name: String
  categoryId: Int
}
`

const resolvers = {
  Query: {
    categories: getCategories,
    keywords: getKeywords,
    hello: () => "Hello World",
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  log(`🚀 Server ready at ${url}`)
})
