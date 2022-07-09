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
    address: Address;
    contact: ChefContact;
    active: boolean;
    minimumOrder: number;
    packagingFee: number;
    delivery: boolean;
    partyOrders: boolean;
    freeDeliveryOver: number;
    deliveryMinimum: number;
    deliveryFee: number;
    deliveryDistance: number;
    minimumPartyOrder: number;
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
    _uid: number;
    chefId: string;
    category: string;
    image: string;
    vegetarian: boolean;
    spice: number;
    extras: Extra[];
    choices: Extra[];
    description: string;
    name: string;
    price: number;
    discounted: boolean;
    discountedPrice: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Calendar {
    _id: string;
    chefId: string;
    description: string[];
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
    id: string;
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

export class SupplierOrder{
    id: string;
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

export class SupplierSummary{
    totalOrdersWeekly: number;
    totalOrdersMonthly: number;
    totalOrdersYearly: number;
    
    totalRevenueWeekly: number;
    totalRevenueMonthly: number;
    totalRevenueYearly: number;
   
    ordersWeekly: FoodOrder[];
    ordersMonthly: FoodOrder[];
    ordersYearly: FoodOrder[];

    weeklyGrouping: Map<Date, number>;
    monthlyGrouping: Map<Date, number>;
    yearlyGrouping: Map<string, number>;
}

export class OrderSearchQuery {
    reference: string;
    customerEmail: string;
    chefId: string;
    thisMonth: boolean;
    thisYear: boolean;
    all: boolean;
    orderId: string;
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

export class SupplierOrders{
    orders: SupplierOrder[]
}

export class Chef {
    chefId: string;
    email: string;
    name: string;
    displayName: string;
    image: string;
    specials: string[];
    address: Address;
    contact: Contact;
}

export class FoodOrderItem {
    _tempId: number;
    productId: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    extras: Extra[];
    choice: Extra;
    subTotal: number;
    specialInstruction: string;
}