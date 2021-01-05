import { Address } from './address';
import { PaymentCard } from './payment-card';
import { User } from './user';

export class Order{
    id: number;
    reference: string;
    status: string;
    date: Date;
    expectedDeliveryDate: Date;
    email: String;
    currency: String;
    items: OrderItem[];
    address: Address;
    paymentCard: PaymentCard;
    subTotal:number;
    saleTax:number;
    shippingCost:number;
    discount:number;
    totalCost:number;
}

export class OrderItem{
    id: number;
    productId: String;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}