export interface ProductModel{
    _id: string,
    name: string,
    categories: Category[],
    brand: Brand,
    type: string,
    slug: string,
    description: string[],
    qa: NameValue[],
    nutritionalInformation: NameValue[],
    stock: number,
    salePrice: number,
    rating: number,
    reviews: number,
    storage: string,
    picture: Picture
}

export interface Picture{
    thumbnail: string,
    large: string,
    additional:string[]
}

export interface Brand{
    _id: string,
    name: string
}

export interface NameValue{
    _id: string,
    name: string
    value: string
}

export interface Category{
    _id: string,
    name: string,
    parent: string,
    children: Category[],
    department: string,
}

export interface Department{
    _id: string,
    name: string
}