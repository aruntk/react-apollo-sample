// tslint:disable:completed-docs

let CATEGORIES =  ['cars', 'bikes', 'fruits', 'animals', 'drinks'].map((name, i) => ({ id: `${i + 1}`, name }))
export interface KeywordInterface {
  id: string
  name: string
  categoryId: string
}
export interface CategoryInterface {
  id: string
  name: string
}
let KEYWORDS: KeywordInterface[] = []
const k = [['audi', 'bmw', 'tires'], ['bianchi'], ['banana', 'avocado'], ['cat', 'dog', 'otter'], ['tea', 'water']]
let j = 1
k.forEach((keywordGroups, i) => {
  keywordGroups.forEach((name) => {
    KEYWORDS.push({
      id: `${j}`,
      name,
      categoryId: `${i + 1}`,
    })
    j += 1
  })
})

export function getCategory (id: string) {
  let target = null

  CATEGORIES.some((category) => {
    if (category.id === id) {
      target = category
      return true
    }
  })

  return target
}

export function getCategories () {
  return CATEGORIES
}

export function addNewCategory ({ name }: { name: string }) {
  const categoryExists = CATEGORIES.find(category => (category.name === name))
  if (categoryExists) {
    throw new Error(`category: ${name} already exists`)
  }

  const category = {
    id: `${parseInt(CATEGORIES[CATEGORIES.length - 1].id, 10) + 1}`,
    name,
  }

  CATEGORIES.push(category)

  return category
}
export function deleteCategory (id: string) {
  const categoryExists = getCategory(id)
  if (!categoryExists) {
    throw new Error(`Could not find the selected category`)
  }
  KEYWORDS = KEYWORDS.filter(keyword => (keyword.categoryId !== id))
  CATEGORIES = CATEGORIES.filter(category => (category.id !== id))
  return id
}

export function getKeywordForCategory (categoryId: string) {
  return KEYWORDS.filter((keyword) => {
    return keyword.categoryId === categoryId
  })
}

export function getKeywords () {
  return KEYWORDS
}


export function addNewKeyword ({ name, categoryId }: { name: string, categoryId: string }) {
  const keywordExists = KEYWORDS.find(keyword => (keyword.name === name && keyword.categoryId === categoryId))
  if (keywordExists) {
    throw new Error(`keyword: ${name} already exists`)
  }
  const categoryExists = getCategory(categoryId)
  if (!categoryExists) {
    throw new Error(`invalid category id`)
  }
  const keyword = {
    id: `${(parseInt(KEYWORDS[KEYWORDS.length - 1].id, 10) + 1)}`,
    name,
    categoryId,
  }
  KEYWORDS.push(keyword)

  return keyword
}
export function deleteKeyword (id: string) {
  const keywordExists = KEYWORDS.find(keyword => keyword.id === id)
  if (!keywordExists) {
    throw new Error(`Could not find the selected keyword`)
  }
  KEYWORDS = KEYWORDS.filter(keyword => (keyword.id !== id))
  return keywordExists
}
