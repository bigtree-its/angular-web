import { Address } from "./address";

export class Customer {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
    mobile: string;
    addresses: Address[];
}

export class CustomerSession{
    session : Session;
    customer: Customer;
    success: boolean;
    message: string;
}

export class Session{
    _id : string;
    customerId: string;
    sessionId: string;
    accessToken: string;
    start: Date;
}

export class ResetPasswordRequest{
    email: string
    password: string;
    otp: string;
}

export class VerifyIdentityRequest{
    email: string
    passCode: string;
}

export class VerifyIdentityResponse{
    email: string
    jwt: string;
}