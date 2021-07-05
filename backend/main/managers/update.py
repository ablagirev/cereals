from django.db import models


class DefaultUpdateManager(models.Manager):
    def update(self, instance: models.Model, **kwargs):
        for attr, value in kwargs.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
