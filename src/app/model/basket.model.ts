import { Brand } from './product.model';

export class Basket {
   public items: BasketItem[];
   public id: number;
   public date: Date;
   public basketId: string;
   public email: string;
   public orderReference: string;
   public total: number;
}


export class BasketItem{
    public id: number;
    public productId: string;
    public productName: string;
    public brand: Brand; 
    public price: number;
    public quantity: number;
    public total:number;
    public image: string;
}
