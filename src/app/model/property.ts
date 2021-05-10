export class Property {
    _id: number;
    title: string;
    pin: string;

    description: string[];
    summary: string[];
    key_features: string[];
    type: NameValue;
    consumption_type: string;
    tenure: string;

    stations: NameValue[];
    schools: NameValue[];

    rental_price: number;
    purchase_price: number;
    rental_term: string;
    purchase_quote: string;

    added_date: Date;
    live_date: Date;
    available_date: Date;

    contact_person: string;
    contact_phone: string;
    contact_email: string;

    bedrooms: number;
    bathrooms: number;
    cover_photo: string;
    gallery: string[];
    floor_plan: string[];

    property_number: string;
    street: string;
    city: string;
    country: string;
    postcode: string;

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
export class PropertyQuery{
    min_bedrooms: string;
    max_bedrooms: string;
    postcode: string;
    last7days: boolean;
    last1month: boolean;
    types: string;
    status: string;
    marketType: string;
}