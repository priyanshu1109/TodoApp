# Generated by Django 2.0 on 2020-06-10 12:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('todoapp', '0012_auto_20200601_1646'),
    ]

    operations = [
        migrations.CreateModel(
            name='TodoAccess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('todolist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todoapp.TodoList')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
