type CategoryItem = {
    id: number
    name: string
    amount: number
}

type Category = {
    id: number
    name: string
    limit: number
    items: Array<CategoryItem>
}

export type {Category}