import axios from "axios";
import { appConfig } from "../config";
import { POST, GET } from "../utils/http";

const {auth, offer} = appConfig.api

/**s
 * Методы auth-service.
 */
export const daylesfordService = {

     // auth
     login: (request: any) => POST<any>(`${auth}/login/`, request), // TODO: прописать модели
     logout: (request: any) => POST<any>(`${auth}/logout/`, request), // TODO: прописать модели
     
     // offers
     getOfferList: () => GET<any>(`${offer}`), // TODO: прописать модели
};
 
