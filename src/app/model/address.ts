export class Address {
    constructor(
        public _id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public address1: string,
        public city: string,
        public postcode: string,
        public country: string,
        public address2?: string,
        public mobile?: string,
        public selected?: Boolean,
    ) {

    }

    toString() {
        return "Hello";
    }
}
