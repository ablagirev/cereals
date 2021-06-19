export interface IOffer {
    title: string,
    volume: number,
    description: string,
    offer_lifetime: string,
    status: string,
    creator: number,
    created_at: string,
    product: number,
    warehouses: number[],
    period_of_export: string
}