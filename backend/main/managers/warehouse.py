from dataclasses import dataclass

from django.contrib.auth.models import User
from django.db import models


@dataclass
class AddWarehousePayload:
    title: str
    address: str


class WarehouseManager(models.Manager):
    def create_for_user(self, user: User, payload: AddWarehousePayload):
        return self.create(
            owner_id=user.id, address=payload.address, title=payload.title
        )
