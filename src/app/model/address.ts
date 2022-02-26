export class Address {

    public _id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public lineNumber1: string;
    public city: string;
    public postcode: string;
    public country: string;
    public lineNumber2?: string;
    public mobile?: string;
    public selected?: Boolean;

    toString() {
        return "Hello";
    }
}
export class PostcodeLookupResult {
    public postcode: string;
    public latitude: string;
    public longitude: string;
    public addresses: PostcodeLookupResultAddress[];

}


export class PostcodeLookupResultAddress {
    public formatted_address: string[];
    public thoroughfare: string;
    public building_name: string;
    public sub_building_name: string;
    public sub_building_number: string;
    public building_number: number;
    public line_1: string;
    public line_2: string;
    public line_3: string;
    public line_4: string;
    public locality: string;
    public town_or_city: string;
    public county: string;
    public district: string;
    public country: string;

}

export class RapidApiByPostcodeResponse{
    Summaries: RapidApiByPostcodeResponseSummary[]
}

export class RapidApiByPostcodeResponseSummary{
    Id: number;
    StreetAddress: string;
    Place: string;
}
export class Distance {
    public from: Place;
    public to: Place;
    public metres: string;
}

export class Place {
    public postcode: string;
    public latitude: string;
    public longitude: string;
}

export class RapidApiResult {
    public Summaries: RapidApiAddress[];
}

export class RapidApiAddress {
    public Id: number;
    public StreetAddress: string;
    public Place: string;
}