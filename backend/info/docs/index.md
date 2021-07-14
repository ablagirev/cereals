# API

В данной документации описывается полное использование публичных интерфейслв для интеграции

## Таблица сущностей

| Наименование| Значение     |
| :----------- | :-----------: |
| Offer       | Предложение |
| Order       | Сделака     |
| Specification | Показатель |
| Warehouse | Склад |
| Culture | Культура |

## User Guide

Для начала работы требуется запросить пользователя для дальнейшей аутификации, стоит отметить что в системе существует
три типа пользователей **супер админ** (владельцы пользователя), **клиенты** (фермеры), и **заказчики** (создает offer).

### Вход

Для работы со всеми эндпоинтами (кроме самого логина) требуется произвести jwt аутентификацию.

Для этого требуется сделать:

```
POST /api/auth/login/ BODY {"login": "<Ваш логин>", "password": "<Ваш пароль>"}
```

После этого в отвтете вы получете jwt токен.

### Получение списка предложений

#### Общее

**Внимание!**
Перед созданием предложений треубется заранее напольнить сервис актульными состояниями: Культур, продуктов и их
показателей с типом и ед измерения.

#### WEB

Для получения сделок достаточно сделать запрос на

```
GET /api/offer/
```

В ответ будет выдан список всех предложений в которых текущий пользователь указан как создатель.

#### MOBILE

Для получения сделок достаточно сделать запрос на

```
GET /api/offer/grouped/
```

В ответ будет выдан список всех предложений сгруппированный по культуре продуктов и будут показаны все предложения.

### Создание предложений

#### WEB

Для создания предложений требуется сделать один пост запрос:

```
POST /api/offer/ BODY {
  "product": {
    "id": 0
  }, // ID продукта
  "warehouse": {
    "id": 0
  }, // ID склада назначения
  "cost": 0, // Стоимость которую указывает заказчик.
  "volume": 0,
  "specifications": [
    {
      "id": 0,
       "value": "string"
    }
}
```

Стоит отметить что поле **specifications** в теле запроса строиться на основе ранее запрошенной спецификации продукта

```
GET /api/products/
```

Возращает список продуктов со спецификацией

либо

```
GET /api/products/<product-id>/
```

Если требуется информация по конкретному продукту.

Все обязательные показатели должны быть переданы в **specifications** (если показатели необязательные то его можно не
указывать либо указать со значением null)

### Формат работы с показателями продуктов

#### Общее

Все обртаботка и работа со значениями видеться либо с примитивными типами данных либо с JSON объектами, далее подробнее:

есть 4 типа значений показателей:

* int - целочисленное значение
* decimal - вещественное значение
* string - строковое значение
* bool - логическое значение
* range - отрезок либо луч

Внимание! на выдачу все спецификации (они берутся из справочников продуктов **specifications**) показателей выдается в
поле **spec** в строковом представлении например:

```json 
{"type": "integer", "spec": "{\"value\": 1, \"isEditable\": true }", ... }
```

Это пример целочисленного показателя

```json 
{"type": "range", "spec": "{\"min\": 0, \"max\": 10}", ... }
```

Это пример показателя с ограничениями (отрезок) от 0 до 10

```json 
{"type": "range", "spec": "{\"min\": 5, \"isEditableMin\": false, \"isEditableMax\": true}", ... }
```

Это пример показателя с ограничениями (луч) от 5

Вся строгая спецификация ниже:

1) **integer**

```typescript
{
    spec: number | null;
    isEditable: true | false;
}
```

2) **decimal**

```typescript
{
    spec: number | null;
    isEditable: true | false;
}
```

3) **string**

```typescript
{
    spec: string | null;
    isEditable: true | false;
}
```

4) **range**

```typescript
{
    min: number | undefined;
    max: number | undefined;
    isEditableMin: true | false;
    isEditableMax: true | false;
}
```

### Передача значений показателей (только WEB)

для пердачи показателей требуется в теле запроса на создание предложения (см выше) в поле **specifications** требуется
указывать список показатейлей в слудеющум формате:

```typescript
[
    {id: number, value: true | false | number | string | Object | null}
]
```

где **value** зависит от типа показателя:

1) integer, deciaml - number
2) range:

```typescript
   {
    min: number | null;
    max: number | null
}
```
3) bool - true либо false
   