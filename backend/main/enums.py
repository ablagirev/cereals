from enum import Enum


class SpecificationTypes(Enum):
    int = "int"
    range = "range"
    str = "string"
    bool = "bool"
    decimal = "decimal"

    @classmethod
    def read_map(cls):
        return {
            cls.int: "Целочисленное",
            cls.range: "Диапозон",
            cls.str: "Строковое",
            cls.bool: "Логическое",
            cls.decimal: "Десятичное",
        }

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)


class OfferStatus(Enum):
    active = "active"
    archived = "archived"
    accepted = "accepted"
    pending = "pending"
    partial = "partial"

    @classmethod
    def read_map(cls):
        return {
            cls.active: "Активный",
            cls.archived: "Архивирован",
            cls.accepted: "Принят",
            cls.pending: "В процессе",
            cls.partial: "Частично выполнен",
        }

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)


class OrderStatus(Enum):
    @classmethod
    def read_map(cls):
        return {}

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)
