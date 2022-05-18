export class ProductQuestion {
    _id: string;
    entity: string;
    question: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}

export class ProductAnswer {
    _id: string;
    question: string;
    answer: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}

export class ProductQAA {
    id: string;
    answer: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}
export class ProductQAQ {
    id: string;
    question: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}

export class ProductQA {
    entity: string;
    questions: ProductQAQ[];
}

export class Customer {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    contact: Contact;
    address: Address
}

export class Address {
    public addressLine1: string;
    public city: string;
    public postcode: string;
    public country: string;
    public latitude: number;
    public longitude: number;
    public addressLine2: string;
}

export class Contact{
    public telephone: string;
    public email: string;
    public mobile: string;
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

export class LoginRequest{
    email: string
    password: string;
}


export class SignupRequest{
    email: string
    password: string;
    mobile: string;
    fullName: string;
    firstName: string;
    lastName: string;
}


export class ResetPasswordRequest{
    email: string;
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

export class BooleanResponse{
    value: boolean
}

