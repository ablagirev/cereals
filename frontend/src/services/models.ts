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
    product: {
      id: number;
    };
    status: string;
    title: string;
    volume: number;
    warehouse: {
      id: number;
    };
}

export interface IProduct {
    id: number,
    title: string,
    description: string,
    specifications: IProductSpecs[]
  }

  export interface IProductSpecs {
        id: number,
        min_value: number,
        is_edit_min_value: boolean,
        max_value: number,
        is_edit_max_value: boolean,
        GOST: string,
        name_of_specification: {
          id: number,
          name: string
        },
        type_field: {
          id: number,
          type: string
        },
        unit_of_measurement: {
          id: number,
          unit: string
        }
  }

  export interface IWarehouse {
    id: number,
    title: string,
    address: string,
    owner: number
  }
  
  export interface IOrder {
    title: string,
    id: number,
    status: string
    // TODO: добавить интерфейс
  }