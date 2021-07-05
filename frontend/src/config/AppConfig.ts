import { STORAGE_TOKEN_NAME, STORAGE_TOKEN_TYPE } from "../hooks/consts";

const apiNames = {
    auth: 'auth',
    offer: 'offer',
    product: 'product',
    warehouse: 'warehouse',
    order: 'order'
};

const buildEndpoint = (name: string) => {
    return `/api/${name}`
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
            warehouse,
            order
        } = apiNames;

        return {
            auth: buildEndpoint(auth),
            offer: buildEndpoint(offer),
            product: buildEndpoint(product),
            warehouse: buildEndpoint(warehouse),
            order: buildEndpoint(order),
            token: localStorage.getItem(STORAGE_TOKEN_NAME),
            tokenType: localStorage.getItem(STORAGE_TOKEN_TYPE),
        };
    }
}

export const appConfig = new AppConfig();