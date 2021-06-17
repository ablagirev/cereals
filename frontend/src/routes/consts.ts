
const DEALINGS = 'dealings'
const OFFERS = 'offers'

/**
 * Содержит конфигурацию роутов приложения.
 */
export const routes = {
    root: {
        key: 'root',
        path: '/',
    },
    dealings: {
        key: DEALINGS,
        path: `/${DEALINGS}`,
        
    },
    offers: {
        key: OFFERS,
        path: `/${OFFERS}`,
        list: {
            key: 'list',
            path: `/${OFFERS}/list`,
        },
        create: {
            key: 'create',
            path: `/${OFFERS}/create`,
        },
        edit: {
            key: 'edit',
            path: `/${OFFERS}/edit/:id`,
        },
    },
    analytics: {
        key: 'analytics',
        path: '/analytics',
    },
    farmers: {
        key: 'farmers',
        path: '/farmers',
    },
    settings: {
        key: 'settings',
        path: '/settings',
    },
};
