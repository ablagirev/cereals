const currentStage = process.env.STAGE;
const isDevelopment = process.env.NODE_ENV === 'development';
export const proxyPath = 'microservices'; // TODO: заменить на актуальный

const buildEndpoint = (name: string, useProxyForDevelopment = false) => {
    const {hostname, protocol} = window.location;
    const appDomain = isDevelopment ? `fake.cloud` : hostname.replace(/.*?\./, ''); // TODO: заменить на актуальный
    
    if (isDevelopment && useProxyForDevelopment) {
        return `${window.location.origin}/${proxyPath}/${name}`;
    }
    return `${protocol}//${name}.${appDomain}`;
};

const apiNames = {
    authService: 'auth-service', // TODO: добавить нужные сервисы
};

/**
 * Хранилище конфигурации приложения.
 */
class AppConfig {

    private _api: any = {};

    /**
     * Инициализация нестатичных изначально параметров конфигурации.
     */
    public init = () => {
        const {
            authService,
        } = apiNames;

        this._api.authService = buildEndpoint(authService, true);

    };

    get api() {
        return this._api;
    }
}

export const appConfig = new AppConfig();