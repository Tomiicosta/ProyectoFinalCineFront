import { OrderItems } from './orderItems';

export interface StoreOrderList {
    id: number;
    createdAtDate: string;
    createdAtTime: string;
    totalAmount: number;
    totalAmountInPoints: number;
    paidPoints: boolean;
    purchaseCode: string;
    items: OrderItems[];
}
