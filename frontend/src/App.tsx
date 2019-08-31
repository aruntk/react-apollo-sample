import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Table, Tag, Button, Input, Popover } from 'antd'
import 'antd/dist/antd.min.css'
import './flex.css'
import { GET_CATEGORIES_AND_KEYWORDS, ADD_KEYWORD, ADD_CATEGORY, DELETE_KEYWORD, DELETE_CATEGORY } from './graphql'

const { Column } = Table

interface KeywordInterface {
  id: string
  name: string
  category: CategoryInterface
}
interface CategoryInterface {
  id: string
  name: string
  keywords: KeywordInterface[]
}
interface AppData {
  categories: CategoryInterface[]
}
interface CategoriesWithKey extends CategoryInterface {
  key: string
}

/**
 * App functional component
 */
function App() {
  const { loading, data, error } = useQuery<AppData, {}>(
    GET_CATEGORIES_AND_KEYWORDS,
  )
  const [addCategory] = useMutation(
    ADD_CATEGORY,
    {
      // return of addCategory is newly added category
      update(cache: any, { data: { addCategory } }) {
        const { categories }: { categories: CategoryInterface[] } = cache.readQuery({ query: GET_CATEGORIES_AND_KEYWORDS })
        cache.writeQuery({
          query: GET_CATEGORIES_AND_KEYWORDS,
          data: { categories: categories.concat([addCategory]) },
        })
      }
    }
  )
  const [deleteCategory] = useMutation(
    DELETE_CATEGORY,
    {
      update(cache: any, { data: { deleteCategory } }) {
        const { categories }: { categories: CategoryInterface[] } = cache.readQuery({ query: GET_CATEGORIES_AND_KEYWORDS })
        cache.writeQuery({
          query: GET_CATEGORIES_AND_KEYWORDS,
          data: { categories: categories.filter((category) => category.id !== deleteCategory ) },
        })
      }
    }
  )

  const [addKeyword] = useMutation(
    ADD_KEYWORD,
    {
      // return of addKeyword is { id: string, category: { id: string } }
      update(cache: any, { data: { addKeyword } }) {
        const { categories }: { categories: CategoryInterface[] } = cache.readQuery({ query: GET_CATEGORIES_AND_KEYWORDS })
        const mutatedCategories = categories.map((category) => {
          if(category.id === addKeyword.category.id) {
            // add the new keyword to the category cache
            return {
              ...category,
              keywords: [...category.keywords, addKeyword]
            }
          }
          return category
        })
        cache.writeQuery({
          query: GET_CATEGORIES_AND_KEYWORDS,
          data: { categories: mutatedCategories },
        })
      }
    }
  )

  const [deleteKeyword] = useMutation(
    DELETE_KEYWORD,
    {
      update(cache: any, { data: { deleteKeyword } }) {
        const { categories }: { categories: CategoryInterface[] } = cache.readQuery({ query: GET_CATEGORIES_AND_KEYWORDS })
        const mutatedCategories = categories.map((category) => {
          if(category.id === deleteKeyword.category.id) {
            // remove the deleted keyword from cache
            const keywords = category.keywords.filter((keyword) => {
              return keyword.id !== deleteKeyword.id
            })
            return {
              ...category,
              keywords
            }
          }
          return category
        })
        cache.writeQuery({
          query: GET_CATEGORIES_AND_KEYWORDS,
          data: { categories: mutatedCategories },
        })
     
      }
    }
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newKeywordName, setNewKeywordName] = useState('')
  const [newKeywordCategory, setNewKeywordCategory] = useState('')

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error :(</div>

  }
  const categories: CategoryInterface[] = data ? data.categories : []
  const categoriesWithKey: CategoriesWithKey[] = categories.map((category) => {
    return {
      ...category,
      key: category.id,
    }
  })
  const renderKeyword = (keyword: KeywordInterface) => {
    const handleKeywordDelete = () => {
      deleteKeyword({ variables: { keywordId: keyword.id } })
    }
    return (
      <Tag color="blue" key={keyword.id} closable={true} onClose={handleKeywordDelete} >
        {keyword.name}
      </Tag>
    )
  }
  const handleAddKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeywordName(e.target.value)
  }
  const handleAddKeywordButtonClick = () => {
    if (newKeywordName && newKeywordCategory) {
      addKeyword({ variables: { keywordName: newKeywordName, categoryId: newKeywordCategory } })
    }
    // reset keyword name once the add button is clicked
    setNewKeywordName('')
  }
  const addKeywordPopoverContent = (
    <div className="horizontal layout">
      <Input onChange={handleAddKeywordInputChange} placeholder="Add new keyword" value={newKeywordName} />
      <Button type="primary" onClick={handleAddKeywordButtonClick}>Add Keyword</Button>
    </div>
  )
  const handleAddKeywordPopoverVisibleChange = (visible: boolean) => {
    if (!visible) {
      // if the popover is closed reset the keyword category id
      setNewKeywordCategory('')
    }
  }
  const renderKeywords = (_keywords: KeywordInterface[], record: CategoriesWithKey) => {
    const handleAddKeyword = () => {
      setNewKeywordCategory(record.id)
    }
    return (
      <span>
        {_keywords.map(renderKeyword)}
        <Popover content={addKeywordPopoverContent} title="Title" trigger="click" onVisibleChange={handleAddKeywordPopoverVisibleChange} >
          <Button type="primary" shape="circle" icon="plus" size="small" onClick={handleAddKeyword} />
        </Popover>
      </span>
    )
  }
  const renderDelete = (text: string, record: CategoriesWithKey) => {
    const handleCategoryDelete = () => {
      deleteCategory({ variables: { categoryId: record.id } })
    }
    return (
      <span>
        <Button onClick={handleCategoryDelete}>Delete</Button>
      </span>
    )
  }
  const handleAddCategory = () => {
    addCategory({ variables: { categoryName: newCategoryName } })
    setNewCategoryName('')
  }
  const handleAddCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value)
  }
  return (
    <div className="vertical layout center center-justified">
      <Table dataSource={categoriesWithKey}>
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
      <div className="horizontal layout">
        <Input onChange={handleAddCategoryInputChange} placeholder="Add new category" value={newCategoryName} />
        <Button type="primary" onClick={handleAddCategory}>Add Category</Button>
      </div>
    </div>
  )
}

export default App
