import { Brand } from './product.model';

export interface Basket {
   items: BasketItem[]
   total: number
}


export interface BasketItem{
    _id: string,
    name: string, 
    brand: Brand, 
    price: number,
    qty: number,
    subtotal:number,
    image: string
}
