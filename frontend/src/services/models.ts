export interface IOffer {
    cost: number;
    cost_with_NDS: number;
    created_at: string;
    creator: number;
    date_finish_shipment: string;
    date_start_shipment: string;
    description: string;
    id: number;
    period_of_export: number;
    product: number;
    status: string;
    title: string;
    volume: number;
    warehouses: number[];
}