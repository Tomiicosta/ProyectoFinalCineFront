export interface Producto {
    id: number, 
    name: string,
    unitPrice: number,
    priceInPoints: number,
    stock: number,
    totalCostStock: number,
    imageURL: string,
    description: string,
    available: boolean,
    productType: string
}