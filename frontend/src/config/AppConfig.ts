import { STORAGE_TOKEN_NAME, STORAGE_TOKEN_TYPE } from "../hooks/consts";

const apiNames = {
    auth: 'auth',
    offer: 'offer',
    product: 'product',
    warehouse: 'warehouse'
};

const buildEndpoint = (name: string) => {
    return `/${name}`
}

/**
 * Хранилище конфигурации приложения.
 */
class AppConfig {

    get api() {
        const {
            auth,
            offer,
            product,
            warehouse
        } = apiNames;

        return {
            auth: buildEndpoint(auth),
            offer: buildEndpoint(offer),
            product: buildEndpoint(product),
            warehouse: buildEndpoint(warehouse),
            token: localStorage.getItem(STORAGE_TOKEN_NAME),
            tokenType: localStorage.getItem(STORAGE_TOKEN_TYPE),
        };
    }
}

export const appConfig = new AppConfig();