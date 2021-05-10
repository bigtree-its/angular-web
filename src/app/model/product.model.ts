export interface ProductModel{
    _id: string,
    name: string,
    categories: Category[],
    brand: Brand,
    type: string,
    slug: string,
    description: string[],
    qa: NameValue[],
    attributes: Attribute[],
    nutritionalInformation: NameValue[],
    stock: number,
    salePrice: number,
    amount: string,
    fraction: string,
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

export interface QuestionAnswer{
    product: string,
    email: string,
    username: string,
    question: string,
    answers: string[]
}

export interface Brand{
    _id: string,
    name: string
}

export interface NameValue{
    _id: string,
    name: string,
    value: string
}
export interface  Attribute {
    _id: String,
    name: String,
    value: [String]
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

export class Carousel{
    public id: number;
    public product: string;
    public image: string;
    public title: string;
    public description: string;
    public coming: Boolean;
    public active: Boolean;
}

export class Collection{
    public id: number;
    public name: string;
    public image: string;
    public description: string;
}

export class ProductQuestion {
    _id: string;
    product: string;
    question: string;
    userName: string;
    userEmail: string;
    date: Date;
}

export class ProductAnswer {
    _id: string;
    question: string;
    answer: string;
    userName: string;
    userEmail: string;
    date: Date;
}

export class ProductQAA {
    id: string;
    answer: string;
    userName: string;
    userEmail: string;
    date: Date;
}
export class ProductQAQ {
    id: string;
    question: string;
    userName: string;
    userEmail: string;
    date: Date;
}

export class ProductQA {
    product: string;
    questions: ProductQAQ[];
}