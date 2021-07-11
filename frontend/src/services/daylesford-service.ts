import { appConfig } from "../config";
import { POST, GET, PATCH, DELETE, UPLOAD } from "../utils/http";
import { IOffer, IOrder, IProduct, IWarehouse } from "./models";

const {auth, offer, product, warehouse, orders} = appConfig.api

/**
 * Методы auth-service.
 */
export const daylesfordService = {
     // auth
     login: (request: any) => POST<any>(`${auth}/login/`, request), // TODO: прописать модели
     logout: () => GET<any>(`${auth}/logout/`), // TODO: прописать модели
     
     // offers
     getOfferList: () => GET<IOffer[]>(`${offer}/`),
     getOffer: (id: string) => GET<IOffer>(`${offer}/${id}/`),
     editOffer: (request: IOffer) => PATCH<IOffer>(`${offer}/${request.id}/`, request),
     createOffer: (request: IOffer) => POST<IOffer>(`${offer}/`, request),
     deleteOffer: (id: string) => DELETE(`${offer}/${id}/`),

     // product
     getProducts: () => GET<IProduct[]>(`${product}/`),
     editProduct: (request: any) => PATCH<any>(`${product}/${request.id}/`, request),

     // warehouses
     getWarehouses: () => GET<IWarehouse[]>(`${warehouse}/`),

     //orders
     getOrderList: () => GET<IOrder[]>(`${orders}/`),
     getOrder: (id: string) => GET<IOrder>(`${orders}/${id}/`),

     // TODO: fake service - добавить как будет ендпоинт по отправке файлов
     uploadOrderFile: (file: File, request: any) => UPLOAD(`${orders}/${request.id}/upload`, [file], request),
};
 
