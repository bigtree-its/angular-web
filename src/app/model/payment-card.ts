export class PaymentCard {

    public _id: String;
    public cardType: string;
    public nameOnCard: String;
    public cardNumber: String;
    public expiryMonth: number;
    public expiryYear: number;
    public cvv: String;
    public selected?: boolean;

}

export enum CardType{
    Debit = "Debit",
    Credit = "Credit"
}
