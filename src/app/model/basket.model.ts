import { Brand } from './product.model';

export class Basket {
   public items: BasketItem[];
   public total: number;
}


export class BasketItem{
    public _id: string;
    public name: string;
    public brand: Brand; 
    public price: number;
    public qty: number;
    public subtotal:number;
    public image: string;
}
