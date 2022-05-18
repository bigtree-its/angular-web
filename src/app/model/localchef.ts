import { Address, Contact, Customer } from "./common-models";

export class LocalChef {
    _id: string;
    coverPhoto: string;
    name: string;
    displayName: string;
    days: string[];
    description: string[];
    cuisines: Cuisine[];
    slots: string[];
    serviceAreas: LocalArea[];
    categories: string[];
    specials: string[];
    gallery: string[];
    rating: number;
    reviews: number;
    minimumOrder: number;
    deliveryFee: number;
    packagingFee: number;
    collectionPolicy: string;
    deliveryPolicy: string;
    address: Address;
    contact: Contact;
    noMinimumOrder: boolean;
    delivery: boolean;
    collectionOnly: boolean;
    takingOrdersNow: boolean;
    preOrder: boolean;
    allDays: boolean;
    active: boolean;
}

export class Cuisine {
    _id: string;
    name: string;
}


export class Collection {
    _id: string;
    chefId: string;
    image: string;
    name: string;
    displayName: string;
    foods: Food[];
    active: boolean;
}

export class LocalAreaSearchResponse {
    localAreas: LocalArea[];
}

export class LocalArea {
    _id: string;
    name: string;
    city: string;
    slug: string;
    country: string;
}

export class Extra {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export class Food {
    _id: string;
    chefId: string;
    category: string;
    image: string;
    extras: Extra[];
    choices: Extra[];
    description: string;
    name: string;
    price: number;
    discounted: boolean;
    discountedPrice: number;
    active: boolean;
}

export class Calendar {
    _id: string;
    chefId: string;
    description: string;
    orderBefore: Date;
    foods: Food[];
    collectionStartDate: Date;
    collectionEndDate: Date;
    deliveryStartDate: Date;
    deliveryEndDate: Date;
}

export class LocalChefSearchQuery {
    serviceAreaSlug: string;
    cuisines: string;
    slots: string;
    serviceAreas: string;
    status: string;
    noMinimumOrder: boolean;
    collectionOnly: boolean;
    delivery: boolean;
    takingOrdersNow: boolean;
}

export class FoodOrder {
    chefId: string;
    customerEmail: string;
    customerMobile: string;
    reference: string;
    currency: string;
    paymentReference: string;
    status: string;
    items: FoodOrderItem[];
    subTotal: number;
    total: number;
    deliveryFee: number;
    packagingFee: number;
    saleTax: number;
    orderTime: Date;
    delivery: boolean;
    pickup: boolean;
    pickupTime: Date;
    deliveryTime: Date;
    customer: Customer;
    chef: Chef;
    serviceMode: string;    
}

export class Orders{
    orders: FoodOrder[]
}

export class Chef{
    chefId: string;
    name: string;
    image: string;
    specials: string[];
    address: Address;
    contact: Contact;
}

export class FoodOrderItem {
    _tempId: number;
    profuctId: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    extras: Extra[];
    choice: Extra;
    subTotal: number;
    specialInstruction: string;
}