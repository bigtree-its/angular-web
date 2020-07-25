import { Address } from './address';
import { PaymentCard } from './payment-card';
import { User } from './user';

export class Order{
    _id: string;
    referenceNumber: string;
    date: Date;
    user: User;
    items: OrderItem[];
    deliveryAddress: Address;
    paymentMethod: string;
    paymentCard: PaymentCard;
    total:number;
}

export class OrderItem{
    _id: string;
    product: string;
    qty: number;
    price: number;
    subtotal: number;
}