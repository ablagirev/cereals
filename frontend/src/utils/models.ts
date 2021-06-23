/**
 * Модель свойств проверки необходимых для доступа разрешений.
 *
 * @prop {string[]} allowed Список необходимых для доступа разрешений.
 * @prop {boolean | () => boolean} [enabled] Функция/признак для определения наличия доступа.
 * Если определена, будет использована с большим приоритетом, чем список разрешений.
 * @param {boolean} [checkRoot] Проверять ли факт наличия "корневого" разрешения. Используется в случае разрешений с указанием ресурсов.
 * Например: при включенном флаге разрешение DICTIONARIES_VIEW#SKMB пройдет проверку, если к корневому ресурсу DICTIONARIES_VIEW есть доступ.
 */
 export interface ICheckPermissions {
    allowed: string[];
    enabled?: boolean | (() => boolean);
    checkRoot?: boolean;
}

/**
 * Модель хука useParams.
 *
 * @prop {string} [id] ID предложения.
 */
 export interface IRouteParams {
    id?: string;
}