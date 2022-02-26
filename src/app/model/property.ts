import { SafeStyle } from "@angular/platform-browser";

export class Sale{
    price: number;
    quote: string;
}
export class Rental  {
    price: number;
    quote: string;
    maxTerm: string;
    minTerm: string;
}
export class Address  {
    name: string;
    email: string;
    mobile: string;
    telephone: string;
    propertyNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
    country: string;
    latitude: number;
    longitude: number
}
export class School  {
    name: String; 
    distance: String;
    address: Address;
    isPrimary: Boolean;
    isSecondary: Boolean;
    isStateSchool: Boolean;
}
export class PropertyEnquiry {
    _id: string;
    property: string;
    enquiry: string;
    firstName: string;
    lastName: string;
    email: string;
    postcode: string;
    mobile: string;
    date: Date;
}

export class PropertyEnquiryResponse {
    _id: string;
    enquiryId: string;
    property: string;
    enquiry: string;
    reply: string;
    date: Date;
}

export class SuperStore  {
    name: String; 
    distance: String;
    address: Address;
    isPrimary: Boolean;
    isSecondary: Boolean;
    isStateSchool: Boolean;
}

export class Contact  {
    person: string;
    email: string;
    mobile: string;
    telephone: string;
}

export class PropertyQuries {
    enquiries: PropertyQA[];
}

export class PropertyQA {
    enquiry: PropertyEnquiry;
    replies: PropertyEnquiryResponse[];
}

export class Property {
    _id: string;
    title: string;
    pin: string;

    description: string[];
    summary: string[];
    keyFeatures: string[];
    type: NameValue;
    consumptionType: string;
    tenure: string;
    size: string;

    hospitals: NameValue[];
    stations: NameValue[];
    shops: NameValue[];
    parks: NameValue[];
    malls: NameValue[];
    leisureCenters: NameValue[];
    schools: School[];
    superStores: SuperStore[];
    sale : Sale;
    rental : Rental;

    addedDate: Date;
    liveDate: Date;
    availableDate: Date;

    contact: Contact;
    address: Address;

    bedrooms: number;
    bathrooms: number;
    coverPhoto: string;
    gallery: string[];
    floorPlan: string[];

}

export class PropertyQuery{
    marketType: string;
    types: string;
    postcode: string;
    status: string;
    max_bedrooms: string;
    min_bedrooms: string;
    last1month: boolean;
    last7days: boolean;
}
export interface NameValue{
    _id: string
    name: string
    value: string
}

export class PropertyType{
    name: string;
    _id: string;
}
