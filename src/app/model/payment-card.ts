export class PaymentCard {

    public _id: String;
    public cardType: String;
    public nameOnCard: String;
    public cardNumber: String;
    public expiryMonth: number;
    public expiryYear: number;
    public cvv: String;
    public selected?: Boolean;

}

export enum CardType{
    Debit = "Debit",
    Credit = "Credit"
}
