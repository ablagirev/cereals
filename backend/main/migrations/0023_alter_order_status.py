# Generated by Django 3.2.4 on 2021-07-11 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0022_alter_order_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('active', 'Новый'), ('finished', 'Завершена'), ('failed', 'Проваленная сделка')], default='active', max_length=50),
        ),
    ]