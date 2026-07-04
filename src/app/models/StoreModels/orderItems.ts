export interface OrderItems {
    id: number, 
    productName: string,
    imageURL: string,
    quantity: number,
    historicalPrice: number,
    historicalUnitCost: number,
    historicalPriceInPoints: number,
    subtotal: number,
    subtotalInPoints: number
}
