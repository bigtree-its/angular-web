import { Address } from "./address";
import { PaymentCard } from "./payment-card";

export class User {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
    mobile: string;
    addresses: Address[];
    paymentCards: PaymentCard[];
}

export class ResetPasswordRequest{
    email: string
    password: string;
    passCode: string;
}

export class VerifyIdentityRequest{
    email: string
    passCode: string;
}

export class VerifyIdentityResponse{
    email: string
    jwt: string;
}