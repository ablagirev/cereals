import json
from copy import deepcopy
from enum import Enum

from main import models


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

    @classmethod
    def read_map(cls):
        return {
            cls.active: "Активный",
            cls.archived: "Архивирован",
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
    main = "main"

    @classmethod
    def read_map(cls):
        return {cls.simple: "Упрощенная", cls.main: "Основной"}

    @classmethod
    def readable(cls):
        map_ = cls.read_map()
        return ((key.value, map_[key]) for key in cls)

    @classmethod
    def values(cls):
        map_ = cls.read_map()
        return (map_[key] for key in cls)


class DocumentTypes(Enum):
    other = "other"
    specification = "specification"
    contract_for_signing = "contract_for_signing"
    payment_invoice = "payment_invoice"
    quality_certificate = "quality_certificate"
    contract = "contract"
    payment_order = "payment_order"
    verification_act = "verification_act"
    book_of_purchases_or_sales = "book_of_purchases_or_sales"
    letter_for_refund = "letter_for_refund"
    loading_plan = "loading_plan"
    report_on_the_shipped_goods = "report_on_the_shipped_goods"
    additional_payment_invoice = "additional_payment_invoice"
    universal_transfer_document = "universal_transfer_document"

    @classmethod
    def read_map(cls):
        return {
            cls.other: "Прочее",
            cls.specification: "Спецификация",
            cls.contract_for_signing: "Договор на подписание",
            cls.payment_invoice: "Счет на оплату",
            cls.quality_certificate: "Сертификат качества",
            cls.contract: "Договор",
            cls.payment_order: "Платежное поручение",
            cls.verification_act: "Акт сверки",
            cls.book_of_purchases_or_sales: "Книга покупок/продаж",
            cls.letter_for_refund: "Письмо на возврат",
            cls.loading_plan: "План погрузки",
            cls.report_on_the_shipped_goods: "Отчет о погруженном товаре",
            cls.additional_payment_invoice: "Счет на доплату",
            cls.universal_transfer_document: "Универсальный передаточный документ",
        }

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


def default_primitive(spec: "models.SpecificationsOfProduct") -> str:
    data = json.loads(spec.spec).get("value", None) if spec.spec else None
    return json.dumps(data) if data else None


def default_range(spec: "models.SpecificationsOfProduct") -> str:
    data = json.loads(spec.spec) if spec.spec else None
    result = {} if data else None
    if data and (min_ := data.get("min")):
        result["min"] = min_
    if data and (max_ := data.get("min")):
        result["max"] = max_
    return json.dumps(result or None)


DEFAULT_VALUES_GETTER = {
    SpecificationTypes.int: default_primitive,
    SpecificationTypes.decimal: default_primitive,
    SpecificationTypes.str: default_primitive,
    SpecificationTypes.range: build_range_spec,
    SpecificationTypes.bool: default_primitive,
}
