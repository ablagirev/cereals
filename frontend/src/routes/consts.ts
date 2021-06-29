
const ORDERS = 'orders'
const OFFERS = 'offers'

/**
 * Содержит конфигурацию роутов приложения.
 */
export const routes = {
    root: {
        key: 'root',
        path: '/',
    },
    orders: {
        key: ORDERS,
        path: `/${ORDERS}`,  
        list: {
            key: 'list',
            path: `/${ORDERS}/list`,
        },
        orderTimeline: {
            key: 'order-timeline',
            path: `/${OFFERS}/order/:id`,
        },
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
