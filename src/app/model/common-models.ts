export class ProductQuestion {
    _id: string;
    entity: string;
    question: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}

export class ProductAnswer {
    _id: string;
    question: string;
    answer: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}

export class ProductQAA {
    id: string;
    answer: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}
export class ProductQAQ {
    id: string;
    question: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    date: Date;
}

export class ProductQA {
    entity: string;
    questions: ProductQAQ[];
}