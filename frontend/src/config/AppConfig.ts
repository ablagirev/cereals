import { STORAGE_TOKEN_NAME } from "../hooks/consts";

const apiNames = {
    auth: 'auth',
    offer: 'offer'
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
            offer
        } = apiNames;

        return {
            auth: buildEndpoint(auth),
            offer: buildEndpoint(offer),
            token: localStorage.getItem(STORAGE_TOKEN_NAME)
        };
    }
}

export const appConfig = new AppConfig();