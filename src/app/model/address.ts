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
