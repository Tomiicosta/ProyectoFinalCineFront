import { OrderItems } from "./orderItems"

export interface StoreOrderDetail {
    id: number,
    status: string,
    createdAtDate: string,
    createdAtTime: string,
    items: OrderItems[],
    totalAmount: number,
    totalAmountInPoints: number
}