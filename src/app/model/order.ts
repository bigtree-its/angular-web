import { Address } from './address';
import { PaymentCard } from './payment-card';
export class Order {
    id: number;
    reference: string;
    status: string;
    date: Date;
    expectedDeliveryDate: Date;
    email: string;
    currency: string;
    items: OrderItem[];
    address: Address;
    paymentCard: PaymentCard;
    subTotal: number;
    saleTax: number;
    shippingCost: number;
    packagingCost: number;
    discount: number;
    totalCost: number;
}

export class OrderItem {
    id: number;
    image: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export class PaymentIntentRequest{
    currency: string;
    subTotal: number;
    deliveryCost: number;
    packagingCost: number;
    saleTax: number;
}

export class PaymentIntentResponse {
    id: string;
    object: string;
    amount: string;
    clientSecret: string;
    currency: string;
    error: Boolean;
    liveMode: Boolean;
    errorMessage: string;
    paymentMethod: string;
    chargesUrl: string;
    metaData: Map<string, string>;
}