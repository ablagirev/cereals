import json
from copy import deepcopy
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
    active = "active"
    finished = "finished"
    failed = "failed"

    @classmethod
    def read_map(cls):
        return {
            cls.active: "Новый",
            cls.finished: "Завершена",
            cls.failed: "Проваленная сделка",
        }

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)


class ProfileType(Enum):
    admin = "admin"
    farmer = "customer"
    provider = "crm"

    @classmethod
    def read_map(cls):
        return {cls.admin: "Админ", cls.farmer: "Фермер", cls.provider: "Провайдер"}

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)


class TaxTypes(Enum):
    simple = "simple"

    @classmethod
    def read_map(cls):
        return {cls.simple: "Упрощенная"}

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)


VALUES_SCHEMAS = {
    SpecificationTypes.int: {"type": ["number"]},
    SpecificationTypes.decimal: {"type": ["number"]},
    SpecificationTypes.str: {"type": ["string"]},
    SpecificationTypes.bool: {"type": ["boolean"]},
    SpecificationTypes.range: {
        "type": "object",
        "properties": {"min": {"type": ["number"]}, "max": {"type": ["number"]}},
    },
}


def build_range_spec(specification):
    schema = deepcopy(VALUES_SCHEMAS[SpecificationTypes(specification.type)])
    spec: dict = json.loads(specification.spec)
    required = spec.get("required", [])
    if "min" not in required:
        schema["properties"]["min"]["type"].append("null")
    if "max" not in required:
        schema["properties"]["max"]["type"].append("null")
    if required:
        schema["required"] = required
    if not spec.get("isEditableMin"):
        schema["properties"]["min"]["type"] = ["null"]
    if not spec.get("isEditableMax"):
        schema["properties"]["max"]["type"] = ["null"]
    if not spec.get("isEditableMax") and not spec.get("isEditableMin"):
        schema = {"type": "null"}
    return schema


def build_primitive_schema(specification):
    schema = deepcopy(VALUES_SCHEMAS[SpecificationTypes(specification.type)])
    return schema


SCHEMA_BUILDERS = {
    SpecificationTypes.int: build_primitive_schema,
    SpecificationTypes.decimal: build_primitive_schema,
    SpecificationTypes.str: build_primitive_schema,
    SpecificationTypes.range: build_range_spec,
    SpecificationTypes.bool: build_primitive_schema,
}
