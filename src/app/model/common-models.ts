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

export class User{
    id: string;
    email: string;
    role: string;
    fullName: string;
    contact: Contact;
    address: Address
}

export class Contact{
    public telephone: string;
    public mobile: string;
}

export class ChefContact{
    public telephone: string;
    public mobile: string;
    public email: string;
    public fullName: string;
}

export class UserSession{
    user: User;
    session: Session;
    success: boolean;
    message: string;
    status: number;
}

export class CustomerSession{
    session : Session;
    customer: Customer;
    success: boolean;
    message: string;
}

export class Session{
    id : string;
    email: string;
    ipAddress: string;
    accessToken: string;
    start: Date;
}

export class LoginRequest{
    email: string;
    password: string;
}

export class LogoutRequest{
    email: string;
    session: string;
}


export class SignupRequest{
    email: string
    password: string;
    mobile: string;
    fullName: string;
    role: string;
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

