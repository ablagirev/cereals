export interface IOffer {
    cost: number;
    costWithNds: number;
    createdAt: string;
    creator: number;
    dateFinishShipment: string;
    dateStartShipment: string;
    description: string;
    id: number;
    periodOfExport: number;
    product: {
      id: number;
      harvestType: string;
      harvestYear: string;
      title: string;
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
        description: string,
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
  
  export interface IOrder  {
    id: number,
    title: string,
    costWithNds: number,
    cost: number,
    periodOfExport: number,
    costByTonne: number,
    offer: {
      id: number,
      costWithNds: number,
      periodOfExport: number,
      product: {
        id: number,
        specifications: [
          {
            id: number,
            unitOfMeasurement: {
              id: number,
              unit: string
            },
            name: string,
            required: boolean,
            type: number,
            description: string,
            GOST: string
          }
        ],
        title: string,
        description: string,
        harvestYear: string,
        harvestType: string,
        category: number
      },
      warehouse: {
        id: number,
        title: string,
        address: string,
        owner: number
      },
      daysTillEnd: number,
      title: string,
      volume: number,
      description: string,
      status: string,
      createdAt: string,
      dateStartShipment: string,
      dateFinishShipment: string,
      cost: number,
      taxType: string,
      companyName:string,
      creator: number
    },
    taxType: string,
    providerName: string,
    customerCostWithNds: number,
    totalWithNds: number,
    amountOfNds: number,
    status: string,
    acceptedVolume: number,
    nameOfContract: string,
    numberOfSpec: string,
    dateStartOfSpec: string,
    dateFinishOfSpec: string,
    dateStartOfContract: string,
    dateFinishOfContract: string,
    dateStartShipment: string,
    dateFinishShipment: string,
    customerCost: number,
    total: number,
    provider: number,
    customer: number,
    selectedWarehouse:number,
    documents: number[]  
  }
