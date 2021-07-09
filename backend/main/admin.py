from django.contrib import admin

from . import models


@admin.register(models.Offer)
class Offer(admin.ModelAdmin):
    list_display = (
        "title",
        "status",
    )
