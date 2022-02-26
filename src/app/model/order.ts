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
    paymentReference: string;
    items: OrderItem[];
    address: Address;
    paymentCard: PaymentCard;
    subTotal: number;
    saleTax: number;
    shippingCost: number;
    packagingCost: number;
    discount: number;
    totalCost: number;
    cancellationRequested: boolean;
    cancellationApproved: boolean;
    cancellationDeclined: boolean;
    cancelled: boolean;
}

export class OrderItem {
    id: string;
    image: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    cancellationRequested: boolean;
    cancellationApproved: boolean;
    cancellationDeclined: boolean;
    cancelled: boolean;
}

export class PaymentIntentRequest{
    customerEmail: string;
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