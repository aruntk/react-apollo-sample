import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { groupBy } from 'lodash'
import { Table, Tag, Button } from 'antd'
import 'antd/dist/antd.min.css'
import { log } from './utils/log'

const { Column } = Table

const GET_HELLO_WORLD = gql`
query {
  keywords {
    id
    name
    categoryId
  }
  categories {
    id
    name
  }
}
`
interface KeywordInterface {
  id: number
  name: string
  categoryId: number
}
interface CategoryInterface {
  id: number
  name: string
}

interface HelloWorldData {
  keywords: KeywordInterface[]
  categories: CategoryInterface[]
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
  const keywords = data ? data.keywords : []
  const categories = data ? data.categories : []
  const keywordGroups = groupBy(keywords, 'categoryId')
  interface CategoriesWithKeywords {
    id: number
    name: string
    key: number
    keywords: KeywordInterface[]
  }
  const categoriesWithKeywords: CategoriesWithKeywords[] = categories.map((category) => {
    return {
      ...category,
      key: category.id,
      keywords: keywordGroups[category.id] || []
    }
  })
  const renderKeyword = (keyword: KeywordInterface) => {
    const handleKeywordDelete = (e: any) => {
      log(keyword)
    }
    return (
      <Tag color="blue" key={keyword.id} closable={true} onClose={handleKeywordDelete} >
        {keyword.name}
      </Tag>
    )
  }
  const renderKeywords = (_keywords: KeywordInterface[], record: CategoriesWithKeywords) => {
    const handleAddKeyword = () => {
      log(record)
    }
    return (
      <span>
        {_keywords.map(renderKeyword)}
        <Button type="primary" shape="circle" icon="plus" size="small" onClick={handleAddKeyword} />
      </span>
    )
  }
  const renderDelete = (text: string, record: CategoriesWithKeywords) => {
    const handleCategoryDelete = () => {
      log(record)
    }
    return (
      <span>
        <a onClick={handleCategoryDelete}>Delete</a>
      </span>
    )
  }
  return (
    <Table dataSource={categoriesWithKeywords}>
      <Column title="Category" dataIndex="name" key="name" />
      <Column
        title="Keywords"
        dataIndex="keywords"
        key="keywords"
        render={renderKeywords}
      />
      <Column
        title="Action"
        key="action"
        render={renderDelete}
      />
    </Table>
  )
}

export default HelloWorld
