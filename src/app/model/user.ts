import { Address } from "./address";
import { PaymentCard } from "./payment-card";

export class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
    addresses: [Address];
    paymentCards: [PaymentCard];
}