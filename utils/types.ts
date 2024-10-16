export interface Order {
    idOrder: string;
    fromCity: string;
    toCity: string;
    parcelType: string;
    dispatchDate: string;
    createdAt: string;
}

export interface IData {
    fromCity: string;
    toCity: string;
    parcelType?: string;
    dispatchDate: string;
    description?: string;
}
export interface IForm {
    isDeliverRequest?: boolean;
}

export interface IRequestList {
    showAllRequests: boolean;
}
