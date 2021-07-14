import json

import pytest
from jsonschema import validate, ValidationError

from main.enums import SCHEMA_BUILDERS, SpecificationTypes
from main import models


def test_range_schema():
    spec = models.SpecificationsOfProduct(
        required=True,
        type=SpecificationTypes.range,
        spec='{"isEditableMin": true, "isEditableMax": true, "required": ["min", "max"]}',
    )
    validate(
        instance=json.loads('{"min": 0, "max": 10}'),
        schema=SCHEMA_BUILDERS[SpecificationTypes(spec.type)](spec),
    )

    spec = models.SpecificationsOfProduct(
        required=True,
        type=SpecificationTypes.range,
        spec='{"isEditableMin": true, "isEditableMax": true, "required": ["min", "max"]}',
    )
    with pytest.raises(ValidationError):
        validate(
            instance=json.loads('{"max": 10}'),
            schema=SCHEMA_BUILDERS[SpecificationTypes(spec.type)](spec),
        )

    spec = models.SpecificationsOfProduct(
        required=True,
        type=SpecificationTypes.range,
        spec='{"isEditableMin": true, "isEditableMax": true, "required": ["max"]}',
    )
    validate(
        instance=json.loads('{"max": 10}'),
        schema=SCHEMA_BUILDERS[SpecificationTypes(spec.type)](spec),
    )

    spec = models.SpecificationsOfProduct(
        required=True,
        type=SpecificationTypes.range,
        spec='{"isEditableMin": true, "isEditableMax": false, "required": ["max"]}',
    )
    with pytest.raises(ValidationError):
        validate(
            instance=json.loads('{"max": 10}'),
            schema=SCHEMA_BUILDERS[SpecificationTypes(spec.type)](spec),
        )

    spec = models.SpecificationsOfProduct(
        required=True,
        type=SpecificationTypes.range,
        spec='{"isEditableMin": false, "isEditableMax": false, "required": []}',
    )
    with pytest.raises(ValidationError):
        validate(
            instance=json.loads('{"max": 10}'),
            schema=SCHEMA_BUILDERS[SpecificationTypes(spec.type)](spec),
        )
