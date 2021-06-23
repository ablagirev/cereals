import { appConfig } from "../config";
import { POST, GET, PUT } from "../utils/http";
import { IOffer } from "./models";

const {auth, offer} = appConfig.api

/**
 * Методы auth-service.
 */
export const daylesfordService = {

     // auth
     login: (request: any) => POST<any>(`${auth}/login/`, request), // TODO: прописать модели
     logout: () => GET<any>(`${auth}/logout/`), // TODO: прописать модели
     
     // offers
     getOfferList: () => GET<IOffer[]>(`${offer}`),
     getOffer: (id: string) => GET<IOffer>(`${offer}/${id}`),
     editOffer: (request: IOffer) => PUT<IOffer>(`${offer}/${request.id}/`, request),
     createOffer: (request: IOffer) => POST<IOffer>(`${offer}`, request),
};
 
