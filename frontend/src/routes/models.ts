import { ComponentType, ReactNode } from "react";

import {StaticContext} from 'react-router';
import {RouteComponentProps} from 'react-router-dom';


/**
 * Модель конфигурации секции навигации приложения.
 *
 * @prop {string} label Названия секции.
 * @prop {Function} [icon] Иконка секции.
 * @prop {TAppNavItem[]} items Массив едениц навигации секции.
 */
 export type TAppNavSection = {
    label: string;
    icon?: ComponentType<{}>;
    items: TAppNavItem[];
};

/**
 * Модель конфигурации единицы навигации приложения.
 *
 * @prop {IAppNavigationRoute} route Параметры роутинга.
 * @prop {IAppNavigationMenuItem} element Параметры элемента меню.
 * @prop {TAppNavBadge} [badge] Дополнительная информация для отображения в бейдже.
 * @prop {Function} [onNavClick] Обработчик клика на элемент навигации.
 */
 export type TAppNavItem = TAppNavCommon & {
    route: TAppNavRoute;
    element?: TAppNavElement;
    badge?: TAppNavBadge;
    onNavClick?: () => void;
};

/**
 * Модель общих свойств элемента навигации приложения.
 *
 * @prop {string} path Путь.
 * @prop {string[]} allowed Список разрешений, при наличии которых доступ будет разрешен.
 * @prop {string} [linkTo] Альтернативный путь, используемый специальным образом для
 * ссылок (например, когда при переходе по роуту нужно установить параметр в URL).
 * @prop {boolean | () => boolean} [enabled] Признак/функция проверки доступности элемента навигации.
 * @prop {TAppNavItem[]} [children] Дочернее меню.
 */
 export type TAppNavCommon = {
    path: string;
    allowed: string[];
    linkTo?: string;
    enabled?: boolean | (() => boolean);
    children?: TAppNavItem[];
};

/**
 * Модель параметров роутинга элемента навигации приложения.
 *
 * @prop {Function} render Рендер-функция react-router.
 * @prop {boolean} [exact] Признак, необходимо ли полное совпадение пути для обработки.
 */
 export type TAppNavRoute = {
    render: (props: RouteComponentProps<{ [x: string]: string | undefined; }, StaticContext, unknown>) => ReactNode;
    exact?: boolean;
};

/**
 * Модель параметров элемента меню навигации приложения.
 *
 * @prop {string} label Текст элемента меню.
 * @prop {string} [title] Всплывающая подсказка элемента меню.
 * @prop {ComponentType} [icon] Иконка элемента меню.
 * @prop {Function} [badge] Элемент, отображаемый в пункте меню (зачастую бадж).
 */
 export type TAppNavElement = {
    label?: string;
    hidden?: boolean;
    title?: string;
    icon?: ComponentType;
    badge?: () => JSX.Element;
};


/**
 * Модель параметров бейджа для элемента меню навигации приложения.
 *
 * @prop {string | number | JSX.Element} content Содержимое бейджа.
 * @prop {string} [className] Дополнительное имя класса.
 */
 export type TAppNavBadge = {
    content: string | number | JSX.Element;
    className?: string;
};