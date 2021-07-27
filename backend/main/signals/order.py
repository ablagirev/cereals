from django.db.models.signals import post_save
from django.dispatch import receiver

from main.generation_doc import gen_doc_specification, gen_doc_contract, gen_doc_payment_invoice
from main import models


@receiver(post_save, sender=models.Order)
def signal_post_save(instance, created, **kwargs):
    if created:
        generation_initial_doc(instance)


def generation_initial_doc(order):
    docs_id = [
        gen_doc_specification(),
        gen_doc_contract(),
        gen_doc_payment_invoice()
    ]
    docs = models.Document.objects.filter(id__in=docs_id)
    order.documents.set(docs)
