import { gql } from 'apollo-boost'

export const GET_CATEGORIES_AND_KEYWORDS = gql`
query {
  categories {
    id
    name
    keywords {
      id
      name
    }
  }
}
`
export const ADD_KEYWORD = gql`
mutation AddKeyword ($keywordName: String!, $categoryId: ID!) {
  addKeyword(name: $keywordName, categoryId: $categoryId) {
    id
    name
    category {
      id
    }
  }
}
`
export const ADD_CATEGORY = gql`
mutation AddCategory ($categoryName: String!) {
  addCategory(name: $categoryName) {
    id
    name
    keywords {
      id
      name
    }
  }
}
`
export const DELETE_KEYWORD = gql`
mutation DeleteKeyword ($keywordId: ID!) {
  deleteKeyword(keywordId: $keywordId) {
    id
    category {
      id
    }
  }
}
`

export const DELETE_CATEGORY = gql`
mutation DeleteCategory ($categoryId: ID!) {
  deleteCategory(categoryId: $categoryId)  
}
`
