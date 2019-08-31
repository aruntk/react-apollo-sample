import { ApolloServer, gql } from 'apollo-server'
import { log } from './utils/log'
import {
  getCategories,
  getKeywords,
  CategoryInterface,
  getKeywordForCategory,
  KeywordInterface,
  getCategory,
  deleteKeyword,
  deleteCategory,
  addNewCategory,
  addNewKeyword,
} from './db'

const typeDefs = gql`
scalar ID
type Query {
  categories: [Category]
  keywords: [Keyword]
}
type Category {
  id: ID!
  name: String
  keywords: [Keyword]
}
type Keyword {
  id: ID!
  name: String
  category: Category
}
type Mutation {
  addKeyword (
    name: String!
    categoryId: ID!
  ): Keyword
  addCategory (
    name: String!
  ): Category
  deleteKeyword (
    keywordId: ID!
  ): Keyword
  deleteCategory (
    categoryId: ID!
  ): ID
}
`

const resolvers = {
  Query: {
    categories: getCategories,
    keywords: getKeywords,
  },
  Mutation: {
    addKeyword: (_: any, keyword: { name: string; categoryId: string}) => {
      return addNewKeyword(keyword)
    },
    addCategory: (_: any, category: { name: string }) => {
      return addNewCategory(category)
    },
    deleteKeyword: (_: any, { keywordId }: { keywordId: string }) => {
      return deleteKeyword(keywordId)
    },
    deleteCategory: (_: any, { categoryId }: { categoryId: string }) => {
      return deleteCategory(categoryId)
    }
  },
  Category: {
    keywords: (category: CategoryInterface) => getKeywordForCategory(category.id)
  },
  Keyword: {
    category: (keyword: KeywordInterface) => getCategory(keyword.categoryId)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  log(`🚀 Server ready at ${url}`)
})
