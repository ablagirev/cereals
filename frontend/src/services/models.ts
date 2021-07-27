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
    specifications: [
      {
          id: number,
          specification: {
            id: number,
            unitOfMeasurement: {
              id: number,
              unit: string
            },
            name: string,
            required: boolean,
            type: string,
            description: string,
            GOST: string,
            spec: string
          }
          value: string;
      }
    ],
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
          type: string,
          description: string,
          GOST: string,
          spec: string
        }
      ],
      title: string,
      description: string,
      harvestYear: string,
      harvestType: string,
      culture: number;
    };
    status: string;
    title: string;
    volume: number;
    warehouse: {
      id: number;
      title: string;
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
          unitOfMeasurement: {
            id: number,
            unit: string
          },
          name: string,
          required: boolean,
          type: string,
          description: string,
          GOST: string,
          spec: string
        
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
    company: {
      addressLoad: string,
      basisOfDoc: string,
      bik: string,
      correspondentAccount: string,
      emailOfHead: string,
      headOfProvider: string,
      id: number,
      inn: string,
      kpp: string,
      mailAddress: string,
      nameOfBank: string,
      nameOfProvider: string,
      ogrn: string,
      paymentAccount: string,
      phoneNumber: string,
      positionHeadOfProvider: string,
      shortFio: string,
      ulAddress: string,
    },
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
      specifications: [
        {
            id: number,
            specification: {
              id: number,
              unitOfMeasurement: {
                id: number,
                unit: string
              },
              name: string,
              required: boolean,
              type: string,
              description: string,
              GOST: string,
              spec: string
            }
            value: string;
        }
      ],
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
      creator: number
    },
    taxType: string,
    providerName: string,
    farmerCostWithNds: number,
    totalWithNds: number,
    priceForDelivery: number,
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
    farmerCost: number,
    total: number,
    provider: number,
    customer: number,
    selectedWarehouse: {
      id: number,
      title: string,
      address: string,
      owner: string,
    },
    documents: number[]  
  }
