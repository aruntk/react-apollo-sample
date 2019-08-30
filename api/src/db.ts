// tslint:disable:completed-docs

let CATEGORIES =  ['cars', 'bikes', 'fruits', 'animals', 'drinks'].map((name, i) => ({ id: i + 1, name }))
interface KeywordInterface {
  id: number
  name: string
  categoryId: number
}
let KEYWORDS: KeywordInterface[] = []
const k = [['audi', 'bmw', 'tires'], ['bianchi'], ['banana', 'avocado'], ['cat', 'dog', 'otter'], ['tea', 'water']]
let j = 1
k.forEach((keywordGroups, i) => {
  keywordGroups.forEach((name) => {
    KEYWORDS.push({
      id: j,
      name,
      categoryId: i,
    })
    j += 1
  })
})

export function getCategory (id: number) {
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
  const category = {
    id: (CATEGORIES[CATEGORIES.length - 1].id + 1),
    name,
  }

  CATEGORIES.push(category)

  return category
}
export function deleteCategory ({ id }: { id: number }) {
  KEYWORDS = KEYWORDS.filter(keyword => (keyword.categoryId !== id))
  CATEGORIES = CATEGORIES.filter(category => (category.id !== id))
}

export function getKeywordForCategory (categoryId: number) {
  return KEYWORDS.filter((keyword) => {
    return keyword.categoryId === categoryId
  })
}

export function getKeywords () {
  return KEYWORDS
}


export function addNewKeyword ({ name }: { name: string }) {
  const category = {
    id: (CATEGORIES.length + 1),
    name,
  }

  CATEGORIES.push(category)

  return category
}
export function deleteKeyword (id: number) {

  KEYWORDS = KEYWORDS.filter(keyword => (keyword.id !== id))
}
