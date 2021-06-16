import { appConfig } from "../config";
import { POST } from "../utils/http";

const AUTH = 'auth'

/**s
 * Методы auth-service.
 */
export const authService = {
     login: (request: any) => POST<any>(`${appConfig.api.authService}/${AUTH}/login`, request), // TODO: прописать модели
     logout: (request: any) => POST<any>(`${appConfig.api.authService}/${AUTH}/logout`, request), // TODO: прописать модели
};
