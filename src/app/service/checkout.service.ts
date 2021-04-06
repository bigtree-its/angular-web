import { Injectable } from "@angular/core";
import { Address } from "../model/address";
import { Basket } from "../model/basket.model";
import { Checkout } from "../model/checkout";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root',
})
export class CheckoutService {


    checkout: Checkout = new Checkout();

    constructor(
        private acccountService: AccountService) {
    }

    updateBasket(basket: Basket) {
        this.checkout.basket = basket;
    }

    updateAddress(add: Address) {
        this.checkout.address = add;
    }

}