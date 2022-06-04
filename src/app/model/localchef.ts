import { Address, ChefContact, Contact, Customer, User } from "./common-models";

export class LocalChef {
    _id: string;
    coverPhoto: string;
    name: string;
    email: string;
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
    packagingFee: number;
    collectionPolicy: string;
    deliveryPolicy: string;
    address: Address;
    contact: ChefContact;
    noMinimumOrder: boolean;
    delivery: boolean;
    takingOrdersNow: boolean;
    preOrder: boolean;
    allDays: boolean;
    active: boolean;

    freeDeliveryOver: number;
    deliveryMinimum: number;
    deliveryFee: number;
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
    email: string;
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
    customer: User;
    chef: Chef;
    review: Review;
    serviceMode: string;
}

export class CustomerOrder {
    chefId: string;
    customerEmail: string;
    customerMobile: string;
    reference: string;
    currency: string;
    serviceMode: string;
    paymentReference: string;
    status: string;
    items: FoodOrderItem[];
    subTotal: number;
    total: number;
    deliveryFee: number;
    packagingFee: number;
    saleTax: number;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    orderCreated: Date;
    orderAccepted: Date;
    orderCollected: Date;
    orderDelivered: Date;
    orderRejected: Date;
    delivery: boolean;
    pickup: boolean;
    pickupTime: Date;
    deliveryTime: Date;
    customer: User;
    chef: Chef;
    review: Review;
    notes: string;
}

export class OrderSearchQuery {
    reference: string;
    customerEmail: string;
    chefId: string;
    thisMonth: boolean;
    thisYear: boolean;
    all: boolean;
}

export class OrderUpdateRequest {
    reference: string;
    id: string;
    status: string;
    chefNotes: string;
    customerComments: string;
    expectedCollectionDate: Date;
    expectedDeliveryDate: Date;
    customerRating: number;
}

export class CustomerReview {
    customerEmail: string;
    chefId: string;
    comments: string;
    reviewDate: Date;
    rating: number;
    customerName: string;
    customerMobile: string;
}

export class Review {
    comments: string;
    rating: number;
}

export class CustomerOrderList {
    orders: CustomerOrder[]
}

export class Orders {
    orders: FoodOrder[]
}

export class Chef {
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