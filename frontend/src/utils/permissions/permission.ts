import isEmpty from 'lodash-es/isEmpty';
import isFunction from 'lodash-es/isFunction';
import isNil from 'lodash-es/isNil';
import { ICheckPermissions } from '../models';

/**
 * Проверяет наличие необходимых разрешений для доступа.
 *
 * @param {string[]} userPermissions Текущие разрешения пользователя.
 * @param {string[]} allowedPermissions Необходимые для доступа разрешения.
 */
export const hasPermissions = (userPermissions: string[], allowedPermissions: string[]) => {
    if (isEmpty(allowedPermissions)) {
        return true;
    }

    return userPermissions.some((userPermission: string) => allowedPermissions.includes(userPermission)
    );
};

/**
 * Проверяет наличие необходимых разрешений для доступа с учетом признака наличия доступа.
 *
 * @param {string[]} userPermissions Права текущего пользователя.
 * @param {ICheckPermissions} options Опции, на основе которых проверяется есть ли необходимые разрешения.
 */
export const checkPermissions = (userPermissions: string[], options: ICheckPermissions) => {
    const {allowed, enabled} = options;

    if (!isNil(enabled)) {
        return isFunction(enabled) ? enabled() : enabled;
    }

    return hasPermissions(userPermissions, allowed);
};
