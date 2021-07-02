export interface IOffer {
    cost: number;
    costWith_NDS: number;
    createdAt: string;
    creator: number;
    dateFinishShipment: string;
    dateStartShipment: string;
    description: string;
    id: number;
    periodOfExport: number;
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
        minValue: number,
        isEditMinValue: boolean,
        maxValue: number,
        isEditMaxValue: boolean,
        GOST: string,
        nameOfSpecification: {
          id: number,
          name: string
        },
        typeField: {
          id: number,
          type: string
        },
        unitOfMeasurement: {
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