export class PaymentCard {

    constructor(
        public _id: String,
        public cardType: String,
        public nameOnCard: String,
        public cardNumber: String,
        public expiry: String,
        public cvv: String,
        public selected?: Boolean
    ){

    }
 
}
